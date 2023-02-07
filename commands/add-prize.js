const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-prize')
		.setDescription('add prize to shop')
		.addStringOption(option =>
			option.setName('axie-id')
			.setDescription('the prize axie')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('cost')
			.setDescription('how many crystals')
			.setRequired(true))
		,
	async execute(interaction) {
		const axieID = interaction.options.getString('axie-id');
		const cost = interaction.options.getString('cost');
		
		//only authorized for orca until collab-land
		if (interaction.user.id == '303432711446724609'){
			axios.post("http://localhost:8080/api/shop",{ "axieID":axieID,"cost":cost})
			.then((res)=>{
				interaction.reply(`axie ${axieID} added to shop for ${cost} crystals`)})
			.catch((err)=>{
				console.log(err);
				interaction.reply('failed to add prize')})
		}
		else{
			interaction.reply('admin only')
		}
	},
};