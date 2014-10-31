var jsdom = require('jsdom');
var request = require('request');
var fs = require('fs');

var blockchainUrl = 'https://blockchain.info';
var discusFishUrl = blockchainUrl + '/address/1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY';

function sendRequest(url, callback) {
	console.log('Send request: ' + url);
	request(url, function(err, response, body) {
		if( err || response.statusCode !== 200 ) {
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

var transactions = [], offset = 0, offsetSize, offsetMax;

function getPageElements($) {
	return $('#tx_container').find('.txdiv');
}

function grubPageNext($, finishBack) {
	console.log(offset, offsetMax);
	offset += offsetSize;
	console.log(offset, offsetMax);
	if( offset < offsetMax )
		sendRequest(discusFishUrl + '?offset=' + offset, function ($) {
			addPage($, function() {
				grubPageNext($, finishBack);
			});
		});
	else
		finishBack();
}

function addPage($, callback) {
	var $transactions = getPageElements($);
	grubTransactionPageNext($, $transactions, 0, function () {
		var fileContent = JSON.stringify(transactions, null, 4);
		fs.writeFile('discus_fish_temp.json', fileContent);
		callback();
	});
}

function grubTransactionPageNext($, $transactions, transactionPageIndex, callback) {
	var transaction = $transactions[transactionPageIndex];
	if( transaction ) {
		var $txDiv = $(transaction);
		var $table = $txDiv.find('table').first();
		var $trs = $table.find('tr');
		var isBaseCoin = $($trs[1]).find('td').first().children().length == 1
		if( isBaseCoin ) {
			var elementUrl = blockchainUrl + $($trs[0]).find('a')[0].pathname + '?show_adv=true';
			sendRequest(elementUrl, function ($$) {
				addTransactionPage($$);
				grubTransactionPageNext($, $transactions, transactionPageIndex + 1, callback);
			});
		} else
			grubTransactionPageNext($, $transactions, transactionPageIndex + 1, callback);
	} else
		callback();
}

function addTransactionPage($) {
	var $main = $('.row-fluid').first();
	var $mainDivs = $main.children();

	var $div1 = $($mainDivs[0]);
	var $dateTr = $($div1.find('.table').find('tr')[2]);
	var date = $dateTr.find('td').last().text().trim();
	var $blockNTr = $($div1.find('.table').find('tr')[3]);
	var blockN = $blockNTr.find('td').last().text().trim();

	var $div3 = $($mainDivs[2]);
	var coinBaseText = $div3.text();
	var user = coinBaseText.split('Mined by ')[1];

	transactions.push({
		blockN: blockN,
		date: date,
		coinBaseText: coinBaseText,
		user: user ? user.trim() : ''
	});
}

sendRequest(discusFishUrl, function ($) {
	offsetSize = +getPageElements($).length;
	offsetMax = +$('.pagination').find('li').last().prev().find('a').attr('href').split('?offset=')[1].split('&')[0];
	addPage($, function() {
		grubPageNext($, function () {
			console.log('Transactions length: ' + transactions.length);
			var fileContent = JSON.stringify(transactions, null, 4);
			fs.writeFile('discus_fish_' + (new Date).getTime() + '.json', fileContent, function(err) {
			    if( err )
		        	console.log(err);
			    else
		      		console.log('The file was saved!');
			});
		});
	});
});
