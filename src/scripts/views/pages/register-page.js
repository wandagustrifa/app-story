import StoryApi from '../../data/api';
import RegisterPresenter from './register-presenter';

const RegisterPage = {
  async render() {
    return `<div class="container form-container">
      <h2 class="page-title">Register</h2>
      <form id="registerForm">
        <div class="form-group">
          <label for="nameInput">Nama</label>
          <input type="text" id="nameInput" required>
        </div>
        <div class="form-group">
          <label for="emailInput">Email</label>
          <input type="email" id="emailInput" required>
        </div>
        <div class="form-group">
          <label for="passwordInput">Password (minimal 8 karakter)</label>
          <input type="password" id="passwordInput" minlength="8" required>
        </div>
        <button type="submit">Register</button>
        <p id="status-message" class="status-message"></p>
      </form>
      <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
    </div>`;
  },
  async afterRender() {
    this._presenter = new RegisterPresenter({ view: this, model: StoryApi });
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('nameInput').value;
      const email = document.getElementById('emailInput').value;
      const password = document.getElementById('passwordInput').value;
      await this._presenter.register({ name, email, password });
    });
  },
  navigateToLogin() {
    this.showStatus('Registrasi berhasil! Silakan login.');
    setTimeout(() => { window.location.hash = '/login'; }, 2000);
  },
  showStatus(message, isError) {
    const statusEl = document.getElementById('status-message');
    statusEl.innerText = message;
    statusEl.className = `status-message ${isError ? 'error' : 'success'}`;
  },
};
export default RegisterPage;