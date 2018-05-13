document.addEventListener("DOMContentLoaded", () => {
  let channels = ["freecodecamp", "javascriptcodingguru", "failarmy"];
  let cors = 'https://cors-anywhere.herokuapp.com/';

  let _container = document.querySelector(".channels");

  channels.forEach(channel => getChannelInfo(channel));

  function getChannelInfo(channel) {
    fetch(makeURL("channels", channel))
      .then(res => res.json())
      .then(data => onGetChannelInfoSuccess(channel, data))
      .catch(error => console.log(error));
  }

  function onGetChannelInfoSuccess(channel, data) {
    let tmpl = itemTemplate(data);
    let frag = document.createRange().createContextualFragment(tmpl);
    _container.appendChild(frag);

    getStreamInfo(channel);
  }

  function getStreamInfo(channel) {
    fetch(makeURL("streams", channel))
      .then(res => res.json())
      .then(data => onGetStreamInfoSuccess(channel, data))
      .catch(error => console.log(error));
  }

  function onGetStreamInfoSuccess(channel, data) {
    let state;
    if (data.stream === null) state = "offline";
    else if (data.stream === undefined) state = "closed";
    else state = "online";

    updateChannelState(channel, state);
  }

  function updateChannelState(channel, state) {
    let item = _container.querySelector(`.item[name="${channel}"]`);
    item.classList.add(state);
  }

  function makeURL(type, name) {
    return `${cors}https://wind-bow.gomix.me/twitch-api/${type}/${name}?`;
  };

  function itemTemplate(data) {
    return `
      <div class="item box my-transition" name="${data.name}">
        <div class="logo-name-wrapper">
          <div class="logo">
            <img src="${data.logo}" alt="${data.display_name}'s log" width="80" height="80">
          </div>
          <div class="name"><a href="${data.url}" target="_blank">${data.display_name}</a></div>
        </div>
        <div class="status">${data.status}</div>
      </div>
    `;
  }
});