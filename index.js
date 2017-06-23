/**
 * Created by ganesha on 6/20/17.
 */

'use strict';
// module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-sdk');
// let app = new Alexa.app('watson');
var AppleDataHelper = require('./apple_data_helper');

exports.handler = function (event, context, callback) {
  
    
    var alexa = Alexa.handler(event, context);
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

        var category = 'MOVIES';
        var limit = 10;
        var reprompt = 'Tell me what kind of data and how many you want';
        if (_.isEmpty(category)) {
            let prompt = 'I didn\'t hear a category. Tell me the category.';
            // res.say(prompt).reprompt(reprompt).shouldEndSession(false);
            this.emit(':ask', prompt, reprompt);
            // return true;
        } else {
            let appleHelper = new AppleDataHelper();

            appleHelper.requestAppleData(category, limit).then(function (appleData) {
                console.log(appleData);
                // res.say(appleHelper.formatAppleData(appleData)).send();
                this.emit(':tellWithCard', appleHelper.formatAppleData(appleData), 'TOP MOVIES',appleHelper.formatAppleData(appleData) );
            }).catch(function (err) {
                console.log(err.statusCode);
                let prompt = 'I didn\'t have data for ' + category;
                // res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
                this.emit(':tell', prompt);
            });
            // return false;
        }
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

// app.launch(function(req, res) {
//     let prompt = 'What kind of data you want from apple? songs, movies, apps?';
//     res.say(prompt).reprompt(prompt).shouldEndSession(false);
// });
//
// app.intent('PopularInfo', {
//         'slots': {
//             'CATEGORY': 'string',
//             'SIZE': 'number'
//         },
//         'utterances': ['{|get me |give me} {|popular |top } {|SIZE}  {-|CATEGORY}']
//     },
//
// );
//
// //hack to support custom utterances in utterance expansion string
// let utterancesMethod = app.utterances;
// app.utterances = function() {
//     return utterancesMethod().replace(/\{\-\|/g, '{');
// };

var languageStrings = {
    "en": {
        "translation": {
            // "RECIPES": recipes.RECIPE_EN_US,
            "SKILL_NAME": "Trender Apple",
            "WELCOME_MESSAGE": "Welcome to %s. You can ask a question like, what\'s the recipe for a chest? ... Now, what can I help you with.",
            "WELCOME_REPROMPT": "For instructions on what you can say, please say help me.",
            "DISPLAY_CARD_TITLE": "%s  - Recipe for %s.",
            "HELP_MESSAGE": "You can ask questions such as, what\'s the recipe, or, you can say exit...Now, what can I help you with?",
            "HELP_REPROMPT": "You can say things like, what\'s the recipe, or you can say exit...Now, what can I help you with?",
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