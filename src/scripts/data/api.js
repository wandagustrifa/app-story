import CONFIG from '../utils/config';
import SessionStorage from '../utils/session-helper';

const StoryApi = {
  async register({ name, email, password }) {
    const response = await fetch(`${CONFIG.API_BASE_URL}/register`, { 
      method: 'POST', headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ name, email, password }) 
    }
  );
    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);
    return responseJson;
  },

  async login({ email, password }) {
    const response = await fetch(`${CONFIG.API_BASE_URL}/login`, { 
      method: 'POST', headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ email, password }) 
    }
  );
    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);
    SessionStorage.setUserToken(responseJson.loginResult.token);
    return responseJson.loginResult;
  },

  async getAllStories() {
    const token = SessionStorage.getUserToken();
    if (!token) throw new Error('Anda harus login terlebih dahulu.');
    const response = await fetch(`${CONFIG.API_BASE_URL}/stories`, { 
      headers: { Authorization: `Bearer ${token}` } 
    }
  );
    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);
    return responseJson.listStory;
  },

  async addNewStory(formData) {
    const token = SessionStorage.getUserToken();
    if (!token) throw new Error('Anda harus login terlebih dahulu.');
    const response = await fetch(`${CONFIG.API_BASE_URL}/stories`, { 
      method: 'POST', 
      headers: { Authorization: `Bearer ${token}` }, 
      body: formData });
    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);
    return responseJson;
  },

  async subscribeNotification(subscription) {
    const token = SessionStorage.getUserToken();
    if (!token) throw new Error('Anda harus login.');

    const response = await fetch(`${CONFIG.API_BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(subscription),
    });
    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);
    return responseJson;
  },

  async unsubscribeNotification(endpoint) {
    const token = SessionStorage.getUserToken();
    if (!token) throw new Error('Anda harus login.');

    const response = await fetch(`${CONFIG.API_BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ endpoint }),
    });

    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);
    return responseJson;
  },
};

export default StoryApi;