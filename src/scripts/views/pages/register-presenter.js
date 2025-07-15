class RegisterPresenter {
  constructor({ view, model }) { this._view = view; this._model = model; }
  async register({ name, email, password }) {
    try {
      this._view.showStatus('Memproses...');
      await this._model.register({ name, email, password });
      this._view.navigateToLogin();
    } catch (error) { this._view.showStatus(`Error: ${error.message}`, true); }
  }
}
export default RegisterPresenter;