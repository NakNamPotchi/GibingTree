const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('check Gibbing Crystal balance')
	,
	async execute(interaction) {
	
            axios.get(`http://localhost:8080/api/crystal/userID/${interaction.user.id}`)
                .then((res)=>{
                    console.log(res.data.result)
                    if (res.data.result == null){
                        interaction.reply('you have 0 Gibbing Crystals')
                    }
                    else{
                        interaction.reply(`you have ${res.data.result.balance} Gibbing Crystals`)
                    }
                })
        }
	
};
