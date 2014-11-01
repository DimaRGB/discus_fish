var jsdom = require('jsdom');
var request = require('request');

var blockchainUrl = 'https://blockchain.info';
var discusFishUrl = blockchainUrl + '/address/1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY';

function sendRequest(url, callback) {
    console.log('Send request: ' + url);
    request(url, function(err, response, body) {
        if( err || !response || response.statusCode !== 200 ) {
            console.log('Response error: ' + response.statusCode);
            sendRequest(url, callback);
        } else
            jsdom.env({
                html: body,
                scripts: ['./jquery-1.11.1.min.js'],
                done: function(err, window) {
                    if( err ) {
                        console.log('Error: ' + err);
                        sendRequest(url, callback);
                    } else {
                        console.log('Success');
                        callback(window.jQuery);
                    }
                }
            });
    });
}

function getPageElements($) {
    return $('#tx_container').find('.txdiv');
}

module.exports = {
    blockchainUrl: blockchainUrl,
    discusFishUrl: discusFishUrl,
    sendRequest: sendRequest,
    getPageElements: getPageElements
};
