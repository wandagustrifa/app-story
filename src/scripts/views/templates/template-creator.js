const createStoryItemTemplate = (story, isFavorite) => `
  <article class="story-item" tabindex="0">
    <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" data-story-id="${story.id}" aria-label="${isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}">
      <i class="fa-${isFavorite ? 'solid' : 'regular'} fa-heart"></i>
    </button>
    <img src="${story.photoUrl}" alt="Gambar cerita oleh ${story.name}">
    <div class="story-item-content">
      <h3>${story.name}</h3>
      <p>${story.description}</p>
      <p class="story-date">${new Date(story.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })}</p>
    </div>
  </article>
`;

export { createStoryItemTemplate };