const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('view axie shop')
		,
	async execute(interaction) {
		
		
		axios.get("http://localhost:8080/api/shop")
			.then((res)=>{
                const welcomeEmbed = new EmbedBuilder()
                    .setDescription('Enjoy the shop!')
                    .setColor(0xe5de00)
                interaction.reply({ embeds: [welcomeEmbed]})
                const shopItems = res.data.shops;
                shopItems.forEach((item)=>{
                    const axieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${item.axieID}/axie/axie-full-transparent.png`);
					const shopEmbed = new EmbedBuilder()
								.setDescription(`Buy Me!`)
								.setColor(0xe5de00)
								.setFields(
									{ name: 'Cost', value: `${item.cost}`, inline: true},
									{ name: 'Axie ID', value: `${item.axieID}`, inline: true},
								)
								.setThumbnail('attachment://axie-full-transparent.png')
                                .setFooter({'text':'use /purchase to buy'})
							interaction.channel.send({ embeds: [shopEmbed], files: [axieImg] })
                    })
				})
			.catch((err)=>{
				console.log(err);
				interaction.reply('failed to show shop')})
		
	},
};