class CameraHelper {
  constructor({ video, canvas, startBtn, captureBtn, imagePreview, photoInput }) {
    this._video = video;
    this._canvas = canvas;
    this._photoInput = photoInput;
    this._imagePreview = imagePreview;
    this._startBtn = startBtn;
    this._captureBtn = captureBtn;
    this._stream = null;

    this._startBtn.addEventListener('click', () => this.start());
    this._captureBtn.addEventListener('click', () => this.capture());
  }

  static addNewStream(stream) {
    if (!window.currentStreams) window.currentStreams = [];
    window.currentStreams.push(stream);
  }

  static stopAllStreams() {
    if (window.currentStreams) {
      window.currentStreams.forEach((stream) => {
        stream.getTracks().forEach((track) => track.stop());
      });
      window.currentStreams = [];
    }
  }

  async start() {
    try {
      this._stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      CameraHelper.addNewStream(this._stream);
      this._video.srcObject = this._stream;
      this._video.style.display = 'block';
      this._startBtn.style.display = 'none';
      this._captureBtn.style.display = 'block';
    } catch (err) {
      alert('Gagal mengakses kamera. Pastikan Anda memberikan izin.');
    }
  }

  capture() {
    this._canvas.width = this._video.videoWidth;
    this._canvas.height = this._video.videoHeight;
    this._canvas.getContext('2d').drawImage(this._video, 0, 0);
    
    this._canvas.toBlob((blob) => {
      const file = new File([blob], "story-photo.jpg", { type: "image/jpeg" });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      this._photoInput.files = dataTransfer.files;
    }, 'image/jpeg');

    this._imagePreview.src = this._canvas.toDataURL('image/jpeg');
    this._imagePreview.style.display = 'block';
    this.stop();
  }

  stop() {
    if (this._stream) {
      this._stream.getTracks().forEach(track => track.stop());
    }
    this._video.style.display = 'none';
    this._captureBtn.style.display = 'none';
    this._startBtn.style.display = 'block';
  }
}
export default CameraHelper;