import cardTpl from './templates/card.hbs';
import ApiService from './apiService';
import LoadMoreBtn from './load-more-btn';
import './styles.css';

const refs = {
  serchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.js-gallery'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const apiService = new ApiService();

refs.serchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
  e.preventDefault();

  clearImageContainer();
  apiService.query = e.currentTarget.elements.query.value;

  if (apiService.query.trim()) {
    loadMoreBtn.show();
    apiService.resetPage();
    clearImageContainer();
    fetchImages();
  } else {
    alert('Введи что-то нормальное!!!');
  }
}

function fetchImages() {
  loadMoreBtn.disable();
  apiService
    .fetchImages()
    .then(hits => {
      appendImagesMarcup(hits);
      if (hits.length < 12 || hits.length === 0) {
        loadMoreBtn.hide();
        return;
      }
      loadMoreBtn.enable();
    })
    .catch(error => console.log(error));
}

function appendImagesMarcup(hits) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', cardTpl(hits));
}

function clearImageContainer() {
  refs.galleryContainer.innerHTML = '';
}
