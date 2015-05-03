// init YouTube Player API
var params = {
  allowScriptAccess: "always",
  bgcolor: "#ccc"
};
var atts = {
  id: "myytplayer"
};
var player;

swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&amp;playerapiid=myytplayer", "playerdiv", "500", "375", "8", null, null, params, atts);
var startedAVideo = false;

var matcher = function(strs) {
  return function findMatches(q, cb) {
    var matches = [];
    var substrRegex = new RegExp(q, 'i');

    $.each(strs, function(i, str) {
      if (substrRegex.test(str.question)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
}

function gup( name, url ) {
  if (!url) {
    url = location.href;
  }
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}

function onYouTubePlayerReady(playerid) {
  player = $('#' + playerid)[0];
}

function loadCandidate(d) {
  $("#box").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  },
  {
    name: candidateName,
    source: matcher(d),
    display: 'question',
    templates: {
      empty: "no questions found"
    }
  });

  $('#box').bind('typeahead:select', function(ev, q) {
    var startSeconds = 0;
    if (q.time) {
      if (q.time.indexOf(":") > -1) {
        var timestamp = q.time.split(':');
        if (timestamp.length == 2) {
          // mm:ss
          startSeconds = timestamp[0] * 60 + timestamp[1] * 1.0;
        } else {
          // hh:mm:ss
          startSeconds = timestamp[0] * 3600 + timestamp[1] * 60 + timestamp[2] * 1.0;
        }
      } else {
        // ss
        startSeconds = q.time * 1.0;
      }
    }
    if (startedAVideo && q.video === player.getVideoUrl()) {
      player.seekTo(startSeconds, true);
    } else {
      player.loadVideoById(q.video, startSeconds);
    }
    startedAVideo = true;
  });
}

// load candidate question data
var candidateName = gup('c').toLowerCase();
$.getJSON("data/" + candidateName + ".json", loadCandidate);
