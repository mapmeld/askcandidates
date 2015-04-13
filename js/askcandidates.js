// init YouTube Player API
var params = {
  allowScriptAccess: "always",
  bgcolor: "#ccc"
};
var atts = {
  id: "myytplayer"
};

swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&amp;playerapiid=myytplayer", "playerdiv", "500", "375", "8", null, null, params, atts);

// load candidate question data
$.getJSON("data/" + candidateName + ".json", function(d) {
});
