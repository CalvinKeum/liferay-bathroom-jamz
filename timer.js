if (Meteor.isClient) {
    Meteor.startup(function () {
        setInterval(function () {
            Meteor.call("getServerTime", function (error, result) {
                Session.set("time", result);
            });
        }, 1000);
    });

    Template.currentInfo.helpers({
        time : function () {
            return Session.get("time");
        }
    });

}

if (Meteor.isServer) {
    Meteor.methods({
        getServerTime: function () {
            var _time = (new Date).toTimeString();
            // console.log(_time);
            return _time;
        }
    });
}