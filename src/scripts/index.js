import 'regenerator-runtime';
import '../styles/styles.css';
import App from './views/app';

const app = new App({
 content: document.querySelector('#main-content'),
});

const setupDrawer = () => {
 const drawerButton = document.getElementById('drawer-button');
 const navigationDrawer = document.getElementById('navigation-drawer');
 const mainContent = document.querySelector('#main-content');

 drawerButton.addEventListener('click', (event) => {
  event.stopPropagation();
  console.log('Tombol menu diklik!'); 
  navigationDrawer.classList.toggle('open');
 });

 mainContent.addEventListener('click', () => {
  console.log('Konten utama diklik, menutup menu.'); 
  navigationDrawer.classList.remove('open');
 });
};

window.addEventListener('hashchange', () => {
  app.renderPage();
});

window.addEventListener('load', () => {
  setupDrawer();
  app.renderPage();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.bundle.js')
      .then(() => console.log('Service Worker berhasil diregistrasi.'))
      .catch(() => console.error('Registrasi Service Worker gagal.'));
  }
});