class AddStoryPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }

  async addStory(formData) {
    const description = formData.get('description');
    const photo = formData.get('photo');

    if (!photo || !description) {
      this._view.showStatus('Foto dan deskripsi tidak boleh kosong.', true);
      return;
    }
    try {
      this._view.showStatus('Mengunggah...');
      await this._model.addNewStory(formData);
      this._view.showSuccessAndNavigate(description);
    } catch (error) {
      this._view.showStatus(`Error: ${error.message}`, true);
    }
  }
}
export default AddStoryPresenter;