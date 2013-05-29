pageUrl = "http://www.cloudspokes.com";

function findMilliseconds(interval, text) {
    if (text == "days") {
	interval = interval * 24;
	text = "hours";
    }
    if (text == "hours") {
	interval = interval * 60;
	text = "minutes";
    }
    if (text == "minutes") {
	interval = interval * 60;
	text = "seconds";
    }
    if (text == "seconds")
	interval = interval * 1000;
    return interval;
}

function checkForChallenge() {
    $.getJSON(pageUrl + "/account/challenges.json", function(data) {
	data = data["active"];
	now = moment();
	notified = JSON.parse(localStorage["notified-challenges"]);
	challenges = [];
	$(data).each(function() {
	    if (this["status"] != "Open for Submissions") return;
	    finish = moment(this["end_date"]);
	    if (finish.diff(now, notifyMostText, true) <= notifyMost) {
		if (!this["challenge_participants"]["records"][0]["has_submission"] && noSubmittedChallenges) return;
		if ($.inArray(this["challenge_id"],notified) > -1) return;
		challenges.push(this);
	    }
	});
	if (challenges.length == 0) return;
	if (challenges.length == 1) {
	    challenge = challenges[0];
	    var notify = webkitNotifications.createNotification(
		"../icon48.png",
		"Challenge alert!",
		"Thallenge \"" + challenge["name"] + "\" ends in less than " + notifyMost + " " + notifyMostText + ". " +
		"Click on this notification to be taken to the challenge."
	    );
	    $(notify).click(function() {
		window.open(pageUrl + "/challenges/" + challenge["challenge_id"]);
		notify.close();
	    });
	    notify.show();
	}
	else {
	    var notify = webkitNotifications.createNotification(
		"../icon48.png",
		"Challenge alert!",
		"There are " + challenges.length + " challenges which have less than " + notifyMost + " " + notifyMostText + " left. " +
		    "Click on this notification to open them in tabs."
	    );
	    $(notify).click(function() {
		$(challenges).each(function(){window.open(pageUrl + "/challenges/" + this["challenge_id"]);});
		notify.close();
	    });
	    notify.show();
	    $(challenges).each(function() {notified.push(this["challenge_id"]);});
	    localStorage["notified-challenges"] = JSON.stringify(notified);
	}
    });
}

function checkForMessages() {
    $.getJSON(pageUrl + "/messages/inbox.json", function(data) {
	if (data.length == 0) return;
	if (data.length == 1) {
	    message = data[0];
	    var notify = webkitNotifications.createNotification(
		"../icon48.png",
		message["subject"],
		"You have received a message from user " + message["display_user"] + ". Click on this notification to view the message."
	    );
	    $(notify).click(function() {
		window.open(pageUrl + "/messages/" + message["id"]);
		notify.close();
	    });
	    notify.show();
	}
	else {
	    var notify = webkitNotifications.createNotification(
		"../icon48.png",
		"New Messages",
		"You have received " + data.length + " messages. Click on this notification to open the message list."
	    );
	    $(notify).click(function() {
		window.open(pageUrl + "/messages/inbox");
		notify.close();
	    });
	    notify.show();
	}
    });
}

if (localStorage["enable-challenges"] == "true") {
    if(localStorage["no-submitted-challenges"] == "true")
	noSubmittedChallenges = true;
    else
	noSubmittedChallenges = false;
    interval = findMilliseconds(localStorage["challenges-interval"], localStorage["challenges-interval-text"]);
    notifyMost = parseInt(localStorage["notify-most"]);
    notifyMostText = localStorage["notify-most-text"];
    if (! localStorage["notified-challenges"]) localStorage["notified-challenges"] = JSON.stringify([]);
    checkForChallenge();
    setInterval(checkForChallenge, interval);
}

if (localStorage["enable-messages"] == "true") {
    interval = findMilliseconds(localStorage["messages-interval"], localStorage["messages-interval-text"]);
    checkForMessages();
    setInterval(checkForMessages, interval);
}
