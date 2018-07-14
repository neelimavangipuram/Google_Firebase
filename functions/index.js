const functions = require("firebase-functions");
var admin = require("firebase-admin");

const calculateTopUsers = require("./src/topUsers");
var config = require("./src/config.json")

var serviceAccount = require(config.serviceAccount);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.databaseURL
});

exports.topUsers = functions.https.onRequest((request, response) => {

    // Invoke the function from here.

    var query = admin.database().ref(config.databaseRootRef).orderByKey();
    query.once("value")
        .then(function (snapshot) {
            snapshot = snapshot.toJSON();
            calculateTopUsers(snapshot, function (err, data) {
                if (err) return console.error(err);
                console.log("Successfully fetched top users from video data ... " + data);
                response.send(data);
            });
            return false;
        })
        .catch(function (e) {
            console.error(e);
        })
});