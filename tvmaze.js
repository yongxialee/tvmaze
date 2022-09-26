"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const default_img = "https://tinyurl.com/tv-missing";
//console.log(default_img);
/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
console.log(res);
let shows = res.data.map((result) =>{
  let show = result.show;
  return {
    id : show.id,
    name : show.name,
    summary : show.summary,
    image : show.image? show.image.medium : default_img

  };
} );
return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $item = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="car" data-show-id="${show.id}>
           <img 
              src="${show.image}" 
              class="class-img-top">
           <div class="class-body">
             <h5 class="card-title">${show.name}</h5>
             <div><p>${show.summary}</p></div>
             <button class="btn btn-outline-light btn-sm get-episodes">
               Episodes
             </button>
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

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  let query =$("#search-query").val();
  if(!query) return;
  $episodesArea.hide();
  let shows = await getShowsByTerm(term);
  populateShows(shows);
});
}


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }
async function getEpisodes(id){
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = res.data.map((episode) =>({
    id: episode.id,
    name: episode.name,
    season:episode.season,
    number:episode.number

  }));
  return episodes;
}
getEpisodes();
/** Write a clear docstring for this function... */

 function populateEpisodes(episodes) { 
    const $episodesList = $("#episodes-list");
  $episodesList.empty();
    
  for (let episode of episodes) {
    let $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append($item);
  }

  $("#episodes-area").show();
 }
//

/** Handle click on show name. */

$showsList.on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});