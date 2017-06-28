/**
 * Created by ganesha on 6/20/17.
 */

'use strict';
// module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-sdk');
// let app = new Alexa.app('watson');
var AppleDataHelper = require('./apple_data_helper');
var http = require('http');
var link_get = 'http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topMovies/limit=10/json';

exports.handler = function (event, context, callback) {


    var alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = "A345382Sds=93478";
    // alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();

};

var handlers = {
    // Alexa launch intent to start speaking
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'PopularInfoIntent': function() {
        // var self = this;
        //     http.get("http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topMovies/limit=10/json", (res) => {
        //         const statusCode = res.statusCode;
        //         const contentType = res.headers['content-type'];
        //
        //         let error;
        //         if (statusCode !== 200) {
        //             error = new Error(`Request Failed.\n` +
        //                 `Status Code: ${statusCode}`);
        //         }
        //         if (error) {
        //             console.log(error.message);
        //             // consume response data to free up memory
        //             res.resume();
        //             return;
        //         }
        //
        //         res.setEncoding('utf8');
        //         let rawData = '';
        //         res.on('data', (chunk) => rawData += chunk);
        //         res.on('end', () => {
        //             try {
        //                 let parsedData = JSON.parse(rawData);
        //                 console.log(parsedData);
        //                 console.log(parsedData['feed']['entry'][0]['im:name']['label']);
        //                 self.emit(':tell',parsedData['feed']['entry'][0]['im:name']['label']);
        //
        //             } catch (e) {
        //                 console.log(e.message);
        //             }
        //         });
        //     }).on('error', (e) => {
        //         console.log(`Got error: ${e.message}`);
        //     });

        var self =this;
       getData.then(function (data) {
            console.log("Something")
            console.log(data+":Hope some data");
           self.emit(":tell",data);
        }).catch(function(err){
           console.log("Something went bad")
        });


    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'Unhandled': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    }
};

var getData = new Promise((resolve, reject) => {
    var category = 'MOVIES';
    var limit = 10;
    var appleHelper = new AppleDataHelper();

    appleHelper.requestAppleData(category, limit).then(function (appleData) {
        console.log("The data received is :"+appleHelper.formatAppleData(appleData));
        // res.say(appleHelper.formatAppleData(appleData)).send();
        resolve(appleHelper.formatAppleData(appleData));
    }).catch(function (err) {

        reject(err);
    });
});

var languageStrings = {
    "en": {
        "translation": {
            // "RECIPES": recipes.RECIPE_EN_US,
            "SKILL_NAME": "Trender Apple",
            "WELCOME_MESSAGE": "Welcome to %s. You can ask a question like, what\'s the recipe for a chest? ... Now, what can I help you with.",
            "WELCOME_REPROMPT": "For instructions on what you can say, please say help me.",
            "DISPLAY_CARD_TITLE": "%s  - Recipe for %s.",
            "HELP_MESSAGE": "You can ask questions such as, what\'s the recipe, or, you can say exit...Now, what can I help you with?",
            "HELP_  REPROMPT": "You can say things like, what\'s the recipe, or you can say exit...Now, what can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "RECIPE_REPEAT_MESSAGE": "Try saying repeat.",
            "RECIPE_NOT_FOUND_MESSAGE": "I\'m sorry, I currently do not know ",
            "RECIPE_NOT_FOUND_WITH_ITEM_NAME": "the recipe for %s. ",
            "RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME": "that recipe. ",
            "RECIPE_NOT_FOUND_REPROMPT": "What else can I help with?"
        }
    },
    "en-US": {
        "translation": {
            // "RECIPES": recipes.RECIPE_EN_US,
            "SKILL_NAME": "Trender Apple"
        }
    },
    "en-GB": {
        "translation": {
            // "RECIPES": recipes.RECIPE_EN_GB,
            "SKILL_NAME": "Trender Apple"
        }
    }
};