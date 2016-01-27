if (Meteor.isClient) {
	onYouTubeIframeAPIReady = function() {
      player = new YT.Player("player", {

          height: "400",
          width: "600",

          // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
          videoId: "LdH1hSWGFGU",

          // Events like ready, state change,
          events: {
              'onReady': onPlayerReady
          }
      });
  }

  function onPlayerReady(event) {
    player.loadPlaylist({listType:"playlist",
      list:"PLv9bNxDawPe1c-HYINpPqe6MDOKltJ4ze",
      index:0,
      startSeconds:0,
      suggestedQuality:"large"})

    event.target.playVideo();
  }

  YT.load();	
  
	//Login Templates -- DONT REMOVE
	Template.body.helpers({
		firstName: function(){
			var user = Meteor.user();
			if (user) {
				return user.services.google.given_name;
			}
		},

		profileURL: function() {
			var user = Meteor.user();
			if (user) {
				return user.services.google.picture;
			}
		}
	});
}
