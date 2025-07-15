class LoginPresenter {
  constructor({ view, model }) { this._view = view; this._model = model; }
  async login({ email, password }) {
    try {
      this._view.showStatus('Memproses...');
      await this._model.login({ email, password });
      this._view.navigateToHome();
    } catch (error) { this._view.showStatus(`Error: ${error.message}`, true); }
  }
}
export default LoginPresenter;