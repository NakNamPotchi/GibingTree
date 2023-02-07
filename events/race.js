const { Events, AttachmentBuilder, EmbedBuilder, User } = require('discord.js');
const axios = require("axios");
const e = require('cors');
let users = [];
let mainEmbed;
let pepeSimp;
//fisher-yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
const editCrystals = async (crystalUserID, crystals) => {
    //check if user exists
    axios.get(`http://localhost:8080/api/crystal/userID/${crystalUserID}`)
        .then((res)=>{
            console.log(res.data.result)
            if (res.data.result == null){
                //add new record
                axios.post("http://localhost:8080/api/crystal",{ "user":crystalUserID,"balance":crystals})
                    .then((res2)=>{
                        console.log('crystal record added to database')})
                    .catch((err2)=>{
                        //console.log(err2);
                        console.log('crystal record not added to database')})
            }
            else{
                //edit record
                axios.put(`http://localhost:8080/api/crystals/${res.data.result._id}`,{ "balance":String(parseInt(res.data.result.balance) + crystals)})
                    .then((res3)=>{
                        console.log('crystal record edited')})
                    .catch((err3)=>{
                        //console.log(err3);
                        console.log('crystal record not edited')})
            }
        })
}
const editLeaders = async (leaderUser) => {
    //check if user exists
    axios.get(`http://localhost:8080/api/leader/userID/${leaderUser.id}`)
        .then((res)=>{
            console.log(res.data.result)
            if (res.data.result == null){
                //add new record
                axios.post("http://localhost:8080/api/leader",{ "userID":leaderUser.id,"username":leaderUser.username,"wins":1})
                    .then((res2)=>{
                        console.log('leader record added to database')})
                    .catch((err2)=>{
                        //console.log(err2);
                        console.log('leader record not added to database')})
            }
            else{
                //edit record
                axios.put(`http://localhost:8080/api/leaders/${res.data.result._id}`,{ "wins":String(parseInt(res.data.result.wins) + 1)})
                    .then((res3)=>{
                        console.log('leader record edited')})
                    .catch((err3)=>{
                        //console.log(err3);
                        console.log('leader record not edited')})
            }
        })
}
const cycleSideline = (prevSide) => {
    if (prevSide == `⛩️⛩️${pepeSimp}⛩️⛩️${pepeSimp}⛩️⛩️⛩️⛩️⛩️⛩️\n`){
        return `⛩️${pepeSimp}⛩️⛩️${pepeSimp}⛩️⛩️⛩️⛩️⛩️⛩️⛩️\n`
    }
    else if (prevSide == `⛩️${pepeSimp}⛩️⛩️${pepeSimp}⛩️⛩️⛩️⛩️⛩️⛩️⛩️\n`){
        return `${pepeSimp}⛩️⛩️${pepeSimp}⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️\n`
    }
    else if (prevSide == `${pepeSimp}⛩️⛩️${pepeSimp}⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️\n`){
        return `⛩️⛩️${pepeSimp}⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️\n`
    }
    else if (prevSide == `⛩️⛩️${pepeSimp}⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️\n`){
        return `⛩️${pepeSimp}⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️\n`
    }
    else if (prevSide == `⛩️${pepeSimp}⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️\n`){
        return `${pepeSimp}⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️\n`
    }
    else {
        return `⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️⛩️\n`
    }
}
module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		
		if (message.author.id == 1035608517157068810 && message.embeds.length != 0 && 'title' in message.embeds[0].data && message.embeds[0].data.title.includes('GIBAWAY ALERT')){

			let gibType;
			let countDown;
			let axieID;
			message.embeds[0].data.fields.forEach((field) => {
				if (field.name == 'Gib Type') {gibType = field.value}
				else if (field.name == 'Countdown') {countDown = field.value}
				else if (field.name == 'Axie ID') {axieID = field.value}
			})

			if (gibType == 'Emoji Race'){
                // message.react('🐶')
                // message.react('🐵')
                // message.react('💥')
                // message.react('🐩')
                // message.react('🦊')
                // message.react('😀')
                // message.react('😃')
                // message.react('😌')
                // message.react('🥵')
                // message.react('🥶')
                // message.react('😱')
                // message.react('😨')
                // message.react('😡')
                // message.react('🤓')
                // message.react('🤩')
                // message.react('🥳')
                // message.react('😔')
                // message.react('😜')
                // message.react('🤮')
                // message.react('😰')

                collectedUsers=[];
                users=[];
                pepeSimp = message.guild.emojis.cache.find((emoji)=>emoji.name=='PEPE_Simp')
                let sideline = `⛩️⛩️${pepeSimp}⛩️⛩️${pepeSimp}⛩️⛩️⛩️⛩️⛩️⛩️\n`
                let countDownMS = 0;
                let totalUsers = 0;
                let finished = false;
                if (countDown == '1 minute') { countDownMS = 60000}
                else if (countDown == '2 minutes') { countDownMS = 120000}
                else if (countDown == '3 minutes') { countDownMS = 180000}
                else if (countDown == '5 minutes') { countDownMS = 300000}
                else if (countDown == '10 minutes') { countDownMS = 600000}
                else if (countDown == '10 seconds') { countDownMS = 10000}

				const filter = (reaction, user) => {
                    totalUsers+=1
					return true
				};
				
				const collector = message.createReactionCollector({ filter, time: countDownMS });
				
				collector.on('collect', (reaction, user) => {
					collectedUsers.push({"user":user,"pos":0,"previousStep":2,"deathCount":0,"boostCount":0,"status":"normal","emoji":reaction.emoji})
					console.log(`Collected ${reaction.emoji} from ${user.tag}`);
				});
				
				collector.on('end', collected => {

					console.log("collection ended");

                    //users = collectedUsers //- for testing no filter
                    //filter unique users
                    let uniqueUsers = []
                    users = collectedUsers.filter(element => {
                        const isDuplicate = uniqueUsers.includes(element.user);
                        if (!isDuplicate) {
                            uniqueUsers.push(element.user);
                            return true;
                        }
                        return false;
                    });

                    //player cap
                    while (users.length > 20){
                        users.pop()
                    }

                    function randomBM(mean) {
                        let u = 1 - Math.random(); //Converting [0,1) to (0,1)
                        let v = Math.random();
                        return Math.round(mean + Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v ));
                    }
                    let standings = [];
                    async function runRace() {
                        
                        if (!finished){
                            const steps = users.map(user => {return user.pos;});
                            const max = Math.max(...steps);
                            const min = Math.min(...steps);
                            let eventMessages = "";
                            console.log(1)
                            users.forEach((user) => {
                                if (user.pos > 100){
                                    let thisStep;
                                    const deathSeed = Math.random();
                                    const boostSeed = Math.random();
                                    if (user.deathCount > 0){
                                        if (user.deathCount >= 6){
                                            user.deathCount = 0
                                            user.status = "normal"
                                        }
                                        else{
                                            user.deathCount += 1;
                                            eventMessages += `${user.user} ${user.emoji} got rekt \n`
                                        }
                                        thisStep = 0
                                    }
                                    else if (max - user.pos < 5 && deathSeed < .05){
                                        thisStep = 0
                                        user.deathCount += 1;
                                        user.boostCount = 0;
                                        eventMessages += `${user.user} ${user.emoji} got rekt \n`
                                        user.status = "rekt"
                                    }
                                    else if (max - user.pos < 30 && deathSeed < .02){
                                        thisStep = 0
                                        user.deathCount += 1;
                                        user.boostCount = 0;
                                        eventMessages += `${user.user} ${user.emoji} got rekt \n`
                                        user.status = "rekt"
                                    }
                                    else if (max - user.pos < 50 && deathSeed < .01){
                                        thisStep = 0
                                        user.deathCount += 1;
                                        user.boostCount = 0;
                                        eventMessages += `${user.user} ${user.emoji} got rekt \n`
                                        user.status = "rekt"
                                    }
                                    //hit stride/ fatigue
                                    else{
                                        thisStep = randomBM(user.previousStep)
                                        if (thisStep > 12){thisStep = 12}
                                        if (thisStep < 3){thisStep = 3}
                                        if (user.boostCount > 0){
                                            if (user.boostCount >= 10){
                                                user.boostCount = 0
                                                user.status = "normal"
                                            }
                                            else{
                                                user.boostCount += 1;
                                                eventMessages += `${user.user} ${user.emoji} is boosting \n`
                                            }
                                            thisStep += 10
                                        }
                                        
                                        else if (user.pos - min < 10 && boostSeed < .08){
                                            thisStep += 10
                                            user.boostCount += 1;
                                            eventMessages += `${user.user} ${user.emoji} is boosting \n`
                                            user.status = "boost"
                                        }
                                        else if (user.pos - min < 50 && boostSeed< .04){
                                            thisStep += 10
                                            user.boostCount += 1;
                                            eventMessages += `${user.user} ${user.emoji} is boosting \n`
                                            user.status = "boost"
                                        }
                                        else if (max != user.pos && boostSeed< .02){
                                            thisStep += 10
                                            user.boostCount += 1;
                                            eventMessages += `${user.user} ${user.emoji} is boosting \n`
                                            user.status = "boost"
                                        }
                                    }
                                    user.pos += thisStep
                                    user.previousStep = thisStep
                                }
                                else if (user.pos > 50){
                                    //hit sprint
                                    let thisStep = randomBM(user.previousStep)
                                    if (thisStep > 9){thisStep = 9}
                                    if (thisStep < 6){thisStep = 6}
                                    user.pos += thisStep
                                    user.previousStep = thisStep
                                }
                                else if (user.pos > 20){
                                    //high variance - make it or break it
                                    let thisStep = randomBM(user.previousStep)
                                    if (thisStep > 6){thisStep = 6}
                                    if (thisStep < 3){thisStep = 3}
                                    user.pos += thisStep
                                    user.previousStep = thisStep
                                }
                                else if (user.pos > 10){
                                    //ramp up
                                    let thisStep = randomBM(user.previousStep)
                                    if (thisStep > 5){thisStep = 5}
                                    if (thisStep < 1){thisStep = 1}
                                    user.pos += thisStep
                                    user.previousStep = thisStep
                                }
                                else if (user.pos > 4){
                                    //SUPER SMOOTH
                                    let thisStep = randomBM(user.previousStep)
                                    
                                    if (thisStep > 3){thisStep = 3}
                                    if (thisStep < 1){thisStep = 1}
                                    user.pos += thisStep
                                    user.previousStep = thisStep
                                }
                                else{
                                    //smooth start
                                    let thisStep = randomBM(user.previousStep)
                                    
                                    if (thisStep > 4){thisStep = 4}
                                    if (thisStep < 1){thisStep = 1}
                                    user.pos += thisStep
                                    user.previousStep = thisStep
                                }
                                
                                if (user.pos >= 1500){
                                    finished = true;
                                    winner = user.user;
                                }
                                
                            })

                            console.log(2)
                            let stationary;
                            let topRacers;
                            let liveView;
                            let sortedUsers;
                            let liveEmbed;
                            let range;
                            let displayedUsers;
                            if (users.length > 15){
                                displayedUsers = 15
                            }
                            else{
                                displayedUsers = users.length
                            }
                            sortedUsers = [...users]
                                sortedUsers.sort((a,b)=>{
                                    if (a.pos > b.pos) {
                                        return -1;
                                    }
                                })
                            usersCopy = [...users]
                            topRacers = usersCopy.filter((user)=>{return user.pos >= sortedUsers[displayedUsers-1].pos})
                            
                            while (topRacers.length > 15){
                                let stop = false
                                let index = 0;
                                while (!stop){
                                    if (topRacers[index].pos <= sortedUsers[14].pos){
                                        topRacers.splice(index,1)
                                        stop = true
                                    }
                                    index +=1
                                }
                            }
                            console.log(3)
                            //have we gone 40 steps yet?
                            if (max > 40){
                                sideline = cycleSideline(sideline);
                                liveEmbed = sideline
                                range = sortedUsers[0].pos - sortedUsers[displayedUsers-1].pos;
                                stationary = false
                                liveView = `Top ${displayedUsers}`
                                
                                
                                topRacers.forEach((current)=>{
                                    let spaces = 50 - (((sortedUsers[0].pos - current.pos)/range) * 45);
                                    let i = 0;
                                    while (i<spaces){
                                        liveEmbed += ".";
                                        i++;
                                    }
                                    if (current.status == "rekt"){
                                        liveEmbed+=`☠️ \n`;
                                    }
                                    else if (current.status == "boost"){
                                        liveEmbed+=`🌟 \n`;
                                    }
                                    else{
                                        liveEmbed+=`${current.emoji} \n`;
                                    }
                                })
                            }
                            else{
                                stationary = true
                                liveView = "Start"
                                liveEmbed = sideline
                                topRacers.forEach((current)=>{
                                    let spaces = current.pos
                                    let i = 0;
                                    while (i<spaces){
                                        liveEmbed += ".";
                                        i++;
                                    }
                                    liveEmbed+=`${current.emoji} \n`;
                                })
                            }
                            console.log(4)
                            liveEmbed +=  sideline
                            let progress;
                            if (max > 40){
                                progress = sortedUsers[0].pos/15;
                            }
                            else {
                                progress = users[0].pos/15;
                            }
                            if (eventMessages.length == 0){
                                eventMessages = "None"
                            }
                            
                            
                            progress = Math.round(progress * 100) / 100
                            if (progress>=1500){progress = 100}
                            const editEmbed = new EmbedBuilder()
                                .setTitle(`GO!   Progress = ${progress}%`)
                                .setColor(0xe5de00)
                                .setFields(
                                    { name: `${liveView}`, value: `${liveEmbed}`},
                                    { name: 'Events', value: `${eventMessages}`}
                                )
                                
                            mainEmbed.edit({ embeds: [editEmbed] })
                            standings = [...sortedUsers];
                            setTimeout(runRace, 1200);
                        }
                        else{
                            editLeaders(winner);
                            //add winner record to db
                            axios.post("http://localhost:8080/api/winner",{ "user":winner.id,"axieID":axieID})
                            .then((res)=>{
                                console.log('winner record added to database')})
                            .catch((err)=>{
                                console.log(err);
                                console.log('winner record not added to database')})
                            const axieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${axieID}/axie/axie-full-transparent.png`);
                            const winEmbed = new EmbedBuilder()
                                .setDescription(`${winner} won Axie #${axieID}\n\nuse the /claim command for prize delivery!`)
                                .setThumbnail('attachment://axie-full-transparent.png')
                                .setColor(0xe5de00)
                            message.client.channels.cache.get(message.channel.id.toString()).send({ content: `${winner}`, embeds: [winEmbed], files: [axieImg] });
                            console.log(`winner is ${winner}`)
                            
                            console.log(standings)
                            secondPlace = standings[1]
                            thirdPlace = standings[2]
                            fourthPlace = standings[3]
                            lastPlace = standings[standings.length-1]
                            editCrystals(secondPlace.user.id,3)
                            editCrystals(thirdPlace.user.id,2)
                            editCrystals(fourthPlace.user.id,1)
                            editCrystals(lastPlace.user.id,5)
                            const gcEmbed = new EmbedBuilder()
                                .setDescription(
                                    `🔮 Second Place ${secondPlace.user} gets +3 GC\n
                                    🔮 Third Place ${thirdPlace.user} gets +2 GC\n
                                    🔮 Fourth Place ${fourthPlace.user} gets +1 GC\n
                                    🔮 Last Place ${lastPlace.user} gets +5 GC\n`
                                )
                                .setColor(0xe5de00)
                            message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [gcEmbed] });

                        }
                    }

                    if (users.length >= 5){
                        
                        //init game
                        
                        
                        const initEmbed = new EmbedBuilder()
                            .setTitle('On Your Marks, Get Set')
                            .setColor(0xe5de00)
                            
                        
                        message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [initEmbed] }).then((msg)=>{
                            mainEmbed = msg
                        })
                        setTimeout(runRace, 3000);
                        
                    }
                    else {message.reply('not enough entries')}
                    
				});
			}
		}
	},
};


