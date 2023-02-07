const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

const timeout = 15000


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
//fisher-yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		
		if (message.author.id == 1035608517157068810 && message.embeds.length != 0 && 'title' in message.embeds[0].data && message.embeds[0].data.title.includes('GIBAWAY ALERT')){

			let gibType;
			let countDown;
			let axieID;
            let pepeDance = message.guild.emojis.cache.find((emoji)=>emoji.name=='PepoDanceLSv2')
            let pepeBonk = message.guild.emojis.cache.find((emoji)=>emoji.name=='peepoBonk')
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


            if (gibType == 'Find Out'){
                message.react('🍑');
                // message.react('🐶')
                // message.react('🐵')
                // message.react('💥')
                // message.react('🐩')
                // message.react('🦊')
                // message.react('😀')
                // message.react('😃')
                // message.react('😌')
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
                let remainingUsers = [];
                let masterList = [];
                let deadList = [];
				const filter = (reaction, user) => {
					return reaction.emoji.name === '🍑' && !user.bot;
				};
                
				const collector = message.createReactionCollector({ filter, time: countDownMS });
				
				collector.on('collect', (reaction, user) => {
                    if (!remainingUsers.includes(user)){
                        remainingUsers.push(user)
                        masterList.push(user)
                        console.log(`Collected ${reaction.emoji} from ${user.tag}`);
                    }
					
				});


                collector.on('end', (collected, reason) => {
					
                    //initial embed
                    let description = ' ';
                    let title = ``;
                    let pepeCount = 0;
                    let elimList = [];
                    remainingUsers.forEach((user)=>{
                        if (pepeCount <= 15){
                            title += `${pepeDance} `
                        }
                        
                        pepeCount++;
                    })
                    let mainEmbed;
					let initEmbed = new EmbedBuilder()
						.setTitle(`Everybody is fucking around!`)
                        .setFields(
                            { name: 'Look at them all fucking around', value: `${title}`}
                        )
						.setDescription(`${description}`)
						.setColor(0xe5de00)
                        .setFooter({text: `${remainingUsers.length} players left`})
					
                    message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [initEmbed] }).then((msg)=>{
                            mainEmbed = msg
                        })
					

                    async function elimBatch(){
                        let elimIndex = Math.floor(Math.random() * (remainingUsers.length))
                        let timeDelay = Math.floor(Math.random() * (5500 - 3000)+3000)
                        description += `${pepeBonk} ~~${remainingUsers[elimIndex]}~~ found out\n`
                        title = title.substring(0, title.length-38);
                        if (title.length == 0){
                            title = '💀';
                        }
                        deadList.push(remainingUsers[elimIndex])
                        remainingUsers.splice(elimIndex,1)
                        elimCount++;

                        //rebayb
                        if (deadList.length > 0 && Math.random() < 0.1){
                            let rebIndex = Math.floor(Math.random() * (deadList.length))
                            description += `${pepeDance} ${deadList[rebIndex]} is fucking around again\n`
                            title += `${pepeDance} `
                            remainingUsers.push(deadList[rebIndex])
                            deadList.splice(rebIndex,1)
                        }


                        let editEmbed = new EmbedBuilder()
                            .setTitle(`Everybody is fucking around!`)
                            .setFields(
                                { name: 'Look at them all fucking around', value: `${title}`}
                            )
                            .setDescription(`${description}`)
                            .setColor(0xe5de00)
                            .setFooter({text: `${remainingUsers.length} players left`})
                        
                        mainEmbed.edit({ embeds: [editEmbed] })
                        if (remainingUsers.length == 1){
                            const winner = remainingUsers[0];
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
                                .setDescription(`${winner} will find out later.... #${axieID}\n\nuse the /claim command for prize delivery!`)
                                .setThumbnail('attachment://axie-full-transparent.png')
                                .setColor(0xe5de00)
                            message.client.channels.cache.get(message.channel.id.toString()).send({ content: `${winner}`, embeds: [winEmbed], files: [axieImg] });
                            console.log(`winner is ${winner}`)
                        }
                        else if (elimCount <= 15){
                            setTimeout(elimBatch,timeDelay)
                        }
                        else{
                            description = ' '
                            title = ``
                            let pepeCount = 0;
                            remainingUsers.forEach((user)=>{
                                if (pepeCount <= 15){
                                    title += `${pepeDance} `
                                }
                                
                                pepeCount++;
                            })
                            initEmbed = new EmbedBuilder()
                                .setTitle(`Everybody is fucking around!`)
                                .setFields(
                                    { name: 'Look at them all fucking around', value: `${title}`}
                                )
                                .setDescription(`${description}`)
                                .setColor(0xe5de00)
                                .setFooter({text: `${remainingUsers.length} players left`})
                            
                            message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [initEmbed] }).then((msg)=>{
                                    mainEmbed = msg
                                    elimCount = 0;
                                    setTimeout(elimBatch,3000)
                                })
                        }
                    }

                    let elimCount = 0
                    setTimeout(elimBatch,3000)
                });
			}
		}
	},
};


