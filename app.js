var io = require('socket.io')();
var Omx = require('node-omxplayer');
var fs = require('fs');
var exec = require('child_process').exec;

var DIR = 'uploads/';
var port = 8000;
var player = Omx();
var isPlaying = false;
var musicsLastIndex = 0;
var musicsList;
var musicsLength;
var musicsJson;

function updateMusicInfo(){
    musicsList = fs.readdirSync(DIR);
    musicsLength = musicsList.length;
    musicsJson = JSON.stringify(musicsList);
}

function playMusic(index){
    if(player!=null){
        player.newSource(DIR+musicsList[index]);
        isPlaying = true;
    }
    else{
        console.log("Player is null");
    }
}

updateMusicInfo();
if (!fs.existsSync(DIR)){
    fs.mkdirSync(DIR);
}

player.on('close', function(){
    isPlaying = false;

    if(musicsLastIndex==musicsLength-1){
        musicsLastIndex=0;
    }
    else{
        musicsLastIndex++;
    }

    playMusic(musicsLastIndex);
    io.emit('play', musicsLastIndex);
});

player.on('error', function(){
    console.log("Player error");
});

io.on('connection', function(client){
    userConnected = true;

    client.on('play', function(index){
        musicsLastIndex = index;
        playMusic(index);
    });

    client.on('pause', function(){
        if(player!=null && player.running){
            player.pause();
            isPlaying = !isPlaying;
        }
        else if(player!=null && !player.running){
            playMusic(musicsLastIndex);
        }
    });

    client.on('volumeUp', function(){
        if(player!=null && player.running){
            player.volUp();
        }
    });

    client.on('volumeDown', function(){
        if(player!=null && player.running){
            player.volDown();
        }
    });

    client.on('file', function(filename, file){
        require("fs").writeFile(DIR+filename, file, 'base64', function(err) {
            if (err){
                client.emit('file', false);
            }
            else {
                client.emit('file', true);
            }
        });
    });

    client.on('list', function(){
        updateMusicInfo();
        client.emit('list', musicsJson, musicsLastIndex, isPlaying);
    });
});

io.listen(port);
console.log('Server running on port ' + port + '\n');
