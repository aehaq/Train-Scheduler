var config = {
    apiKey: "AIzaSyAMrOHyzkp35RwzUzl-s5hgjMkoZJwiyhw",
    authDomain: "database-434b0.firebaseapp.com",
    databaseURL: "https://database-434b0.firebaseio.com",
    projectId: "database-434b0",
    storageBucket: "database-434b0.appspot.com",
    messagingSenderId: "1018954509950"
};
firebase.initializeApp(config);

var database = firebase.database();

// Converts arrival to be moment.js compatible, and ensures it uses today's date.
function firstArrival(initialVal) {
    var firstArrival = moment(initialVal, "hh:mm a")
    return firstArrival
};

// Calculates when the nextArrival will be based off of the first arrival and interval.
function nextArrival(firstArrival, interval) {
    var nextArrival = firstArrival;
    while (moment().diff(nextArrival, 'minute') > 0) {
        nextArrival = nextArrival.add(interval, 'minute') 
    }
    return nextArrival;
};

// Calculates time until next arrival
function timeUntil(nextArrival) {
    var timeUntil = moment().diff(nextArrival, 'minute') * -1
    return timeUntil;
};

$(document).ready(function() {

    $("#submit").on("click", function() {
        event.preventDefault();
        console.log("Goalpost: 'submit'")

        var name = $('#name-input').val();
        var dest = $('#dest-input').val();
        var initTrain = $('#initial-input').val();
        var frequency = $('#freq-input').val();

        if (name != "" && dest != "" && initTrain != "" && frequency != "") {
    
            database.ref().push({
                name: name,
                destination: dest,
                originalTrain: initTrain,
                interval: frequency
            });

            $('.form-control').val('');
        };
    });

    database.ref().on("child_added", function(snapshot) {
        console.log("Goalpost: 'Child Added'");

        var name = snapshot.val().name;
        var dest = snapshot.val().destination;
        var original = snapshot.val().originalTrain;
        var int = snapshot.val().interval;

        var firstTrain = firstArrival(original)

        var nextTrain = nextArrival(firstTrain, int);

        var timeLeft = timeUntil(nextTrain);

        var newRow = $('<tr>')
    
        var nameCell = $('<td scope="row">')
        nameCell.text(name);
        newRow.append(nameCell);
    
        var destCell = $('<td scope="row">')
        destCell.text(dest);
        newRow.append(destCell);

        var freqCell = $('<td scope="row">')
        freqCell.text(int);
        newRow.append(freqCell);
    
        var nextCell = $('<td scope="row">')
        nextCell.text(nextTrain.format("HH:mm"));
        newRow.append(nextCell);

        var awayCell = $('<td scope="row">')
        awayCell.text(timeLeft + " min");
        newRow.append(awayCell);

        $('#trains-here').append(newRow);

    })

});