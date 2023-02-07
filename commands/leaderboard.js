const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('view win leaders')
		,
	async execute(interaction) {
		
		
		axios.get("http://localhost:8080/api/leaders")
			.then((res)=>{
                
                const leaders = res.data.leaders;
                leaders.sort((a,b) => parseInt(b.wins) - parseInt(a.wins)); 

                let leaderString = "";
                let count = 0;
                leaders.forEach((leader)=>{
                    count++
                    if (count < 10){
                        leaderString+=`${leader.wins} ${leader.username}\n\n`
                    }
                })
                const leaderEmbed = new EmbedBuilder()
                    .setTitle('Win Leaders!')
                    .setDescription(`${leaderString}`)
                    .setColor(0xe5de00)
                interaction.reply({ embeds: [leaderEmbed]})
				})
			.catch((err)=>{
				console.log(err);
				interaction.reply('failed to show leaderbard')})
		
	},
};