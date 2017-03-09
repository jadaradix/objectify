"use strict";
var CreeperLocation_1 = require("../classes/CreeperLocation");
var CreeperHandlesTweetedAt_1 = require("../classes/CreeperHandlesTweetedAt");
var CreeperFrequency_1 = require("../classes/CreeperFrequency");
var Creeper = (function () {
    function Creeper(creeperId, name, type, keywords, actions, state, isEnabledByUs, frequency, delay, handlesTweetedAt, converterId, deepProfileOnFind, deepProfileOnAction, geofilter) {
        var _this = this;
        if (actions === void 0) { actions = []; }
        if (state === void 0) { state = "disabled"; }
        if (isEnabledByUs === void 0) { isEnabledByUs = false; }
        if (frequency === void 0) { frequency = new CreeperFrequency_1["default"](30); }
        if (delay === void 0) { delay = 5 * 60; }
        if (handlesTweetedAt === void 0) { handlesTweetedAt = new CreeperHandlesTweetedAt_1["default"](); }
        if (converterId === void 0) { converterId = null; }
        if (deepProfileOnFind === void 0) { deepProfileOnFind = false; }
        if (deepProfileOnAction === void 0) { deepProfileOnAction = false; }
        if (geofilter === void 0) { geofilter = new CreeperLocation_1["default"](); }
        this.creeperId = creeperId;
        this.name = name;
        this.type = type;
        this.keywords = keywords;
        this.state = state;
        this.isEnabledByUs = isEnabledByUs;
        this.frequency = frequency;
        this.delay = delay;
        this.handlesTweetedAt = handlesTweetedAt;
        this.converterId = converterId;
        this.deepProfileOnFind = deepProfileOnFind;
        this.deepProfileOnAction = deepProfileOnAction;
        this.geofilter = geofilter;
        if (actions) {
            this.actions = actions;
            this.actionsCountStore = {};
            this.actions.map(function (action) { return action.type.toString(); }).forEach(function (actionTypeString) {
                _this.actionsCountStore["unique-action-current-" + actionTypeString] = Math.floor(Math.random() * _this.actions.length);
            });
        }
    }
    Creeper.prototype.setClient = function (client) {
        this.client = client;
        return this;
    };
    Creeper.prototype.setConverter = function (converter) {
        this.converter = converter;
        return this;
    };
    Creeper.prototype.toString = function () {
        return this.name + " (" + this.keywords + ")";
    };
    Creeper.prototype.bumpAction = function (type) {
        if (this.actionsCountStore["unique-action-current-" + type] === this.actions.length - 1) {
            console.log(" -> lastActionCount in creeperBumpAction is at upper bound; changing...");
            return (this.actionsCountStore["unique-action-current-" + type] = 0);
        }
        else {
            console.log(" -> lastActionCount in creeperBumpAction is NOT at upper bound; incrementing...");
            return (this.actionsCountStore["unique-action-current-" + type] += 1);
        }
    };
    ;
    Creeper.prototype.canTweet = function (tweet, currentSeconds, keyword) {
        var elements = tweet.text.split(" ");
        // don't annoy people (already tweeted at them)
        if (this.handlesTweetedAt.contains(tweet.user.screen_name))
            return false;
        // don't barge into conversations
        if (tweet.text.indexOf("@") === 0)
            return false;
        // don't screw with retweets (RT syntax)
        if (tweet.text.indexOf("RT ") === 0)
            return false;
        // don't screw with retweets (object property)
        if (tweet.retweeted_status !== undefined)
            return false;
        // don't spam (tweet too often)
        if (currentSeconds >= this.frequency.value)
            return false;
        // don't tweet at yourself
        if (tweet.user.screen_name.toLowerCase() === this.client.twitter.toLowerCase())
            return false;
        // don't tweet if geofilter is specified and user location is specified and they are similar
        if (this.geofilter.length > 0 && tweet.user.location !== null) {
            var matchingLocations = this.geofilter.filter(function (location) {
                return location.toLowerCase() === tweet.user.location.toLowerCase();
            });
            if (matchingLocations.length === 0) {
                return false;
            }
        }
        // don't tweet at an obviously spammy tweet
        var elementsLinks = elements.filter(function (element) { return element.indexOf("http:") === 0 || element.indexOf("https:") === 0; });
        var elementsHashtags = elements.filter(function (element) { return element[0] === "#"; });
        var elementsMentions = elements.filter(function (element) { return element[0] === "@"; });
        if (elements.length === elementsLinks.length + elementsHashtags.length + elementsMentions.length) {
            return false;
        }
        // don't reply to a tweet where the keyword is part of another word
        // this code is "self documenting"
        if (tweet.text.length > keyword.length) {
            var regex = new RegExp(keyword, "gi"), result, indices = [];
            while ((result = regex.exec(tweet.text))) {
                indices.push(result.index);
            }
            if (indices.length === 0)
                return false; // it was never mentioned... stupid twitter
            var allowedWrappingCharacters_1 = [" ", "\"", "'", "!", ".", ","];
            var indicesWithASpaceBeforeOrAfter = indices.filter(function (index) {
                if (index === 0) {
                    // first: needs a space after it
                    return (allowedWrappingCharacters_1.indexOf(tweet.text[index + keyword.length]) !== -1);
                }
                else if (index === tweet.text.length - keyword.length) {
                    // last: needs a space before it
                    return (allowedWrappingCharacters_1.indexOf(tweet.text[index - 1]) !== -1);
                }
                else {
                    // middle: needs a space before it AND after it
                    return (allowedWrappingCharacters_1.indexOf(tweet.text[index - 1]) !== -1 && allowedWrappingCharacters_1.indexOf(tweet.text[index + keyword.length]) !== -1);
                }
            });
            // console.log('tweet text', tweet.text);
            // console.log('indices', indices);
            // console.log('indicesWithASpaceBeforeOrAfter', indicesWithASpaceBeforeOrAfter);
            if (indicesWithASpaceBeforeOrAfter.length === 0)
                return false;
            // don't tweet at foreigners
            if (tweet.user.lang && tweet.user.lang !== "en") {
                return false;
            }
        }
        // tweet
        return true;
    };
    Creeper.prototype.tweeted = function (tweet) {
        this.handlesTweetedAt.add(tweet.user.screen_name);
        return this;
    };
    Creeper.prototype.enable = function () {
        this.state = "enabled";
        return this;
    };
    Creeper.prototype.disable = function () {
        this.state = "disabled";
        return this;
    };
    Creeper.prototype.setGeo = function (geofilter) {
        this.geofilter = geofilter;
        return this;
    };
    return Creeper;
}());
exports.__esModule = true;
exports["default"] = Creeper;
