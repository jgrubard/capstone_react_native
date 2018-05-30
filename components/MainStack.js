import React from 'react';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import { Asset, AppLoading } from 'expo';
import { getOrganizationsFromServer, getUserFromToken } from '../store';

import Home from './Home.js';
import OrganizationInfo from './OrganizationInfo';
import ModalStack from './modals/ModalStack';

const NavStack = createStackNavigator({
  Home: Home,
  Details: OrganizationInfo,
}, {
  headerMode: 'screen',
  initialRouteName: 'Home'
});

const RootStack = createStackNavigator({
  Modals: ModalStack,
  Nav: NavStack
}, {
  initialRouteName: 'Nav',
  headerMode: 'none'
});

class MainStack extends React.Component {
  constructor() {
    super();
    this.state = {
      ready: false
    };
    this.asyncLoad = this.asyncLoad.bind(this);
    this.loadApp = this.loadApp.bind(this);
  }

  asyncLoad() {
    const { getUser, getOrganizations } = this.props;
    return Promise.all([
      AsyncStorage.getItem('token')
        .then(token => {
          if (token) {
            return getUser(token);
          }
        }),
      getOrganizations(),
      Asset.fromModule(require('../assets/images/logo.png')).downloadAsync()
    ]);
  }

  loadApp() {
    this.setState({ ready: true });
  }

  render() {
    if(!this.state.ready) {
      return (
        <AppLoading
          startAsync={ this.asyncLoad }
          onFinish={ this.loadApp }
          onError={ console.warn }
        />
      );
    }
    return (
      <RootStack />
    );
  }
}

const mapState = null;
const mapDispatch = dispatch => ({
  getOrganizations() {
    dispatch(getOrganizationsFromServer());
  },
  getUser(token) {
    return dispatch(getUserFromToken(token));
  }
});

export default connect(mapState, mapDispatch)(MainStack);





/*import React from 'react';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import { Asset, AppLoading } from 'expo';
import { getOrganizationsFromServer, getUserFromToken, getOrganizationRequestsFromServer } from '../store';

import Home from './Home.js';
import OrganizationInfo from './OrganizationInfo';
import ModalStack from './modals/ModalStack';

const NavStack = createStackNavigator({
  Home: Home,
  Details: OrganizationInfo,
}, {
  headerMode: 'screen',
  initialRouteName: 'Home'
});

const RootStack = createStackNavigator({
  Modals: ModalStack,
  Nav: NavStack
}, {
  initialRouteName: 'Nav',
  headerMode: 'none'
});

class MainStack extends React.Component {
  constructor() {
    super();
    this.state = {
      ready: false
    };
    this.asyncLoad = this.asyncLoad.bind(this);
    this.loadApp = this.loadApp.bind(this);
  }

  asyncLoad() {
    const { getOrganizations, getUser, getOrganizationRequests } = this.props;
    return Promise.all([
      AsyncStorage.getItem('token')
        .then(token => {
          if (token) {
            return getUser(token);
          }
        }),
      Asset.fromModule(require('../assets/images/logo.png')).downloadAsync(),
      getOrganizations(),
      getOrganizationRequests()
    ]);
  }

  loadApp() {
    this.setState({ ready: true });
  }

  render() {
    if(!this.state.ready) {
      return (
        <AppLoading
          startAsync={ this.asyncLoad }
          onFinish={ this.loadApp }
          onError={ console.warn }
        />
      );
    }
    return (
      <RootStack />
    );
  }
}

const mapState = null;
const mapDispatch = dispatch => ({
  getOrganizations() {
    dispatch(getOrganizationsFromServer());
  },
  getUser(token) {
    return dispatch(getUserFromToken(token));
  },
  getOrganizationRequests: () => dispatch(getOrganizationRequestsFromServer())
});

export default connect(mapState, mapDispatch)(MainStack);
*/
