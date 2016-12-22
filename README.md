# Musipy
NodeJs server using omxplayer to play song from an external app.

# Install

You need **nodejs** and **npm** installed first.

Put the *[app.js](https://github.com/omaflak/Musipy/blob/master/app.js)* file on your RaspberryPi and execute the following commands in the directory :

    npm install socket.io
    npm install node-omxplayer
    
Also if you don't have it yet :

    sudo apt-get install omxplayer

Finally, run the server :

    nodejs app.js
    
You can make the nodejs script as a service and start it at the boot of your Pi using **[forever-service](https://github.com/zapty/forever-service)**

# Android App

You can find my Android app here: https://play.google.com/store/apps/details?id=me.aflak.musipy
