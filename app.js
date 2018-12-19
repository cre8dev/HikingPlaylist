$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBxDrdk8o6TGy3lVqgwyQz2jIz6zuBf-Qk",
        authDomain: "aka-joe-project.firebaseapp.com",
        databaseURL: "https://aka-joe-project.firebaseio.com",
        projectId: "aka-joe-project",
        storageBucket: "aka-joe-project.appspot.com",
        messagingSenderId: "682758063555"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();
    var favID = [];
    var favCounter = [];
    var favorite = [];
	
    // Firebase watcher + initial loader
    database.ref().on("value", function (snapshot) {
        if (snapshot.exists()) {
            // storing the snapshot.val() in a variable for convenience
            favID = snapshot.val().ID;
            favCounter = snapshot.val().counter;
        };
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
	
	var easyPlaylist ='<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/playlist/out-walking/pl.53385af769204a0ab843ce245f2fb293"></iframe>';
	
	var mediumPlaylist = '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/playlist/pure-workout/pl.ad0ee1557e3e4feba314fd70f7982766?app=music"></iframe>';
	
	var hardPlaylist = '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/us/playlist/power-workout/pl.edc6571c1a5b49b1a8513673deaf18f5"></iframe>';
	
	//Generate Playlist On Click
	$(document).on("click", "#gen", function () {
		console.log(this.value);
		$("#gen").show();
		if (this.value === "green" || this.value === "greenBlue" ) {
			
			$("#gen").html(easyPlaylist);
			var close = $("<div> Close Playlist</div>").attr({id:"close", class: "btn closeBtn"})
			$("#gen").prepend(close);
			
		} else if (this.value === "blue"){
			
			$("#gen").html(mediumPlaylist);
			var close = $("<div> Close Playlist</div>").attr({id:"close", class: "btn closeBtn"})
			$("#gen").prepend(close);
	} else {
		
		$("#gen").html(hardPlaylist);
		var close = $("<div> Close Playlist</div>").attr({id:"close", class: "btn closeBtn"})
		$("#gen").prepend(close);
		
	}
	});
   
	//Closing Playlist Button
	$(document).on("click", "#close", function () {
		
		$("#gen").hide();
		
	});
    $(document).on("click", ".favBtn", function () {

        var newID = $(this).attr("value");
        var position = favID.indexOf(newID);

        if (position === -1) {
            favorite.push(newID);
            favID.push(newID);
            favCounter.push(1);
            $(this).text("Liked!");
            $("#" + newID).text("1 people liked this trail")
        } else {
            var position2 = favorite.indexOf(newID);
            if (position2 === -1) {
                favorite.push(newID);
                favCounter[position]++;
                $(this).text("Liked!");
                $("#" + newID).text(favCounter[position] + " people liked this trail");
            } else {
                favorite.splice(position2, 1);
                favCounter[position]--;
                $(this).text("Like");
                $("#" + newID).text(favCounter[position] + " people liked this trail");
                if (favCounter[position] === 0) {
                    favID.splice(position, 1);
                    favCounter.splice(position, 1);
                    $("#" + newID).empty();
                };
            };
        };

        // Code for "Setting values in the database"
        database.ref().set({
            ID: favID,
            counter: favCounter
        });
    });

    $(document).on("click", ".searchBtn", function () {
        var zip = $("#search").val().trim();
        var lat;
        var lng;

        var geocodingUrl = "https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=";
        var googleAPIkey = "AIzaSyBcLDPYV93T5_XF3TdfXBRANb9N1wkYn2k";

        $.ajax({
            type: "GET",
            url: geocodingUrl + zip + "&key=" + googleAPIkey,
            dataType: "json"
        }).then(function (data) {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;

            console.log("Latitude : " + lat);
            console.log("Longitude : " + lng);

            $("header, section").empty();

            hikeApi(lat, lng);
        });
    });

    function hikeApi(lat, lon) {

        var trailKey = "200396711-e807f4a3a7208434b577326e19600e21";
        var queryURL = "https://www.hikingproject.com/data/get-trails?" + "lat=" + lat + "&lon=" + lon + "&maxDistance=10" + "&key=" + trailKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var results = response.trails;

            for (var i = 0; i < results.length; i++) {
                var trailDiv = $("<div class='trails'>");

                var n = $("<h6>").text(results[i].name);
                var l = $("<p>").text("Location: " + results[i].location);
                var c = $("<p>").text("Condition: " + results[i].conditionStatus);
                var d = $("<p>").text("Difficulty: " + results[i].difficulty);
                var le = $("<p>").text("Length: " + results[i].length);
                var s = $("<p>").text("Stars: " + results[i].stars);

                var bn = $("<button id='gen'> Generate Playlist</button>").attr({
						class: "btn genBtn",
						value: results[i].difficulty,
				})

                var newID = results[i].id.toString();

                var b = $("<div>").attr({ class: "btn favBtn", value: results[i].id })
                if (favorite.indexOf(newID) === -1) {
                    b.text("Like")
                } else {
                    b.text("Liked!")
                };

                var f = $("<div>").attr("id", results[i].id);
                var position = favID.indexOf(newID);
                if (position != -1) {
                    f.text(favCounter[position] + " people liked this trail")
                };

                var imgLink = $("<a>");
                imgLink.attr({ href: results[i].url, target: "_blank" });

                var image = $("<img>");
                image.attr("src", results[i].imgSmallMed);
                image.addClass("image");
                imgLink.append(image);

                trailDiv.append(imgLink);
                trailDiv.append(n, l, c, d, le, s, b, f, bn);
          
                $("#trail-show").prepend(trailDiv);
            };
        });
    };

 

});