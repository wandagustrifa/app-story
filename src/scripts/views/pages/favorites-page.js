import FavoriteStoryDb from '../../data/db-helper';
import { createStoryItemTemplate } from '../templates/template-creator';

const FavoritesPage = {
  async render() {
    return `
      <div class="container">
        <h2 class="page-title">Cerita Favorit Anda</h2>
        <div id="stories-list" class="stories-list"></div>
        <div id="empty-favorite" class="status-message" style="display: none;">
            <p>Anda belum memiliki cerita favorit.</p>
        </div>
      </div>
    `;
  },
  
  async afterRender() {
    this._renderFavoriteStories();
    this._addRemoveButtonListeners();
  },

  async _renderFavoriteStories() {
    const stories = await FavoriteStoryDb.getAllStories();
    const container = document.getElementById('stories-list');
    const emptyMessage = document.getElementById('empty-favorite');
    
    container.innerHTML = ''; 
    
    if (stories.length === 0) {
      emptyMessage.style.display = 'block';
    } else {
      emptyMessage.style.display = 'none';
      stories.forEach(story => {
        container.innerHTML += createStoryItemTemplate(story, true);
      });
    }
  },

  _addRemoveButtonListeners() {
    const container = document.getElementById('stories-list');
    container.addEventListener('click', async (event) => {
      const favoriteButton = event.target.closest('.favorite-btn');
      if (favoriteButton) {
        event.stopPropagation();
        const storyId = favoriteButton.dataset.storyId;
        await FavoriteStoryDb.deleteStory(storyId);
        const storyItemElement = favoriteButton.closest('.story-item');
        if (storyItemElement) {
          storyItemElement.remove();
        }
        
        const remainingStories = container.querySelectorAll('.story-item');
        if (remainingStories.length === 0) {
          document.getElementById('empty-favorite').style.display = 'block';
        }
      }
    });
  }
};

export default FavoritesPage;