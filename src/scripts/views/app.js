import routes from '../routes/routes';
import * as UrlParser from '../routes/url-parser';
import SessionStorage from '../utils/session-helper';
import { performViewTransition } from '../utils/view-transition';
import NotFoundPage from './pages/not-found-page';
import NotificationHelper from '../utils/notification-helper';

class App {
  constructor({ content }) {
    this._content = content;
    this._notificationHelperInitialized = false;
  }

  async renderPage() {
    const userIsLoggedIn = !!SessionStorage.getUserToken();
    const url = UrlParser.getActivePathname();
    
    const protectedPages = ['/', '/home', '/add-story', '/favorites'];
    const authPages = ['/login', '/register'];

    if (!userIsLoggedIn && protectedPages.includes(url)) {
      window.location.hash = '/login';
      return; 
    }

    if (userIsLoggedIn && authPages.includes(url)) {
      window.location.hash = '/home';
      return;
    }
    
    const page = routes[url] || NotFoundPage;

    performViewTransition(async () => {
      this._content.innerHTML = await page.render();
      await page.afterRender();
      this._updateUserUI();
    });
  }

   _updateUserUI() {
    const token = SessionStorage.getUserToken();
    const loginLogoutLink = document.querySelector('#login-logout-link');
    const subscribeItem = document.querySelector('#subscribe-item');

    const setupLogoutHandler = (buttonId) => {
      const logoutButton = document.getElementById(buttonId);
      if (logoutButton) {
        logoutButton.removeEventListener('click', this._logoutHandler);
        this._logoutHandler = this._logout.bind(this);
        logoutButton.addEventListener('click', this._logoutHandler);
      }
    };

    if (token) {
      if (loginLogoutLink) {
        loginLogoutLink.innerHTML = '<a href="#" id="logout-button">Logout</a>';
        setupLogoutHandler('logout-button');
      }
      if (subscribeItem) {
        subscribeItem.style.display = 'list-item';
        if (!this._notificationHelperInitialized) {
          this._setupNotifications();
          this._notificationHelperInitialized = true;
        }
      }
    } else {
      if (loginLogoutLink) loginLogoutLink.innerHTML = '<a href="#/login">Login</a>';
      if (subscribeItem) subscribeItem.style.display = 'none';
      this._notificationHelperInitialized = false;
    }
  }

  _setupNotifications() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        const subscribeButton = document.querySelector('#subscribe-notif-button');
        if (subscribeButton) {
          NotificationHelper.init({ subscribeButton, registration });
        }
      });
    }
  }

  _logout(event) {
    event.preventDefault();
    SessionStorage.removeUserToken();
    window.location.hash = '/login';
    this.renderPage();
  }
}

export default App;