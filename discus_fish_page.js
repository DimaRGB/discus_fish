var fs = require('fs');
var utils = require('./utils');

var transactions = [], offset = +process.argv[2] || 0;

function addPage($, callback) {
    var $transactions = utils.getPageElements($);
    grubTransactionPageNext($, $transactions, 0, callback);
}

function grubTransactionPageNext($, $transactions, transactionPageIndex, callback) {
    var transaction = $transactions[transactionPageIndex];
    if( transaction ) {
        var $txDiv = $(transaction);
        var $table = $txDiv.find('table').first();
        var $trs = $table.find('tr');
        var isBaseCoin = $($trs[1]).find('td').first().children().length == 1;
        if( isBaseCoin ) {
            var elementUrl = utils.blockchainUrl + $($trs[0]).find('a')[0].pathname + '?show_adv=true';
            utils.sendRequest(elementUrl, function ($$) {
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

utils.sendRequest(utils.discusFishUrl + '?offset=' + offset, function ($) {
    addPage($, function() {
        console.log('Transactions length: ' + transactions.length);
        var fileName = 'pages/discus_fish_time_' + (new Date).getTime() + '_offset_' + offset + '.json';
        var fileContent = JSON.stringify(transactions, null, 4);
        fs.writeFile(fileName, fileContent, function(err) {
            if( err )
                console.log(err);
            else
                console.log('The file was saved: ' + fileName);
        });
    });
});
