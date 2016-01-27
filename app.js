Music = new Mongo.Collection("music");
CurrentSelection = new Mongo.Collection("currentSelection")

if (Meteor.isServer) {
	Meteor.startup(function () {
		var musicObjects = [
			{
				description : "Roll down your windows while driving your pickup",
				playerId : "PLv9bNxDawPe2N33iKGQZQZE9rmg3xObxo",
				name : "Country",
				votes : 0
			},
			{
				description : "",
				playerId : "PLv9bNxDawPe1POEqcjGgrS726XslzG1BX",
				name : "K-Pop",
				votes : 0
			},
			{
				description : "",
				playerId : "PLv9bNxDawPe0hS_qQIFm0T97KQZXUBKQR",
				name : "Disney",
				votes : 0
			},
			{
				description: "",
				playerId : "PLv9bNxDawPe3nU7E1FR7RFL2mXWA7gj28",
				name : "Techno",
				votes : 0
			},
			{
				description: "",
				playerId : "PLv9bNxDawPe0ECBZ-2rkFpBjMsi_6QtUp",
				name : "Metal",
				votes : 0
			},
			{
				description: "",
				playerId : "PLv9bNxDawPe1c-HYINpPqe6MDOKltJ4ze",
				name : "Filmscores",
				votes : 0
			}
		];

		Music.remove({});

		if (Music.find().count() === 0) {
			for (var i = 0; i < musicObjects.length; i++) {
				Music.insert(musicObjects[i]);
			}
		}
		
		CurrentSelection.remove({});
	
		checkTimeInterval();
	});
}

function checkTimeInterval() {
	Meteor.setInterval(function() {
		var date = new Date();
		var time = date.getSeconds();
//		var time = date.getMinutes();
		
		//if(time == 0 || time == 30) {
		if(time == 0 || time == 15 || time == 30 || time == 45) {	
			var winnerId = findWinner();

			changeMusic(winnerId);
		}
	}, 1000);
//  }, 60000);
}

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

function changeMusic(_id) {
	console.log("change music to " + Music.findOne(_id).name);
	
	resetCollections();
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



if (Meteor.isClient) {
	function updateVotes(newId, oldId) {
		var music = Music.find();

		music.forEach(function(item) {
			var playerId = item.playerId;
			var id = item._id;

			if (playerId === oldId) {
				console.log(oldId);
				Music.update(id, {
					$inc: {votes: -1}
				});
			}
			else if (playerId === newId) {
				console.log(newId);
				Music.update(id, {
					$inc: {votes: 1}
				});
			}
		});
	}

	Template.bodyTemplate.helpers({
		score: function () {
			return Music.find(
				{},
				{
					sort: { votes: -1 }
				}
			);
		}
	});

	Template.bodyTemplate.events({
		'change #genreList' : function(evt) {
			var selected = $("input[name=genre]:checked").val();

			updateCurrentSelected(selected);
		}
	});
}

function updateCurrentSelected(playerId) {
	var oldId = 0;
	var newId = playerId;

	var currentSelections = CurrentSelection.find({ "userId" : Meteor.userId()});
	var currentSelection = currentSelections.fetch()[0];

	if (currentSelection) {
		oldId =  currentSelection.newId;

		if (oldId == playerId) {
			return;
		}
		
		CurrentSelection.update(currentSelection._id, {$set: {oldId: oldId}});
		CurrentSelection.update(currentSelection._id, {$set: {newId: playerId}});
	}
	else {
		CurrentSelection.insert(
		{
			userId : Meteor.userId(),
			oldId : 0,
			newId : playerId
		});
	}

	updateVotes(newId, oldId);
} 
