import './css/main.css';
import ImageService from './js/image-service';
import imagesTpl from './template/card.hbs'
import Notiflix from "notiflix";

const refs = {
    searchForm: document.querySelector('.search-form'),
    imagesContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

refs.searchForm.addEventListener('submit', onSearch)
refs.loadMoreBtn.addEventListener('click', onloadMoreBtnClick)

const newImageService = new ImageService();

async function onSearch(e) {
    e.preventDefault();

    newImageService.query = e.currentTarget.elements.searchQuery.value;

    if (newImageService.query === '') {
        return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }

    newImageService.resetPage();
    const response = await newImageService.fetchImages();
    clearImageContainer();
    return await imageMarkup(response);
}

async function onloadMoreBtnClick() {
    const response = await newImageService.fetchImages();
    return imageMarkup(response);
}

function imageMarkup(images) {
    refs.imagesContainer.insertAdjacentHTML('beforeend', imagesTpl(images))
    refs.loadMoreBtn.classList.remove('is-hidden')

    if (images.length === 0) {
        refs.loadMoreBtn.classList.add('is-hidden')
        return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }

    if (images.length < 40) {
        refs.loadMoreBtn.classList.add('is-hidden')
        Notiflix.Notify.info('We are sorry, but you have reached the end of search results.');
    }
}

function clearImageContainer() {
    refs.imagesContainer.innerHTML = '';
}

