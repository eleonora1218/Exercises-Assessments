"use strict";

const $showsList = $("#shows-list");
const $episodesList = $("#episodes-list");
const $searchForm = $("#search-form");
const missingIMG = 'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300';

async function getShowsByTerm(query) {
  let response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  let shows = response.data.map(result => {
    let show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.original : missingIMG
  };
});
return shows;
}


/** Given list of shows, create markup for each and add to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text text-nowrap">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

 $("#search-form").on("submit", async function handleSearch (e) {
  e.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await getShowsByTerm(query);

  populateShows(shows);
});


async function getEpisodesOfShow(id) {
  let response = await axios({
    url: `https://api.tvmaze.com/shows/${id}/episodes`,
    method: 'GET'
  });
    let episodes = (response.data.map(result => ({
      id: result.id,
      name: result.name,
      season: result.season,
      number: result.number
    }))
    );
    return episodes
  }

function populateEpisodes(episodes) {
  $episodesList.empty();
  for(let episode of episodes){
    let $item = $(`<li>${episode.name} - Season: ${episode.season} / Number: ${episode.number}</li>`);
    $episodesList.append($item);
  }
  $("#episodes-area").show();
}

$showsList.on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
});