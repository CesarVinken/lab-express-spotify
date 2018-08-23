const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");

// Remember to paste here your credentials
const clientId = "bd3b20148df84928ab7314e7c05530fa",
  clientSecret = "cbdcb2b1ed054c23a5c536a63a4bc997";

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");

app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist", (req, res) => {
  const { artist } = req.query;
  const originalQuery = artist;
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      const artists = data.body.artists.items;
      console.log(artists[0].images);
      res.render("artist", { artists, originalQuery });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/album/:artistId", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => {
      const albums = data.body.items;
      const artist = albums[0].artists[0].name;
      res.render("album", { albums, artist });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/track/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => {
      console.log(data.body.items);
      const tracks = data.body.items;
      // const artist = tracks[0].artists[0].name;
      const { name } = tracks;
      console.log(name);

      res.render("track", tracks);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
