/**
 * Created by ganesha on 6/19/17.
 */
'use strict';
let _ = require('lodash');
let rp = require('request-promise');
let ENDPOINT = 'http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/';
//http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/ws/RSS/topMovies/limit=10/json

function AppleDataHelper() { }

AppleDataHelper.prototype.requestAppleData = function(category, limit) {


    let caty = '';

    if(category === 'SONGS')
        caty = 'topsongs';
    else if(category === 'ALBUMS')
        caty = 'topalbums';
    else if(category === 'MOVIES')
        caty = 'topMovies';
    else if(category === 'APPS')
        caty = 'topfreeapplications';

    return this.getAppleData(caty, limit).then(
        function(response) {
            console.log('success - received popular info for ' + category);
            return response.body;
        }
    );
};

AppleDataHelper.prototype.getAppleData = function(category,limit) {
    let options = {
        method: 'GET',
        uri: ENDPOINT + category + '/limit='+limit+'/json',
        resolveWithFullResponse: true,
        json: true
    };
    return rp(options);
};


AppleDataHelper.prototype.formatAppleData = function(appleData) {
    let topList =[] ;

    let topEntries = appleData.feed.entry;
    for(let i=0 ; i<topEntries.length; i++){
        let im = topEntries[i];
        //console.log(im['im:name']);
        topList.push(topEntries[i]['im:name']['label']);

    }


    /*console.log(">>>>>>>>>>>>>>");
    console.log(topList);
    console.log(topList.length);
    console.log(">>>>><<<<<<<<<<<>>>>>>>>>");*/

    let category = _.template('${category}')({
        category: appleData.feed.title.label
    });
    if (topList) {
        let template = _.template('Here are the top ${length} ${category} list ${listData} ');
        return template({
            length: topList.length,
            listData: topList,
            category: category
        });
    } else {
        //    no delay
        return _.template('There are no delay results found')({
            length: topList.length,
            category: category
        });
    }
};


module.exports = AppleDataHelper;