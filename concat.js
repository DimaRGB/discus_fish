var fs = require('fs');
var dir = './' + (process.argv[2] || 'pages') + '/';
var fileNames = fs.readdirSync(dir);

var transactions = [];
var blockNs = [];

for( var i = 0; i < fileNames.length; i++ ) {
    var fileName = dir + fileNames[i];
    if( /.json/.test(fileName) ) {
        var pageContent = fs.readFileSync(fileName, 'utf-8');
        var pageTransactions = JSON.parse(pageContent);
        for (var j = 0; j < pageTransactions.length; j++) {
            var pageTransaction = pageTransactions[j];
            var blockN = pageTransaction.blockN;
            var notFound = true;
            for (var k = 0; k < blockNs.length; k++) {
                if (blockNs[k] == blockN) {
                    notFound = false;
                    break;
                }
            }
            if (notFound) {
                console.log(blockN);
                blockNs.push(blockN);
                transactions.push(pageTransaction);
            }
        }
    }
}

transactions.sort(function (a, b) {
    if( +a.blockN < +b.blockN )
        return 1;
    else if( +a.blockN > +b.blockN )
        return -1;
    return 0;
});

fileName = 'discus_fish_' + (new Date).getTime() + '.json';
fs.writeFile(fileName, JSON.stringify(transactions, null, 4), function (err) {
    if( err )
        console.log(err);
    else
        console.log('The file was saved: ' + fileName);
});
