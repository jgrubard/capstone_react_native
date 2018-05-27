import axios from 'axios';

const GOT_USER = 'GOT_USER';
const gotUser = user => ({ type: GOT_USER, user });

export const attemptLogin = (credentials, history) => {
  return dispatch => {
    return axios.post('https://immense-escarpment-58025.herokuapp.com/api/sessions', credentials)
      .then(result => result.data)
      .then(token => {
        window.localStorage.setItem('token', token);
        dispatch(getUserFromToken(token));
      })
      .then(() => history.push('/'))
      .catch(err => {
        window.localStorage.removeItem('token');
        return err;
      });
  };
};

export const getUserFromToken = token => {
  return dispatch => {
    return axios.get(`https://immense-escarpment-58025.herokuapp.com/api/sessions/${token}`)
      .then(result => result.data)
      .then(user => dispatch(gotUser(user)))
      .catch(err => {
        window.localStorage.removeItem('token');
        return err;
      });
  };
};

const store = (state = {}, action) => {
  switch (action.type) {
  case GOT_USER:
    return action.user;
  default:
    return state;
  }
};

export default store;