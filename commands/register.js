const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('register to host a gibaway')
		.addUserOption(option =>
			option.setName('user')
			.setDescription('the user to be registered')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('ronin-address')
			.setDescription('enter your ronin address')
			.setRequired(true)
			.setMinLength(46)
			.setMaxLength(46))
		,
	async execute(interaction) {
		const roninAddress = interaction.options.getString('ronin-address');
		const userObj = interaction.options.getUser('user');
		
		//only authorized for orca until collab-land
		if (interaction.user.id == '303432711446724609'){
			axios.post("http://localhost:8080/api/wallet",{ "user":userObj.id,"address":roninAddress})
			.then((res)=>{
				interaction.reply(`you have succesfully registered ${userObj}`)})
			.catch((err)=>{
				console.log(err);
				interaction.reply('failed to register')})
		}
		else{
			interaction.reply('only orca can register new event hosts')
		}
	},
};
