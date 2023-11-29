var previous = 'home';

const navItems = document.querySelectorAll('.nav-item');
const button = document.getElementById("back-button");
const userInput = document.getElementById("user-input");
const searchButton = document.getElementById("search-button");

navItems.forEach(navItem => {
  navItem.addEventListener('click', () => {

    navItems.forEach(item => item.classList.remove('active'));

    const targetPage = navItem.getAttribute('data-target');

    navItem.classList.add('active');

    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    document.getElementById(targetPage).classList.add('active');

    previous = targetPage;

    var imageContainerDetails = document.getElementById("image-container-details");
    var animeDetails = document.getElementById("anime-description");
    var animeType = document.getElementById("type-anime");
    var animeDate = document.getElementById("release-date");
    var animeStatus = document.getElementById("status");
    var animeGenres = document.getElementById("genres");
    var animeTotal = document.getElementById("totalEpisodes");
    var animeSynopsis = document.getElementById("synopsis");
    var videoContainer = document.getElementById("video-container");
    var episodeButtonsContainer = document.getElementById("episode-buttons-container");

    imageContainerDetails.innerHTML = "";
    animeDetails.innerHTML = "";
    animeType.innerHTML = "";
    animeDate.innerHTML = "";
    animeStatus.innerHTML = "";
    animeGenres.innerHTML = "";
    animeTotal.innerHTML = "";
    animeSynopsis.innerHTML = "";
    videoContainer.innerHTML = "";
    episodeButtonsContainer.innerHTML = "";

  });
});

button.addEventListener("click", function() {
  if (previous) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(previous).classList.add('active');
    var imageContainerDetails = document.getElementById("image-container-details");
    var animeDetails = document.getElementById("anime-description");
    var animeType = document.getElementById("type-anime");
    var animeDate = document.getElementById("release-date");
    var animeStatus = document.getElementById("status");
    var animeGenres = document.getElementById("genres");
    var animeTotal = document.getElementById("totalEpisodes");
    var animeSynopsis = document.getElementById("synopsis");
    var videoContainer = document.getElementById("video-container");
    var episodeButtonsContainer = document.getElementById("episode-buttons-container");

    imageContainerDetails.innerHTML = "";
    animeDetails.innerHTML = "";
    animeType.innerHTML = "";
    animeDate.innerHTML = "";
    animeStatus.innerHTML = "";
    animeGenres.innerHTML = "";
    animeTotal.innerHTML = "";
    animeSynopsis.innerHTML = "";
    videoContainer.innerHTML = "";
    episodeButtonsContainer.innerHTML = "";
  }
});

function handleSearch() {
  if (userInput.value.trim() !== '') {
    var aboutSection = document.getElementById("search");
    var pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    aboutSection.classList.add('active');
    var imageContainerSearch = document.getElementById("image-container-search");
    imageContainerSearch.innerHTML = "";
    var imageContainerDetails = document.getElementById("image-container-details");
    var animeDetails = document.getElementById("anime-description");
    var animeType = document.getElementById("type-anime");
    var animeDate = document.getElementById("release-date");
    var animeStatus = document.getElementById("status");
    var animeGenres = document.getElementById("genres");
    var animeTotal = document.getElementById("totalEpisodes");
    var animeSynopsis = document.getElementById("synopsis");
    var videoContainer = document.getElementById("video-container");
    var episodeButtonsContainer = document.getElementById("episode-buttons-container");

    imageContainerDetails.innerHTML = "";
    animeDetails.innerHTML = "";
    animeType.innerHTML = "";
    animeDate.innerHTML = "";
    animeStatus.innerHTML = "";
    animeGenres.innerHTML = "";
    animeTotal.innerHTML = "";
    animeSynopsis.innerHTML = "";
    videoContainer.innerHTML = "";
    episodeButtonsContainer.innerHTML = "";
    searches(userInput.value); 
  }
}

searchButton.addEventListener("click", handleSearch);

userInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});

userInput.addEventListener("input", function() {
  if (userInput.value.trim() !== '') {
    searchButton.removeAttribute('disabled');
  } else {
    searchButton.setAttribute('disabled', 'true');
  }
});