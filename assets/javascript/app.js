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

                var button = $("<button id='gen'>Generate Playlist</button>");

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
                trailDiv.append(n, l, c, d, le, s, b, f);
                trailDiv.append(button);
                $("#trail-show").prepend(trailDiv);
            }
        })
    }

    $(".container").on("click", "#gen", function itunesAPI() {

        var QueryURL = "https://itunes.apple.com/search";

        $.ajax({
            url: QueryURL,
            crossDomain: true,
            dataType: 'json',
            data: {
                term: 'random',
                lang: 'en_us',
                entity: 'mix, song',
                limit: 5,
                explicit: 'no',
            },
            method: 'GET'
        }).then(function (data) {
            playList = data.results;
            console.log(playList);
    
            var hard = $("<h6>").text("Recomended Songs for Hard Trails")
    
            for (var i = 0; i < data.results.length; i++) {
                var musicDiv = $("<div class='music'>");
                var download = $("<a>").text("Full Song!")
                download.attr("href", playList[i].trackViewUrl);
                // var preview = $("<a class='link'>").attr("href", playList[i].previewUrl).text("Song Preview");
                var name = $("<p>").text(playList[i].trackName);
                var x = document.createElement("AUDIO");
    
                if (x.canPlayType("audio/mpeg")) {
                    x.setAttribute("src", playList[i].previewUrl);
                } else {
                    x.setAttribute("src", playList[i].previewUrl);
                }
    
                x.setAttribute("controls", "controls");
    
                musicDiv.append(name, x);
                musicDiv.prepend(hard, download);
                $("#music-show").prepend(musicDiv);
            }
        });
    });

});