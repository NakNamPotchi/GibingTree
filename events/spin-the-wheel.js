const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

const timeout = 15000

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
            let countDownMS = 0;
            if (countDown == '1 minute') { countDownMS = 60000}
            else if (countDown == '2 minutes') { countDownMS = 120000}
            else if (countDown == '3 minutes') { countDownMS = 180000}
            else if (countDown == '5 minutes') { countDownMS = 300000}
            else if (countDown == '10 minutes') { countDownMS = 600000}
            else if (countDown == '10 seconds') { countDownMS = 5000}


            if (gibType == 'Spin the Wheel'){
                message.react('🍑');
                let remainingUsers = [];
				const filter = (reaction, user) => {
					return reaction.emoji.name === '🍑' && !user.bot;
				};
                
				const collector = message.createReactionCollector({ filter, time: countDownMS });
				
				collector.on('collect', (reaction, user) => {
                    if (!remainingUsers.includes(user)){
                        remainingUsers.push(user)
                        console.log(`Collected ${reaction.emoji} from ${user.tag}`);
                    }
					
				});


                collector.on('end', (collected, reason) => {
					//console.log("collection ended", collected);
                    //player cap
                    // while (remainingUsers.length > 25){
                    //     remainingUsers.pop()
                    // }
                    let round = 0;
                    let finished = false;
                    let mainEmbed;
                    let spinCount = 0;
                    let stopped = true;
                    
                    let pointer = message.guild.emojis.cache.find((emoji)=>emoji.name=='HahaYou')
                    const sendLoser = async (loser) => {
                        let crystalMsg = "";
                        if (round == 1){
                            editCrystals(loser.id,3);
                            crystalMsg = "First Blood!\n 🔮 +3 GC 🔮";
                        }
                        else if (Math.random() > .8){
                            editCrystals(loser.id,1);
                            crystalMsg = "Lucky?\n 🔮 +1 GC 🔮";
                        }
                        const loseEmbed = new EmbedBuilder()
                            .setDescription(`${loser} is out!\n\n${crystalMsg}`)
                            .setColor(0xe5de00)
                        message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [loseEmbed] })
                    }
                    const sendWinner = async (winner) => {
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
                            .setDescription(`${winner} won Axie ${axieID}\n\nuse the /claim command for prize delivery!`)
                            .setThumbnail('attachment://axie-full-transparent.png')
                            .setColor(0xe5de00)
                        message.client.channels.cache.get(message.channel.id.toString()).send({ content: `${winner}`, embeds: [winEmbed], files: [axieImg] });
                    }

                    const nextRound = async () => {
                        shuffle(remainingUsers)
                        const editEmbed = async () => {
                            
                            spinCount++;
                            remainingUsers.push(remainingUsers.shift());
                            let wheelString = "";
                            let tempCount = 0;
                            let maxIndex = 0;
                            if (remainingUsers.length > 15){
                                maxIndex = 15
                            }
                            else{
                                maxIndex = remainingUsers.length
                            }
                            wheelString += `💎\n`
                            remainingUsers.forEach((user) => {
                                tempCount++;
                                //only show top 15
                                if (tempCount <= 15){

                                    //if more than 12 people, elim 3
                                    if (remainingUsers.length > 12){
                                        if (maxIndex%2 == 0){
                                            if (tempCount == maxIndex/2 - 2 || tempCount == maxIndex/2 || tempCount == maxIndex/2 + 2){
                                                wheelString+=`${pointer}${user}\n`
                                            }
                                            else{
                                                wheelString+=`💎${user}\n`
                                            }
                                        }
                                        else{
                                            if (tempCount == maxIndex/2 - 1.5 || tempCount == maxIndex/2 + 0.5 || tempCount == maxIndex/2 + 2.5){
                                                wheelString+=`${pointer}${user}\n`
                                            }
                                            else{
                                                wheelString+=`💎${user}\n`
                                            }
                                        }
                                    }
                                    //one elim
                                    else{
                                        if (maxIndex%2 == 0){
                                            if (tempCount == maxIndex/2){
                                                wheelString+=`${pointer}${user}\n`
                                            }
                                            else{
                                                wheelString+=`💎${user}\n`
                                            }
                                        }
                                        else{
                                            if (tempCount == maxIndex/2 + 0.5){
                                                wheelString+=`${pointer}${user}\n`
                                            }
                                            else{
                                                wheelString+=`💎${user}\n`
                                            }
                                        }
                                    }
                                }
                                
                                
                            })
                            wheelString += `💎\n`
                            //console.log('wheel',wheelString)
                            const spinEmbed = new EmbedBuilder()
                                .setTitle(`Round ${round}`)
                                .setColor(0xe5de00)
                                .setFields(
                                    { name: 'Dont get picked!', value: `${wheelString}`}
                                )
                            mainEmbed.edit({ embeds: [spinEmbed] });
                            rndOffset = Math.floor(Math.random() * (2 - 0 + 1) + 0);
                            let editCountdown;
                            if (spinCount < 3 + rndOffset) {
                                editCountdown = 1000
                            }
                            else if (spinCount < 4 + rndOffset) {
                                editCountdown = 1100
                            }
                            else if (spinCount < 5 + rndOffset) {
                                editCountdown = 1200
                            }
                            else if (spinCount < 6 + rndOffset) {
                                editCountdown = 1500
                            }
                            else if (spinCount < 8 + rndOffset) {
                                editCountdown = 2000
                            }
                            else if (Math.random() < .5) {
                                editCountdown = 3000
                            }
                            else {
                                stopped = true
                                spinCount = 0
                                let index;
                                maxIndex%2 == 0 ?
                                    index = maxIndex/2 - 1
                                    :
                                    index = maxIndex/2 + 0.5 - 1
                                //console.log('remain',remainingUsers)
                                //console.log('index',index)
                                //console.log('loser',remainingUsers[index])
                                //elim 3
                                if (remainingUsers.length > 12){
                                    const thisLoser1 = remainingUsers[index-2];
                                    const thisLoser2 = remainingUsers[index];
                                    const thisLoser3 = remainingUsers[index+2];
                                    setTimeout(()=>{sendLoser(thisLoser1)},1500);
                                    setTimeout(()=>{sendLoser(thisLoser2)},2000);
                                    setTimeout(()=>{sendLoser(thisLoser3)},2500);
                                    //message.client.channels.cache.get(message.channel.id.toString()).send(`${remainingUsers[index]} is out!`)
                                    remainingUsers.splice(index+2, 1);
                                    remainingUsers.splice(index, 1);
                                    remainingUsers.splice(index-2, 1);
                                }
                                //elim 1
                                else{
                                    const thisLoser = remainingUsers[index]
                                    setTimeout(()=>{sendLoser(thisLoser)},2000)
                                    //message.client.channels.cache.get(message.channel.id.toString()).send(`${remainingUsers[index]} is out!`)
                                    remainingUsers.splice(index, 1)
                                }
                                
                            }
                            if (remainingUsers.length == 1){
                                
                                setTimeout(()=>{sendWinner(remainingUsers[0])},6000)
                                //message.client.channels.cache.get(message.channel.id.toString()).send(`${remainingUsers[0]} wins`)
                            }
                            else if (stopped){
                                setTimeout(nextRound, 5000);
                            }
                            else{
                                setTimeout(editEmbed, editCountdown);
                            }
                        }
                        
                        round+=1
                        let wheelString = "";
                        let tempCount = 0;
                        wheelString += `💎\n`
                        let maxIndex = 0;
                        if (remainingUsers.length > 15){
                            maxIndex = 15
                        }
                        else{
                            maxIndex = remainingUsers.length
                        }
                        remainingUsers.forEach((user) => {
                            tempCount++;
                            if (tempCount <= 15){
                                //elim 3
                                if (remainingUsers.length > 12){
                                    if (maxIndex%2 == 0){
                                        if (tempCount == maxIndex/2 - 2 || tempCount == maxIndex/2 || tempCount == maxIndex/2 + 2){
                                            wheelString+=`${pointer}${user}\n`
                                        }
                                        else{
                                            wheelString+=`💎${user}\n`
                                        }
                                    }
                                    else{
                                        if (tempCount == maxIndex/2 - 1.5 || tempCount == maxIndex/2 + 0.5 || tempCount == maxIndex/2 + 2.5){
                                            wheelString+=`${pointer}${user}\n`
                                        }
                                        else{
                                            wheelString+=`💎${user}\n`
                                        }
                                    }   
                                }
                                // elim 1
                                else{
                                    if (maxIndex%2 == 0){
                                        if (tempCount == maxIndex/2){
                                            wheelString+=`${pointer}${user}\n`
                                        }
                                        else{
                                            wheelString+=`💎${user}\n`
                                        }
                                    }
                                    else{
                                        if (tempCount == maxIndex/2 + 0.5){
                                            wheelString+=`${pointer}${user}\n`
                                        }
                                        else{
                                            wheelString+=`💎${user}\n`
                                        }
                                    }   
                                }
                                
                            }
                        })
                        wheelString += `💎\n`

                        const wheelEmbed = new EmbedBuilder()
                            .setTitle(`Round ${round}`)
                            .setColor(0xe5de00)
                            .setFields(
                                { name: 'Dont get picked!', value: `${wheelString}`}
                            )
                        
                        message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [wheelEmbed] }).then((msg)=>{
                            mainEmbed = msg
                            stopped = false;
                            setTimeout(editEmbed, 1000);
                        })
                    }
                    
                    setTimeout(nextRound, 1000);
                    
                });
			}
		}
	},
};


