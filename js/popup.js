var baseUrl = "http://api.cloudspokes.com/v1";
var pageUrl = "http://www.cloudspokes.com"

$(window).load(function() {
    $("#menuItemChallenges").click(function(){toggle("challenges");});
    $("#menuItemLeaderboard").click(function(){toggle("leaderboard");});
    $("#menuItemPayments").click(function(){toggle("payments");});
    $("#recently-completed").click(function(){openWin("challenges/recent");});
    
    // get the challenges
    $.ajax({
	url: baseUrl + '/challenges.json',
	type: 'GET',
	success: function(data) {
	    data = data["response"];
	    var html = '';
	    for(var i = 0; i < data.length; i++)
		html += '<tr><td><a href="' + pageUrl + '/challenges/' + data[i].challenge_id + '" target="_blank">' + data[i].name + '</a><br><div style="font-size:x-small">' + joinCategories(data[i].challenge_technologies__r) + '</div></td><td>' + formatDay(data[i].days_till_close) + '</td><td>$' + data[i].total_prize_money + '</td></tr>';
	    $('#tbl-challenges tr').first().after(html);
	}
    });
    
    // get the leaderboard
    $.ajax({
	url: baseUrl + '/leaderboard.json',
	type: 'GET',
	success: function(data) {
	    data = data["response"];
	    var html = '';
	    for(var i = 0; i < data.length; i++)
		html += '<tr><td width="10">' + data[i].rank + '</td><td width="55"><img src="' + data[i].profile_pic + '" width="50"></td><td><a href="' + pageUrl + '/members/' + data[i].username + '" target="_blank">' + data[i].username + '</a><br><div style="font-size:x-small">' + data[i].country + '</div></td><td>$' + Math.floor(data[i].total_money) + '</td></tr>';
	    $('#tbl-leaderboard tr').first().after(html);
	}
    });
    
    // get payments
    $.ajax({
	url: pageUrl + '/account/payment-info.json',
	type: 'GET',
	success: function(data) {
	    var html = '';
	    for(var i = 0; i < data["outstanding"].length; i++)
		html += '<tr><td>' + data["outstanding"][i].name + '</td><td>' + data["outstanding"][i].challenge.name + '</td><td>' + data["outstanding"][i].place + '</td><td>$' + Math.floor(data["outstanding"][i].money) + '</td><td>' + data["outstanding"][i].reason + '</td><td>' + data["outstanding"][i].type + '</td><td>' + data["outstanding"][i].payment_sent + '</td><td>' + data["outstanding"][i].reference_number + '</td></tr>';
	    $('#tbl-payments-outstanding tr').first().after(html);
	    html = '';
	    for(var i = 0; i < data["paid"].length; i++)
		html += '<tr><td>' + data["paid"][i].name + '</td><td>' + data["paid"][i].challenge.name + '</td><td>' + data["paid"][i].place + '</td><td>$' + Math.floor(data["paid"][i].money) + '</td><td>' + data["paid"][i].reason + '</td><td>' + data["paid"][i].type + '</td><td>' + data["paid"][i].payment_sent + '</td><td>' + data["paid"][i].reference_number + '</td></tr>';
	    $('#tbl-payments-paid tr').first().after(html);	    
	}
    });
    
    $("body").css("width","600px");
    toggle('challenges');
    
});

function formatDay(days) {
    if (days == 0) {
	return " today!";
    } else if (days == 1) {
	return " 1 day";
    } else {
	return days + " days";
    }		
}

function joinCategories(categories) {
    var joined = "";
    var counter = 0;
    for(var i = 0; i < categories.records.length; i++) {
	joined = joined + categories.records[i].name;
	if (counter < categories.records.length-1)
	    joined = joined + ', ';
	counter++;
    }
    return joined;
}

function toggle(section) {
    
    // hide everything
    if (section == "challenges") {
	showChallenges();
	hideLeaderboard();
	hidePayments();
	$("body").css("width","600px");
    } else if (section == "leaderboard") {
	showLeaderboard();
	hideChallenges();
	hidePayments();
	$("body").css("width","600px");
    } else if (section == "payments") {
	showPayments();
	hideChallenges();
	hideLeaderboard();
	$("body").css("width","800px");
    }
    
}

function hideChallenges() {
    $("#challenges").css("display","none").css("visibility","hidden");
}

function showChallenges() {
    $("#challenges").css("display","block").css("visibility","visible");
}

function hideLeaderboard() {
    $("#leaderboard").css("display","none").css("visibility","hidden");
}

function showLeaderboard() {
    $("#leaderboard").css("display","block").css("visibility","visible");
}

function hidePayments() {
    $("#payments").css("display","none").css("visibility","hidden");
}

function showPayments() {
    $("#payments").css("display","block").css("visibility","visible");
}

function openWin(page) {
    gotoUrl = pageUrl + "/" + page;
    window.open(gotoUrl);
}
