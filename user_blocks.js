var fs = require('fs');

var discus_fish = fs.readFileSync('discus_fish_1415009221330.json', 'utf-8');
discus_fish = JSON.parse(discus_fish);

var userBlocks = [];
for( var i = 0; i < discus_fish.length; i++ ) {
	var notFound = true;
	for( var j = 0; j < userBlocks.length; j++ ) {
		if( userBlocks[j].user == discus_fish[i].user ) {
			userBlocks[j].blocks++;
			notFound = false;
		}
	}
	if( notFound ) {
		userBlocks.push({
			user: discus_fish[i].user,
			blocks: 1
		});
	}
}

fs.writeFile('user_blocks.json', JSON.stringify(userBlocks), null, 4);
