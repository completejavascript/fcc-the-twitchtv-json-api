document.addEventListener("DOMContentLoaded", () => {
  let channels = ["freecodecamp","javascriptcodingguru", "FailArmy"];
  let cors = 'https://cors-anywhere.herokuapp.com/';

  channels.forEach(channel => {
    // Get Streams info - online, offline, account closed
    fetch(makeURL("streams", channel))
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));

    // Get channel info
    fetch(makeURL("channels", channel))
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
  });

  function makeURL(type, name) {
    return `${cors}https://wind-bow.gomix.me/twitch-api/${type}/${name}?`;
    //return `${cors}https://wind-bow.gomix.me/twitch-api/${type}/${name}?callback=?`;
  };
});