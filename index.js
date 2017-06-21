/**
 * Created by ganesha on 6/20/17.
 */

'use strict';
module.change_code = 1;
let _ = require('lodash');
let Alexa = require('alexa-app');
let app = new Alexa.app('watson');
let AppleDataHelper = require('./apple_data_helper');

app.launch(function(req, res) {
    let prompt = 'What kind of data you want from apple? songs, movies, apps?';
    res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('PopularInfo', {
        'slots': {
            'CATEGORY': 'string',
            'SIZE': 'number'
        },
        'utterances': ['{|get me |give me} {|popular |top } {|SIZE}  {-|CATEGORY}']
    },
    function(req, res) {

        let category = req.slot('CATEGORY');
        let limit = req.slot('SIZE');
        let reprompt = 'Tell me what kind of data and how many you want';
        if (_.isEmpty(category)) {
            let prompt = 'I didn\'t hear a category. Tell me the category.';
            res.say(prompt).reprompt(reprompt).shouldEndSession(false);
            return true;
        } else {
            let appleHelper = new AppleDataHelper();

            appleHelper.requestAppleData(category, limit).then(function (appleData) {
                console.log(appleData);
                res.say(appleHelper.formatAppleData(appleData)).send();
            }).catch(function (err) {
                console.log(err.statusCode);
                let prompt = 'I didn\'t have data for ' + category;
                res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
            });
            return false;
        }
    }
);

//hack to support custom utterances in utterance expansion string
let utterancesMethod = app.utterances;
app.utterances = function() {
    return utterancesMethod().replace(/\{\-\|/g, '{');
};

module.exports = app;
