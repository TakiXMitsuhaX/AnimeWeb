const axios = require('axios');

async function getAnime(settings, search) {
    var response;
    if (search) search = decodeURIComponent(search);
    switch (settings) {
        case "recent":
            response = await axios.get('https://animehub.saludeskimdev1.repl.co/recent-release');
            break;
        
        case "popular":
            response = await axios.get('https://animehub.saludeskimdev1.repl.co/popular');
            break;

        case "search":
            if (!search) return new Error("Missing Search Value");
            response = await axios.get(`https://animehub.saludeskimdev1.repl.co/search?keyw=${search}`);
            break;

        case "movies":
            response = await axios.get(`https://animehub.saludeskimdev1.repl.co/anime-movies`);
            break;

        case "top":
            response = await axios.get(`https://animehub.saludeskimdev1.repl.co/top-airing`);
            break;

        case "genre":
            if (!search) return new Error("Missing Genre Value");
            response = await axios.get(`https://animehub.saludeskimdev1.repl.co/genre/${search}`);
            break;

        case "details":
            if (!search) return new Error("Missing AnimeID Value");
            response = await axios.get(`https://animehub.saludeskimdev1.repl.co/anime-details/${search}`);
            break;

        case "stream":
            if (!search) return new Error("Missing Episode Value");
            response = await axios.get(`https://animehub.saludeskimdev1.repl.co/vidcdn/watch/${search}`);
            break;
    }
    const data = response.data;
    return JSON.stringify(data, null, 2);
}

module.exports = getAnime;