import $ from 'jquery';

import settings from './settings';

function getArtists(q) {
    $.ajax({
    url: settings.api,
    data: {q},
    success:(d) => { console.log(d.artists.items) }
});
}

let searchForm = document.querySelector('.search-form');
let input = document.querySelector('.search-query');
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    getArtists(input.value);
});