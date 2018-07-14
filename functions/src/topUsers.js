const _ = require("lodash");

module.exports = function (snapshot, callback) {

    var popularity = {};
    var usage = {};

    _.forOwn(snapshot, function (d, key) {
        // POPULARITY POINTS is calculated using the below equation ->
        // ((followers_gained - followers_lost)*5) + (liked_user_IDs.count*3) + num_views
        if (
            !d || !d || !d.user_id || !d.liked_user_IDs ||
            !d.followers_gained || !d.followers_lost
        ) return
        var popularity_points = (
            ((d.followers_gained - d.followers_lost) * 5) +
            ((Object.keys(d.liked_user_IDs || {}).length) * 3) +
            d.num_views
        );
        if (!popularity[d.user_id]) popularity[d.user_id] = 0;
        popularity[d.user_id] += popularity_points;

        // USAGE POINTS is calculated using the below equation -> 
        // (user_id*5) + (liked_user_IDs*3)
        _.forOwn(d.liked_user_IDs, function (time, user) {
            if (!usage[user]) usage[user] = 0;
            usage[user] += 3;
        });
        if (!usage[d.user_id]) usage[d.user_id] = 0;
        usage[d.user_id] += 5;
    });

    // Function to find the top 5 users
    function findTopFive(obj) {
        var userpoints = [];
        var obj_sorted = Object.keys(obj).sort(function (a, b) { return obj[a] - obj[b] });
        _.forEach(obj_sorted.slice(obj_sorted.length - 5, obj_sorted.length), function (user) {
            userpoints.unshift({ user: user, points: obj[user] });
        });
        return userpoints;
    }

    callback(null, {
        "Popular Users based on followers, likes and views:": findTopFive(popularity),
        "Popular Users based on usage": findTopFive(usage)
    });

}