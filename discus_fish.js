var exec = require('exec');
var utils = require('./utils');

var offsetSize, offsetMax;

function grubPageNext(offset, finishBack) {
	if( offset < offsetMax ) {
        console.log(offset, offsetMax);
        var command = 'node discus_fish_page.js ' + offset;
        console.log('Run: ' + command);
        exec(command, function(err, out, code) {
            process.stderr.write(err);
            process.stdout.write(out);
            if( err instanceof Error || code )
                grubPageNext(offset, finishBack);
            else
                grubPageNext(offset + offsetSize, finishBack);
            console.log('Process exit: ' + code);
        });
    } else
		finishBack();
}

utils.sendRequest(utils.discusFishUrl, function ($) {
	offsetSize = +utils.getPageElements($).length;
	offsetMax = +$('.pagination').find('li').last().prev().find('a').attr('href').split('?offset=')[1].split('&')[0];
    grubPageNext(+process.argv[2] || 0, function() {
        console.log('Finish grub Discus Fish');
        exec('node concat.js pages', function(err, out, code) {
            process.stderr.write(err);
            process.stdout.write(out);
            process.exit(code);
        });
    });
});
