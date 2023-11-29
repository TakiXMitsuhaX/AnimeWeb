document.addEventListener('DOMContentLoaded', async function () {
  var imageContainer = document.getElementById("image-container");
  var imageContainerRecent = document.getElementById("image-container-recent");
  var imageContainerPopular = document.getElementById("image-container-popular");
  var imageContainerMovie = document.getElementById("image-container-movie");
  var imageContainerGenreRomance = document.getElementById("image-container-genre-romance");
  var imageContainerGenreAction = document.getElementById("image-container-genre-action");
  var loadingContainer = document.getElementById("lds-ellipsis");
  var container = document.getElementById("container");

  loadingContainer.style.display = 'inline-block';

  try {
      const topAnimeFetch = await getAnime('popular');
      var topAnime = topAnimeFetch;

      topAnime.forEach( async function (imgObj) {
        var imageDiv = document.createElement("div");
        imageDiv.classList.add("image-div");
    
        var imgElement = document.createElement("img");
        imgElement.src = imgObj.animeImg;
        imgElement.alt = "Dynamic Image";
        imgElement.classList.add("dynamic-image");
    
        var descElement = document.createElement("p");
        descElement.textContent = imgObj.animeTitle;
        descElement.classList.add("image-description");
    
        imageDiv.appendChild(imgElement);
        imageDiv.appendChild(descElement);
    
        imageContainer.appendChild(imageDiv);
    
        imgElement.addEventListener('click', async function () {
            loadingContainer.style.display = 'inline-block';
            container.style.display = 'none';
            const animeDFetch = await getAnime('details', imgObj.animeId);
            const animeD = animeDFetch;
            const episodes_list = await Promise.all(animeD.episodesList.map(item => {return {episodeId: item.episodeId, episodeNum: item.episodeNum}}));
            const episodes_num = episodes_list.map(item => item.episodeNum);
            const episodes_id = episodes_list.map(item => item.episodeId);
            loadingContainer.style.display = 'none';
            container.style.display = 'flex';
            var aboutSection = document.getElementById("description");
            var pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));
            aboutSection.classList.add('active');
    
            // Description
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
    
            var imgDetailsElement = document.createElement("img");
            imgDetailsElement.src = imgObj.animeImg;
            imgDetailsElement.alt = "Details Image";
            imgDetailsElement.classList.add("dynamic-image-description");
    
            var titleElement = document.createElement("p");
            titleElement.textContent = imgObj.animeTitle;
            titleElement.classList.add("image-description-title");

            var typeElement = document.createElement("p");
            typeElement.textContent = animeD.type;
            typeElement.classList.add("image-description-type");

            var dateElement = document.createElement("p");
            dateElement.textContent = animeD.releasedDate;
            dateElement.classList.add("image-description-release");

            var statusElement = document.createElement("p");
            statusElement.textContent = animeD.status;
            statusElement.classList.add("image-description-status");

            var genresElement = document.createElement("p");
            genresElement.textContent = animeD.genres;
            genresElement.classList.add("image-description-genres");

            var totalElement = document.createElement("p");
            totalElement.textContent = animeD.totalEpisodes;
            totalElement.classList.add("image-description-total");

            var synopsisElement = document.createElement("p");
            synopsisElement.textContent = animeD.synopsis;
            synopsisElement.classList.add("image-description-synopsis");
    
            imageContainerDetails.appendChild(imgDetailsElement);
            animeDetails.appendChild(titleElement);
            animeType.appendChild(typeElement);
            animeDate.appendChild(dateElement);
            animeStatus.appendChild(statusElement);
            animeGenres.appendChild(genresElement);
            animeTotal.appendChild(totalElement);
            animeSynopsis.appendChild(synopsisElement);

            episodes_num.reverse();
            episodes_id.reverse();

            let currentVideo; // Keep track of the current video element

            episodes_num.forEach(function (episodeNum, index) {
                var episodeButton = document.createElement("button");
                episodeButton.textContent = "Episode " + episodeNum;
                episodeButton.classList.add("episode-button");

                // Add a click event listener to load the corresponding episode
                episodeButton.addEventListener('click', async function () {
                    // Dispose of the previous video
                    if (currentVideo) {
                        currentVideo.pause();
                        currentVideo.removeAttribute('src');
                        currentVideo.load();
                    }

                    // Clear the video container
                    videoContainer.innerHTML = "";

                    // Display loading container
                    loadingContainer.style.display = 'inline-block';
                    container.style.display = 'none';

                    const anime_source_results = await getAnime('stream', episodes_id[index]);
                    const anime_source = anime_source_results.source;

                    // Create a video element for the selected episode
                    var video = document.createElement('video');
                    video.id = "video-player-" + index;
                    video.controls = true;
                    video.classList.add("video-container");

                    // Create a source element with the hls stream URL
                    var source = document.createElement('source');
                    source.src = anime_source;
                    source.type = 'application/x-mpegURL';  // Set the MIME type for HLS

                    // Add the source to the video element
                    video.appendChild(source);

                    // Optionally, add a title for the episode
                    var episodeTitle = "Episode " + episodeNum;
                    var titleElement = document.createElement('h3');
                    titleElement.textContent = episodeTitle;

                    // Add the video and title to the video container
                    videoContainer.appendChild(titleElement);
                    videoContainer.appendChild(video);

                    currentVideo = video; // Update the current video reference

                    // Initialize the video player using hls.js
                    if (Hls.isSupported()) {
                        var hls = new Hls();
                        hls.loadSource(anime_source);
                        hls.attachMedia(video);
                        video.play();

                        // Add quality control
                        hls.on(Hls.Events.MANIFEST_PARSED, function () {
                            var qualitySwitch = document.createElement('select');
                            qualitySwitch.id = 'qualitySwitch';  // Add a unique id attribute

                            hls.levels.forEach(function (level, index) {
                                var option = document.createElement('option');
                                option.text = level.height + 'p';  // Display resolution as option text
                                option.value = index;  // Use level index as option value
                                qualitySwitch.appendChild(option);
                            });

                            // Add auto quality option
                            var autoOption = document.createElement('option');
                            autoOption.text = 'auto';
                            autoOption.value = -1;  // hls.js uses -1 for auto level
                            qualitySwitch.appendChild(autoOption);

                            // Handle quality switch
                            qualitySwitch.addEventListener('change', function () {
                                hls.currentLevel = parseInt(qualitySwitch.value);
                            });

                            // Append quality switch to video container
                            videoContainer.appendChild(qualitySwitch);
                        });

                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = episodes_ink_m3u8[index];
                        video.addEventListener('loadedmetadata', function () {
                            video.play();
                        });
                    }

                    // Hide loading container after video has loaded
                    video.addEventListener('loadeddata', function () {
                        loadingContainer.style.display = 'none';
                        container.style.display = 'flex';
                    });
                });

                // Append the button to the container
                episodeButtonsContainer.appendChild(episodeButton);
            });

            // Trigger click event for the first episode button to load the initial episode
            var firstEpisodeButton = document.querySelector(".episode-button");
            if (firstEpisodeButton) {
                firstEpisodeButton.click();
            }          

        });
    });

  } catch (error) {
      console.error('Error fetching data:', error);
      loadingContainer.innerHTML = '<p>Error loading data</p>';
  } finally {
      loadingContainer.style.display = 'none';
      container.style.display = 'flex';
  }
});

async function getAnime (settings, search) {
  var url;

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('search')) {
      search = urlParams.get('search');
      search = decodeURIComponent(search);
  }

  switch (settings) {
      case "recent":
          url = 'https://animehub-q89c.onrender.com/recent-release';
          break;
      
      case "popular":
          url = 'https://animehub-q89c.onrender.com/popular';
          break;

      case "search":
          if (!search) {
              console.error("Missing Search Value");
              return;
          }
          url = `https://animehub-q89c.onrender.com/search?keyw=${search}`;
          break;

      case "movies":
          url = 'https://animehub-q89c.onrender.com/anime-movies';
          break;

      case "top":
          url = 'https://animehub-q89c.onrender.com/top-airing';
          break;

      case "genre":
          if (!search) {
              console.error("Missing Genre Value");
              return;
          }
          url = `https://animehub-q89c.onrender.com/genre/${search}`;
          break;

      case "details":
          if (!search) {
              console.error("Missing AnimeID Value");
              return;
          }
          url = `https://animehub-q89c.onrender.com/anime-details/${search}`;
          break;

      case "stream":
          if (!search) {
              console.error("Missing Episode Value");
              return;
          }
          url = `https://animehub-q89c.onrender.com/vidcdn/watch/${search}`;
          break;

      default:
          console.error("Invalid settings value");
          return;
  }

  try {
      const response = await axios.get(url);
      const data = await response.data;
      return data;
  } catch (error) {
      console.error("Error fetching data:", error);
  }
}

async function searches(find) {
    var imageContainerSearch = document.getElementById("image-container-search");
    var loadingContainer = document.getElementById("lds-ellipsis");
    var container = document.getElementById("container");

    loadingContainer.style.display = 'inline-block';
    container.style.display = 'none';

    try {
        const searchAnimeFetch = await getAnime('search', find);
        var searchAnime = searchAnimeFetch;

        searchAnime.forEach( async function (imgObj) {
            var imageDiv = document.createElement("div");
            imageDiv.classList.add("image-div");
        
            var imgElement = document.createElement("img");
            imgElement.src = imgObj.animeImg;
            imgElement.alt = "Dynamic Image";
            imgElement.classList.add("dynamic-image");
        
            var descElement = document.createElement("p");
            descElement.textContent = imgObj.animeTitle;
            descElement.classList.add("image-description");
        
            imageDiv.appendChild(imgElement);
            imageDiv.appendChild(descElement);
        
            imageContainerSearch.appendChild(imageDiv);
        
            imgElement.addEventListener('click', async function () {
                loadingContainer.style.display = 'inline-block';
                container.style.display = 'none';
                const animeDFetch = await getAnime('details', imgObj.animeId);
                const animeD = animeDFetch;
                const episodes_list = await Promise.all(animeD.episodesList.map(item => {return {episodeId: item.episodeId, episodeNum: item.episodeNum}}));
                const episodes_num = episodes_list.map(item => item.episodeNum);
                const episodes_id = episodes_list.map(item => item.episodeId);
                loadingContainer.style.display = 'none';
                container.style.display = 'flex';
                var aboutSection = document.getElementById("description");
                var pages = document.querySelectorAll('.page');
                pages.forEach(page => page.classList.remove('active'));
                aboutSection.classList.add('active');
        
                // Description
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
        
                var imgDetailsElement = document.createElement("img");
                imgDetailsElement.src = imgObj.animeImg;
                imgDetailsElement.alt = "Details Image";
                imgDetailsElement.classList.add("dynamic-image-description");
        
                var titleElement = document.createElement("p");
                titleElement.textContent = imgObj.animeTitle;
                titleElement.classList.add("image-description-title");
    
                var typeElement = document.createElement("p");
                typeElement.textContent = animeD.type;
                typeElement.classList.add("image-description-type");
    
                var dateElement = document.createElement("p");
                dateElement.textContent = animeD.releasedDate;
                dateElement.classList.add("image-description-release");
    
                var statusElement = document.createElement("p");
                statusElement.textContent = animeD.status;
                statusElement.classList.add("image-description-status");
    
                var genresElement = document.createElement("p");
                genresElement.textContent = animeD.genres;
                genresElement.classList.add("image-description-genres");
    
                var totalElement = document.createElement("p");
                totalElement.textContent = animeD.totalEpisodes;
                totalElement.classList.add("image-description-total");
    
                var synopsisElement = document.createElement("p");
                synopsisElement.textContent = animeD.synopsis;
                synopsisElement.classList.add("image-description-synopsis");
        
                imageContainerDetails.appendChild(imgDetailsElement);
                animeDetails.appendChild(titleElement);
                animeType.appendChild(typeElement);
                animeDate.appendChild(dateElement);
                animeStatus.appendChild(statusElement);
                animeGenres.appendChild(genresElement);
                animeTotal.appendChild(totalElement);
                animeSynopsis.appendChild(synopsisElement);
    
                episodes_num.reverse();
                episodes_id.reverse();
    
                let currentVideo; // Keep track of the current video element
    
                episodes_num.forEach(function (episodeNum, index) {
                    var episodeButton = document.createElement("button");
                    episodeButton.textContent = "Episode " + episodeNum;
                    episodeButton.classList.add("episode-button");
    
                    // Add a click event listener to load the corresponding episode
                    episodeButton.addEventListener('click', async function () {
                        // Dispose of the previous video
                        if (currentVideo) {
                            currentVideo.pause();
                            currentVideo.removeAttribute('src');
                            currentVideo.load();
                        }
    
                        // Clear the video container
                        videoContainer.innerHTML = "";
    
                        // Display loading container
                        loadingContainer.style.display = 'inline-block';
                        container.style.display = 'none';
    
                        const anime_source_results = await getAnime('stream', episodes_id[index]);
                        const anime_source = anime_source_results.source;
    
                        // Create a video element for the selected episode
                        var video = document.createElement('video');
                        video.id = "video-player-" + index;
                        video.controls = true;
                        video.classList.add("video-container");
    
                        // Create a source element with the hls stream URL
                        var source = document.createElement('source');
                        source.src = anime_source;
                        source.type = 'application/x-mpegURL';  // Set the MIME type for HLS
    
                        // Add the source to the video element
                        video.appendChild(source);
    
                        // Optionally, add a title for the episode
                        var episodeTitle = "Episode " + episodeNum;
                        var titleElement = document.createElement('h3');
                        titleElement.textContent = episodeTitle;
    
                        // Add the video and title to the video container
                        videoContainer.appendChild(titleElement);
                        videoContainer.appendChild(video);
    
                        currentVideo = video; // Update the current video reference
    
                        // Initialize the video player using hls.js
                        if (Hls.isSupported()) {
                            var hls = new Hls();
                            hls.loadSource(anime_source);
                            hls.attachMedia(video);
                            video.play();
    
                            // Add quality control
                            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                                var qualitySwitch = document.createElement('select');
                                qualitySwitch.id = 'qualitySwitch';  // Add a unique id attribute
    
                                hls.levels.forEach(function (level, index) {
                                    var option = document.createElement('option');
                                    option.text = level.height + 'p';  // Display resolution as option text
                                    option.value = index;  // Use level index as option value
                                    qualitySwitch.appendChild(option);
                                });
    
                                // Add auto quality option
                                var autoOption = document.createElement('option');
                                autoOption.text = 'auto';
                                autoOption.value = -1;  // hls.js uses -1 for auto level
                                qualitySwitch.appendChild(autoOption);
    
                                // Handle quality switch
                                qualitySwitch.addEventListener('change', function () {
                                    hls.currentLevel = parseInt(qualitySwitch.value);
                                });
    
                                // Append quality switch to video container
                                videoContainer.appendChild(qualitySwitch);
                            });
    
                        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                            video.src = episodes_ink_m3u8[index];
                            video.addEventListener('loadedmetadata', function () {
                                video.play();
                            });
                        }
    
                        // Hide loading container after video has loaded
                        video.addEventListener('loadeddata', function () {
                            loadingContainer.style.display = 'none';
                            container.style.display = 'flex';
                        });
                    });
    
                    // Append the button to the container
                    episodeButtonsContainer.appendChild(episodeButton);
                });
    
                // Trigger click event for the first episode button to load the initial episode
                var firstEpisodeButton = document.querySelector(".episode-button");
                if (firstEpisodeButton) {
                    firstEpisodeButton.click();
                }          
    
            });
        });
  
    } catch (error) {
        console.error('Error fetching data:', error);
        loadingContainer.innerHTML = '<p>Error loading data</p>';
    } finally {
        loadingContainer.style.display = 'none';
        container.style.display = 'flex';
    }
}