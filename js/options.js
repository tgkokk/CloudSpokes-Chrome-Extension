function animationsAndHide() {
    $(".menu a").click(function(ev) {
        ev.preventDefault();
        selected = "selected";

        $(".mainview > *").removeClass(selected);
        $(".menu li").removeClass(selected);
        setTimeout(function() {
	    $(".mainview > *:not(.selected)").css("display", "none");
        }, 100);

        $(ev.currentTarget).parent().addClass(selected);
        currentView = $($(ev.currentTarget).attr("href"));
        currentView.css("display", "block");
        setTimeout(function() {
	    currentView.addClass(selected);
        }, 0);

        setTimeout(function() {
	    $("body")[0].scrollTop = 0;
        }, 200);
    });

    $(".mainview > *:not(.selected)").css("display", "none");
}

function isInt(n) {
    return n%1 == 0;
}

function getOptions() {
    if (localStorage["enable-challenges"]) {
	$("#enable-challenges").prop("checked",true);

	$("#no-submitted-challenges").prop("checked",localStorage["no-submitted-challenges"] == "true");
	
	$("#challenges-interval").val(localStorage["challenges-interval"]);
	$("#challenges-interval-text").val(localStorage["challenges-interval-text"]);

	$("#notify-most").val(localStorage["notify-most"]);
	$("#notify-most-text").val(localStorage["notify-most-text"]);	
    }
    if (localStorage["enable-messages"]) {
	$("#enable-messages").prop("checked",true);

	$("#messages-interval").val(localStorage["messages-interval"]);
	$("#messages-interval-text").val(localStorage["messages-interval-text"]);

    }
}


function setOptions() {
    selected = $("#enable-challenges").is(":checked");
    if ((selected && ! ($("#notify-most").val() && $("#challenges-interval").val())) ||
	($("#enable-messages") && ! $("#messages-interval").val())) {
	alert("Error: You haven't input some interval numbers. Please check your options.");
	return;
    }

    localStorage["enable-challenges"] = selected;
    if (selected) {
	localStorage["no-submitted-challenges"] = $("#no-submitted-challenges").is(":checked");
	localStorage["challenges-interval"] = $("#challenges-interval").val();
	localStorage["challenges-interval-text"] = $("#challenges-interval-text").val();
	localStorage["notify-most"] = $("#notify-most").val();
	localStorage["notify-most-text"] = $("#notify-most-text").val();
    }
    selected = $("#enable-messages").is(":checked");
    localStorage["enable-messages"] = selected;
    if (selected) {
	localStorage["messages-interval"] = $("#messages-interval").val();
	localStorage["messages-interval-text"] = $("#messages-interval-text").val();
    }

    var bgpg = chrome.extension.getBackgroundPage();
    bgpg.location.reload();
    
    $("#saved-challenges").fadeIn();
    $("#saved-messages").fadeIn();
    setTimeout(function() {
	$("#saved-challenges").fadeOut(function() {
	    $("#saved-challenges").hide();
	});
	$("#saved-messages").fadeOut(function() {
	    $("#saved-messages").hide();
	});
    }, 2500);
}

$(document).ready(function() {
    animationsAndHide();
    getOptions();
    $("#save-challenges").click(setOptions);
    $("#save-messages").click(setOptions);
    $("#enable-challenges").change(function() {
	if ($("#enable-challenges").is(":checked")) {
	    $("#challenges-hidden").slideDown();
	}
	else {
	    $("#challenges-hidden").slideUp();
	}
    });

    $("#enable-messages").change(function() {
	if ($("#enable-messages").is(":checked")) {
	    $("#messages-hidden").slideDown();
	}
	else {
	    $("#messages-hidden").slideUp();
	}
    });
    

    if ($("#enable-challenges").is(":checked")) {
	$("#challenges-hidden").show();
    }

    if ($("#enable-messages").is(":checked")) {
	$("#messages-hidden").show();
    }
});
