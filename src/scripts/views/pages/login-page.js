import StoryApi from '../../data/api';
import LoginPresenter from './login-presenter';

const LoginPage = {
  async render() {
    return `<div class="container form-container">
      <h2 class="page-title">Login</h2>
      <form id="loginForm">
        <div class="form-group">
          <label for="emailInput">Email</label>
          <input type="email" id="emailInput" required>
        </div>
        <div class="form-group">
          <label for="passwordInput">Password</label>
          <input type="password" id="passwordInput" required>
        </div>
        <button type="submit">Login</button>
        <p id="status-message" class="status-message"></p>
      </form>
      <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
    </div>`;
  },
  async afterRender() {
    this._presenter = new LoginPresenter({ view: this, model: StoryApi });
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('emailInput').value;
      const password = document.getElementById('passwordInput').value;
      await this._presenter.login({ email, password });
    });
  },
  navigateToHome() { window.location.hash = '/home'; },
  showStatus(message, isError) {
     const statusEl = document.getElementById('status-message');
     statusEl.innerText = message;
     statusEl.className = `status-message ${isError ? 'error' : 'success'}`;
  },
};
export default LoginPage;