import StoryApi from '../../data/api';
import AddStoryPresenter from './add-story-presenter';
import CameraHelper from '../../utils/camera-helper';
import MapPicker from '../../utils/map-picker';

const AddStoryPage = {
  async render() {
    return `
      <div class="container form-container">
        <h2 class="page-title">Tambah Cerita Baru</h2>
        <form id="addStoryForm" novalidate>
          <div class="form-group">
            <label for="photo">Foto Cerita</label>
            <div class="photo-upload-container">
              <div class="photo-options">
                  <button type="button" id="upload-gallery-btn" class="secondary-btn"><i class="fas fa-images"></i> Unggah dari Galeri</button>
                  <button type="button" id="start-camera-btn"><i class="fas fa-camera"></i> Buka Kamera</button>
              </div>
              <input type="file" id="photo" name="photo" accept="image/*" required style="display: none;">
              <div class="photo-preview-container">
                <img id="image-preview" src="#" alt="Pratinjau gambar" style="display:none;">
                <video id="camera-preview" autoplay muted playsinline style="display:none;"></video>
                <canvas id="photo-canvas" style="display:none;"></canvas>
              </div>
              <button type="button" id="capture-photo-btn" style="display:none;"><i class="fas fa-circle-notch"></i> Ambil Gambar</button>
            </div>
          </div>
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" rows="4" required placeholder="Tulis deskripsi ceritamu di sini..."></textarea>
          </div>
          <div class="form-group">
            <label for="map-picker">Pilih Lokasi</label>
            <div id="map-picker" class="map-container"></div>
            <div class="location-inputs">
              <div class="location-group">
                <label for="latitude">Latitude:</label>
                <input type="text" id="latitude" name="lat" readonly>
              </div>
              <div class="location-group">
                <label for="longitude">Longitude:</label>
                <input type="text" id="longitude" name="lon" readonly>
              </div>
            </div>
          </div>
          <button type="submit" id="submit-story-btn">Unggah Cerita</button>
          <p id="status-message" class="status-message"></p>
        </form>
      </div>
    `;
  },

  async afterRender() {
    this._presenter = new AddStoryPresenter({ view: this, model: StoryApi });
    this._isSubmitting = false;

    const addStoryForm = document.querySelector('#addStoryForm');
    const photoInput = document.querySelector('#photo');
    const imagePreview = document.querySelector('#image-preview');
    const cameraPreview = document.querySelector('#camera-preview');
    const uploadGalleryBtn = document.querySelector('#upload-gallery-btn');
    const startCameraBtn = document.querySelector('#start-camera-btn');
    const capturePhotoBtn = document.querySelector('#capture-photo-btn');
    const submitButton = document.querySelector('#submit-story-btn');

    this._camera = new CameraHelper({ 
      video: cameraPreview, 
      canvas: document.querySelector('#photo-canvas'), 
      startBtn: startCameraBtn, 
      captureBtn: capturePhotoBtn, 
      imagePreview: imagePreview, 
      photoInput: photoInput, 
    });

    MapPicker.init('map-picker', (lat, lon) => {
      document.getElementById('latitude').value = lat.toFixed(6);
      document.getElementById('longitude').value = lon.toFixed(6);
    });

    uploadGalleryBtn.addEventListener('click', () => {
      photoInput.click();
    });

    photoInput.addEventListener('change', () => {
      if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreview.style.display = 'block';
          cameraPreview.style.display = 'none';
          if (this._camera) this._camera.stop();
        };
        reader.readAsDataURL(photoInput.files[0]);
      }
    });
    
    if (this._submitHandler) {
      addStoryForm.removeEventListener('submit', this._submitHandler);
    }

    this._submitHandler = async (event) => {
      event.preventDefault();
      if (this._isSubmitting) return;

      this._isSubmitting = true;
      submitButton.disabled = true;
      if (this._camera) this._camera.stop();

      const formData = new FormData();
      formData.append('photo', photoInput.files[0]);
      formData.append('description', document.getElementById('description').value);
      formData.append('lat', document.getElementById('latitude').value);
      formData.append('lon', document.getElementById('longitude').value);
      
      await this._presenter.addStory(formData);

      this._isSubmitting = false;
      submitButton.disabled = false;
    };

    addStoryForm.addEventListener('submit', this._submitHandler);
  },

  showSuccessAndNavigate() {
    this.showStatus('Cerita berhasil diunggah!.', false);
    setTimeout(() => {
      window.location.hash = '/home';
    }, 2000);
  },
  
  showStatus(message, isError) {
    const statusEl = document.getElementById('status-message');
    statusEl.innerText = message;
    statusEl.className = `status-message ${isError ? 'error' : 'success'}`;
  },
};

export default AddStoryPage;