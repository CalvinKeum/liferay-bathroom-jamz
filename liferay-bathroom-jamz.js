if (Meteor.isClient) {
	function findWinner() {
		var list = Music.find().fetch();
		var highestVoteMusic = list[0];

		console.log("List of potential music votes");
		for(var i=1; i < list.length; i++) {
			console.log(list[i].name + " : " + list[i].votes);
			if(highestVoteMusic.votes < list[i].votes) {
				highestVoteMusic = list[i];
			}
		}
		return highestVoteMusic._id;
	}

	function resetCollections() {
		var music = Music.find();

		music.forEach(function(item) {
			var id = item._id;

			Music.update(id, {
				$set: {votes: 0}
			});
		});

		CurrentSelection.remove({});
	}


	onYouTubeIframeAPIReady = function() {
		player = new YT.Player(
			"player",
			{
				height: "400",
				width: "600",
				videoId: "LdH1hSWGFGU",
				events: {
						'onReady': onPlayerReady
				}
			}
		);
	}

	function onPlayerReady(event) {
		window.setInterval(function(event) {
			var date = new Date();
			var time = date.getSeconds();

			if(time == 0 || time == 15 || time == 30 || time == 45) {
				var _id = findWinner();

				player.loadPlaylist(
					{
						listType:"playlist",
						list: Music.findOne(_id).playerId,
						index:0,
						startSeconds:0,
						suggestedQuality:"large"
					}
				);

				event.target.playVideo();

				resetCollections()
			}
		}, 1000);
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
