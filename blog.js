// Arbitrary
var SNDCLOUD_CLIENT_ID='BLOG_PLAYER';


function cancel(event) {
  if (event.preventDefault) {
    event.preventDefault();
  }
  return false;
}

function nextVideo() {
    if ((i+1) < videos.length) {
        i++;
        createPlayer();
    }
}


var i=0;
var player;
// js api requires a webserver
// https://developers.google.com/youtube/iframe_api_reference?hl=pt-PT#Examples
// 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
function onYouTubePlayerAPIReady() {
    createPlayer();
}

function createPlayer() {
    var v = videos[i];
    $('#screen').remove();
    if (player) delete player;
    if (v.type == 'youtube') {
        $('body').prepend('<div id="screen"></div>');
        player = new YT.Player('screen', {
          videoId: videos[i].id,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
    } else if (v.type == 'vimeo') {
        // http://developer.vimeo.com/player/embedding
        // http://developer.vimeo.com/player/js-api
        // Só consigo que funcione se carregar do localhost
        $('body').prepend('<iframe id="screen" src="http://player.vimeo.com/video/' + v.id + '?api=1&player_id=screen" width="540" height="304" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
        $('#screen').load(function() {
            player = $f($('#screen')[0]);
            player.addEvent('ready', function() {
                player.addEvent('finish', function() {
                    nextVideo();
                });
                player.api('play');
            });
        });
    } else if (v.type == 'soundcloud') {
        SC.initialize({
          client_id: SNDCLOUD_CLIENT_ID
        });
        $('body').prepend('<div id="screen"></div>');
        SC.oEmbed(v.id, { auto_play: true }, document.getElementById('screen'));
        // 3rd arg can also be a callback function(oEmbed) {
//           console.log('oEmbed response: ' + oEmbed);
//         }
    } else if (v.type == 'tumblr') {
        $('body').prepend('<embed id="screen" src="' + v.id + '" height="27" width="207"></embed>');
    } else if (v.type == 'myspace') {
        $('body').prepend('<embed id="screen" src="' + v.id + '" width="432" height="364"></embed>');
    } else if (v.type == 'sapo') {
        $('body').prepend('<embed id="screen" src=http://rd3.videos.sapo.pt/play?file="' + v.id + '" type="application/x-shockwave-flash" width="410" height="349"></embed>');
    } else if (v.type == 'bandcamp') {
        $('body').prepend('<iframe id="screen" width="400" height="100" style="position: relative; display: block; width: 400px; height: 100px;" src="' + v.id + '" allowtransparency="true" frameborder="0"></iframe>');
    }
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        nextVideo();
    }
}

function findID(vid) {
    for (var k=0; k < videos.length; k++) {  
        if (videos[k].id === vid) {
            return k;  
        }
    }
    return -1;
}

function init() {
//     $("#screen").html(videos[0]);
// 2. This code loads the IFrame Player API code asynchronously.
      $("#nextBtn").click(function() {
        nextVideo();
      });
      var tag = document.createElement('script');
      tag.src = "http://www.youtube.com/player_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      tag = document.createElement('script');
      tag.src = "http://connect.soundcloud.com/sdk.js";
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      // links
      $("ol li a").click(function(e) {
          cancel(e);
          var yid = $(this).attr("data-videoid");
          i = findID(yid);
          createPlayer();
      }
    );
      
  }
