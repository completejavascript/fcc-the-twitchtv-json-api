$(document).ready(() => {
  const FAVORITE_TWITCHTV_CHANNELS = "favorite-twitchtv-channels";
  
  let default_channels = {
    "freecodecamp" : "freecodecamp",
    "funfunfunction" : "funfunfunction",
    "noopkat" : "noopkat",
    "ferossity" : "ferossity",
    "kentcdodds" : "kentcdodds",
    "radicalfishgames" : "radicalfishgames",
    "scinos" : "scinos",
    "rthor" : "rthor",
    "simalexan" : "simalexan",
    "failarmy" : "failarmy"
  };
  
  let $container = $(".channels");
  let $btnAdd = $(".add button");
  let $inpName = $(".add input[type=text]");
  let $form = $(".add form");
  let $options = $(".filter .option");
  let $refresh = $("header .refresh");

  let storageHandler = new AppStorage("localStorage");
  let channels = getChannels() || default_channels;
  setChannels(channels);
  render(channels);
  
  $btnAdd.on("click", (event) => {
    event.preventDefault();
    let channel = $inpName.val().toLowerCase();
    $form[0].reset();
    
    if (!channels[channel]) {
      channels[channel] = channel;
      setChannels(channels);
      getChannelInfo(channel); 
    }
    else alert(`Channel '${channel}' already exists!`);
  });
  
  $options.on("click", (event) => {
    let $target = $(event.target);
    
    if ($target.hasClass("active") == false) {
      $target.siblings().removeClass("active");
      $target.addClass("active");
      
      if ($target.hasClass("all")) filter("all");
      else if ($target.hasClass("online")) filter("online");
      else if ($target.hasClass("offline")) filter("offline");
    }
  });
  
  $refresh.on("click", (event) => {
    channels = default_channels;
    setChannels(channels);
    refreshPage();
  });
  
  function refreshPage(){
    window.location.href = window.location.href;
  }
  
  function render(channels) {
    for (let key in channels) {
      getChannelInfo(key);
    }
  }
  
  function filter(state) {
    if(state == 'all') {
      $container.find(`.item`).removeClass("hidden");
    }
    else if(state == 'online' || state == 'offline') {
      $container.find('.item').addClass("hidden");
      $container.find(`.item.${state}`).removeClass("hidden");
    }
  }

  function getChannelInfo(channel) {
    $.getJSON(makeURL("channels", channel))
    .done(data => onGetChannelInfoSuccess(channel, data))
    .fail(error => console.log(error));
  }

  function onGetChannelInfoSuccess(channel, data) {
    if (!data.error) {
      if (data.status === null) data.status = "Offline";
      
      let tmpl = itemTemplate(data);
      $container.append($(tmpl));
      $container.find(`.item[name="${channel}"] .remove`).on("click", onBtnRemoveClicked);
      
      getStreamInfo(channel);
    }
    else {
      delete channels[channel];
      setChannels(channels);
      alert(`${data.status} - ${data.message}`);
    }
  }
  
  function onBtnRemoveClicked(event) {
    let $item = $(event.target).closest(".item");
    let name = $item.attr("name");
    
    delete channels[name];
    setChannels(channels);
    $item.remove();
  }

  function getStreamInfo(channel) {
    $.getJSON(makeURL("streams", channel))
      .done(data => onGetStreamInfoSuccess(channel, data))
      .fail(error => console.log(error));
  }

  function onGetStreamInfoSuccess(channel, data) {
    let state;
    if (data.stream === null) state = "offline";
    else if (data.stream === undefined) state = "closed";
    else state = "online";

    updateChannelState(channel, state);
  }

  function updateChannelState(channel, state) {
    let $item = $container.find(`.item[name="${channel}"]`);
    $item.addClass(state);
  }

  function makeURL(type, name) {
    return `https://wind-bow.gomix.me/twitch-api/${type}/${name}?callback=?`;
  };
  
  function setChannels(channels) {
    storageHandler.set(FAVORITE_TWITCHTV_CHANNELS, JSON.stringify(channels));
  }
  
  function getChannels() {
    let channels = storageHandler.get(FAVORITE_TWITCHTV_CHANNELS);
    if (channels) return JSON.parse(channels);
  }

  function itemTemplate(data) {
    return `
      <div class="item box my-transition" name="${data.name}">
        <div class="main">
          <div class="logo-name-wrapper">
            <div class="logo">
              <a href="${data.url}" target="_blank">
                <img src="${data.logo}" alt="${data.display_name}'s log">
              </a>
            </div>
            <div class="name">
              <a href="${data.url}" target="_blank">${data.display_name}</a>
            </div>
          </div>
          <div class="status">${data.status}</div>
        </div>
        <i class="fa fa-remove remove my-transition"></i>
      </div>
    `;
  }
});
