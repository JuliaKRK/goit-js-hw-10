import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelectEl = document.querySelector('#placeholderSingle');
const loaderEl = document.querySelector('.loader');
const catInfoEl = document.querySelector('.cat-info');

function showLoader() {
  loaderEl.style.display = 'block';
}

function hideLoader() {
  loaderEl.style.display = 'none';
}

function showError() {
  Notiflix.Report.failure(
    'Error',
    'Oops! Something went wrong! Try reloading the page!'
  );
}

function hideCatInfo() {
  catInfoEl.style.display = 'none';
}

function clearCatInfo() {
  catInfoEl.innerHTML = '';
}

function populateBreedSelect(breeds) {
  const options = breeds.map(breed => ({
    value: breed.id,
    text: breed.name,
  }));

  new SlimSelect({
    select: '#placeholderSingle',
    data: options,
  });

  breedSelectEl.addEventListener('change', handleBreedSelectChange);
}

function updateCatInfo(cat) {
  const catElement = document.createElement('div');
  catElement.classList.add('container');

  const image = document.createElement('img');
  image.setAttribute('src', cat.url);
  image.alt = 'Cat';
  image.classList.add('cat-image');
  catElement.appendChild(image);

  const catDetails = document.createElement('div');
  catDetails.classList.add('cat-general-description');

  const breedName = document.createElement('h2');
  breedName.textContent = cat.breeds[0].name;
  breedName.classList.add('cat-title');
  catDetails.appendChild(breedName);

  const description = document.createElement('p');
  description.textContent = cat.breeds[0].description;
  description.classList.add('cat-description');
  catDetails.appendChild(description);

  // const spanTemperament = document.createElement(`span`);
  // spanTemperament.textContent = `Temperament:`;
  // spanTemperament.classList.add(`span-temperament`);
  // catDetails.appendChild(spanTemperament);

  const temperament = document.createElement('p');
  temperament.classList.add('cat-temperament');

  const spanLabel = document.createElement('span');
  spanLabel.textContent = 'Temperament: ';
  spanLabel.classList.add('cat-temperament-label');
  temperament.appendChild(spanLabel);

  const spanValue = document.createElement('span');
  spanValue.textContent = cat.breeds[0].temperament;
  spanValue.classList.add('cat-temperament-value');
  temperament.appendChild(spanValue);

  catDetails.appendChild(temperament);

  catElement.appendChild(catDetails);

  catInfoEl.innerHTML = '';
  catInfoEl.appendChild(catElement);
}

function handleBreedSelectChange() {
  const selectedBreedId = breedSelectEl.value;

  hideCatInfo();
  clearCatInfo();
  showLoader();

  fetchCatByBreed(selectedBreedId)
    .then(cat => {
      updateCatInfo(cat);
      hideLoader();
      catInfoEl.style.display = 'block';
    })
    .catch(error => {
      console.error(error);
      hideLoader();
      showError();
    });
}

fetchBreeds()
  .then(breeds => {
    populateBreedSelect(breeds);
    hideLoader();
  })
  .catch(error => {
    console.error(error);
    hideLoader();
    showError();
  });
