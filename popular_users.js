var fs = require('fs');
var buffer = fs.readFileSync('./discus_fish_1417444247432.json');
var blocks = JSON.parse(buffer);
var users = {};

for( var i = 0; i < blocks.length - 1; i++ ) {

    try{
        if(blocks[i].user){
            if(users[blocks[i].user]){
                users[blocks[i].user]++
            } else {
                users[blocks[i].user] = 1;
            }
        } 
    } catch(e){

    }
}

//console.log(users); process.exit(0);

var usersKeysSorted = Object.keys(users).sort(function(a,b){ return  - users[a] + users[b] });

//  console.log(usersKeysSorted);

var res = {};
for(var i=0; i<20; i++){
    res[usersKeysSorted[i]] = users[usersKeysSorted[i]];
}   

console.log(res);

// fileName = 'discus_fish_' + (new Date).getTime() + '.json';
// fs.writeFile(fileName, JSON.stringify(transactions, null, 4), function (err) {
//     if( err )
//         console.log(err);
//     else
//         console.log('The file was saved: ' + fileName);
// });
