const { createCanvas, loadImage } = require('canvas');
const djs = require('discord.js');
const fs = require('fs');

let calculateChristmasCountdown = () => {
    var now = new Date();
    var currentMonth = (now.getMonth() + 1);
    var currentDay = now.getDate();
    var nextChristmasYear = now.getFullYear();

    if(currentMonth == 12 && currentDay > 25){
        nextChristmasYear = nextChristmasYear + 1;
    }
  
    var nextChristmasDate = nextChristmasYear + '-12-25T00:00:00.000Z';
    var christmasDay = new Date(nextChristmasDate);

    var diffSeconds = Math.floor((christmasDay.getTime() - now.getTime()) / 1000);
  
    var days = 0;
    var hours = 0;
    var minutes = 0;
    var seconds = 0;

    if(currentMonth != 12 || (currentMonth == 12 && currentDay != 25)){
        days = Math.floor(diffSeconds / (3600*24));
        diffSeconds  -= days * 3600 * 24;
        hours   = Math.floor(diffSeconds / 3600);
        diffSeconds  -= hours * 3600;
        minutes = Math.floor(diffSeconds / 60);
        diffSeconds  -= minutes * 60;
        seconds = diffSeconds;
    }

    let details = days + ' Days ' + hours + ' Hours ' + minutes + ' Minutes ' + seconds + ' Seconds'
  
    return details;
}

let genCanvasText = async (text, fontSize) => {
    console.log(text, fontSize)
    let canvas = createCanvas(1500, 300);
    let ctx = canvas.getContext('2d');

    let img = await loadImage(fs.readFileSync('bg.jpg'));
    ctx.drawImage(img, -(img.width - 1500), -(img.height - 750));

    ctx.fillStyle = '#fff'

    ctx.textAlign = 'center'
    ctx.font = fontSize+'px sans-serif';
    ctx.fillText(text, 750, 150 + (ctx.measureText(text).emHeightAscent / 2));

    let buffer = canvas.toBuffer('image/png');
    //fs.writeFileSync('img.png', buffer);
    return buffer;
}

genCanvasText(calculateChristmasCountdown(), '48')

const client = new djs.Client({ intents: [ djs.Intents.FLAGS.GUILDS, djs.Intents.FLAGS.GUILD_MESSAGES  ] });

client.once('ready', async () => {
    console.log('Online')
});

client.on('messageCreate', async (msg) => {
    if(msg.content === '!countdown' || msg.content === '!c'){
        let attachment = new djs.MessageAttachment(await genCanvasText(calculateChristmasCountdown(), '60'), 'countdown.png');
        let channel = client.channels.cache.get('838794212870193222');

        channel.send({ files: [ attachment ] });
    }
})

client.login(require('./config.json').TOKEN);
