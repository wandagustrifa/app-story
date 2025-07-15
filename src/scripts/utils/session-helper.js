const SessionStorage = {
  setUserToken(token) { sessionStorage.setItem('userToken', token); },
  getUserToken() { return sessionStorage.getItem('userToken'); },
  removeUserToken() { sessionStorage.removeItem('userToken'); },
};
export default SessionStorage;