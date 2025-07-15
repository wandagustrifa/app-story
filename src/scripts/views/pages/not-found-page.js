const NotFoundPage = {
  async render() {
    return `
      <div class="container" style="text-align: center; padding: 4rem 1rem;">
        <h2 class="page-title">404 - Halaman Tidak Ditemukan</h2>
        <p>Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
      </div>
    `;
  },
  async afterRender() {},
};

export default NotFoundPage;