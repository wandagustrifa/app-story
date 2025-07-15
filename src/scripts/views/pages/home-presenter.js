class HomePresenter {
  constructor({ view, model }) { this._view = view; this._model = model; }
  async fetchStories() {
    try {
      this._view.showLoading();
      const stories = await this._model.getAllStories();
      this._view.renderStories(stories);
      this._view.initializeMap(stories);
    } catch (error) { this._view.renderError(error.message); } finally { this._view.hideLoading(); }
  }
}
export default HomePresenter;