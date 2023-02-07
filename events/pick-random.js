const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");
const users = [];


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

			if (gibType == 'Pick Random'){
				message.react('🍑');
                let countDownMS = 0;
                if (countDown == '1 minute') { countDownMS = 60000}
                else if (countDown == '2 minutes') { countDownMS = 120000}
                else if (countDown == '3 minutes') { countDownMS = 180000}
                else if (countDown == '5 minutes') { countDownMS = 300000}
                else if (countDown == '10 minutes') { countDownMS = 600000}

				const filter = (reaction, user) => {
					return reaction.emoji.name === '🍑' && !user.bot;
				};
				
				const collector = message.createReactionCollector({ filter, time: countDownMS });
				
				collector.on('collect', (reaction, user) => {
					users.push(user)
					console.log(`Collected ${reaction.emoji} from ${user.tag}`);
				});
				
				collector.on('end', collected => {
					console.log("collection ended");
					const winner = users[Math.floor(Math.random()*users.length)];

					//add winner record to db
					axios.post("http://localhost:8080/api/winner",{ "user":winner.id,"axieID":axieID})
						.then((res)=>{
							console.log('winner record added to database')})
						.catch((err)=>{
							console.log(err);
							console.log('winner record not added to database')})
					
					const axieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${axieID}/axie/axie-full-transparent.png`);
					const hostEmbed = new EmbedBuilder()
						.setThumbnail('attachment://axie-full-transparent.png');
					message.reply({ content: `${winner} won Axie #${axieID}\n\n use the /claim command for prize delivery!`, embeds: [hostEmbed], files: [axieImg] });
				});
			}
		}
	},
};


