import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

let searchCountryName = '';

searchBox.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange() {
  searchCountryName = searchBox.value.trim();
  if (searchCountryName === '') {
    clearAll();
    return;
  } else
    fetchCountries(searchCountryName)
      .then(countryName => {
        if (countryName.length < 2) {
          createCountryCard(countryName);
          Notiflix.Notify.success('Here your result');
        } else if (countryName.length < 10 && countryName.length > 1) {
          createCountryList(countryName);
          Notiflix.Notify.success('Here your results');
        } else {
          clearAll();
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(() => {
        clearAll();
        Notiflix.Notify.failure('Oops, there is no country with that name.');
      });
}

// add card
function createCountryCard(country) {
  clearAll();
  const c = country[0];
  const readyCard = `<div class="country-card">
        <div class="country-card--header">
            <img src="${
              c.flags.svg
            }" alt="Country flag" width="55", height="35">
            <h2 class="country-card--name"> ${c.name.official}</h2>
        </div>
            <p class="country-card--field">Capital: <span class="country-value">${
              c.capital
            }</span></p>
            <p class="country-card--field">Population: <span class="country-value">${
              c.population
            }</span></p>
            <p class="country-card--field">Languages: <span class="country-value">${Object.values(
              c.languages
            ).join(',')}</span></p>
    </div>`;
  countryInfo.innerHTML = readyCard;
}

// add list
function createCountryList(country) {
  clearAll();
  const readyList = country
    .map(
      c => `<li class="country-list--item">
            <img src="${c.flags.svg}" alt="Country flag" width="40", height="30">
            <span class="country-list--name">${c.name.official}</span>
        </li>`
    )
    .join('');
  countryList.insertAdjacentHTML('beforeend', readyList);
}

// clear all
function clearAll() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
