import StoryApi from '../../data/api';
import FavoriteStoryDb from '../../data/db-helper';
import { createStoryItemTemplate } from '../templates/template-creator';
import MapHelper from '../../utils/map-helper';

const HomePage = {
 async render() {
  return `<div class="container">
   <h2 class="page-title">Jelajahi Cerita</h2>
   <div id="stories-list" class="stories-list"></div>
   <div id="map" class="map-container"></div>
   <div id="loading-indicator"></div>
   <div id="error-message"></div>
  </div>`;
 },

 async afterRender() {
  this.showLoading();
  try {
   const stories = await StoryApi.getAllStories();
   const favoriteStories = await FavoriteStoryDb.getAllStories();
   this.renderStories(stories, favoriteStories);
   this.initializeMap(stories);
   this._addFavoriteButtonListeners(stories);
  } catch (error) {
   this.renderError(error.message);
  } finally {
   this.hideLoading();
  }
},

 renderStories(stories, favoriteStories) {
  const container = document.getElementById('stories-list');
  if (!container) return;
  container.innerHTML = '';
  const favoriteIds = new Set(favoriteStories.map(story => story.id));
  stories.forEach(story => {
   const isFavorite = favoriteIds.has(story.id);
   container.innerHTML += createStoryItemTemplate(story, isFavorite);
  });
 },

 _addFavoriteButtonListeners(stories) {
  const buttons = document.querySelectorAll('.favorite-btn');
  buttons.forEach(button => {
   button.addEventListener('click', async (event) => {
    event.stopPropagation();
    const storyId = button.dataset.storyId;
    const story = stories.find(s => s.id === storyId);
    const isFavorited = button.classList.contains('favorited');

    if (isFavorited) {
     await FavoriteStoryDb.deleteStory(storyId);
     button.classList.remove('favorited');
     button.innerHTML = '<i class="fa-regular fa-heart"></i>';
    } else {
     await FavoriteStoryDb.putStory(story);
     button.classList.add('favorited');
     button.innerHTML = '<i class="fa-solid fa-heart"></i>';
    }
   });
  });
 },

 showLoading() { document.getElementById('loading-indicator').innerHTML = '<p class="loading">Memuat...</p>'; },
 hideLoading() { document.getElementById('loading-indicator').innerHTML = ''; },
 renderError(message) { document.getElementById('error-message').innerHTML = `<p class="error">Error: ${message}</p>`; },
 initializeMap(stories) { MapHelper.init('map', stories); },
};
export default HomePage;