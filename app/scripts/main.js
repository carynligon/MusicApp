import $ from 'jquery';

import settings from './settings';

let searchForm = document.querySelector('.search-form');
let input = document.querySelector('.search-query');
let resultsUL = document.querySelector('.search-results');

function listItems(data) {
    console.log(data)
    let results = data.map((artist) => {
        let image = '/assets/images/placeholder.jpg';
        if (artist.images[0]) { image = artist.images[0].url }
        return $(`<li id=${artist.id}>
            <div class="artist-image" style="background-image: url(${image})"></div>
            <h4>${artist.name}</h4>
        </li>`);
    });
    $(resultsUL).append(results);
}

function getArtists(q) {
    $.ajax({
    url: settings.api,
    data: {q},
    success:(d) => { listItems(d.artists.items) }
});
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    getArtists(input.value);
});