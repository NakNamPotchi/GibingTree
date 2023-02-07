const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unregister')
		.setDescription('unregister a ronin address')
		.addUserOption(option =>
			option.setName('user')
			.setDescription('the user to be unregistered')
			.setRequired(true))
		,
	async execute(interaction) {
		const userObj = interaction.options.getUser('user');
		
		//only authorized for orca until collab-land
		if (interaction.user.id == '303432711446724609'){
			axios.delete(`http://localhost:8080/api/wallet/userID/${userObj.id}`)
			.then((res)=>{
				interaction.reply(`you have succesfully unregistered ${userObj}`)})
			.catch((err)=>{
				console.log(err);
				interaction.reply('failed to unregister')})
		}
		else{
			interaction.reply('only orca can unregister hosts')
		}
	},
};
