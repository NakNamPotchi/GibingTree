const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

const gibWallet = "0x903095e8eff84b34f3e13f8ab9c9bc072fc58a76";
let donorWallet = "";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gift')
		.setDescription('gift an axie without hosting a contest')

		.addStringOption(option =>
			option.setName('axie-id')
				.setDescription('the axie to be given')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('winner')
				.setDescription('the user to give axie to')
				.setRequired(true))
			
		,
        
	async execute(interaction) {
		let replied = false;

		//verify user is registered
        axios.get("http://localhost:8080/api/wallets")
			.then((res)=>{
                const found = res.data.wallets.some(wallet => wallet.user == interaction.user.id);
                if(found) {
					donorWallet = res.data.wallets.find(wallet => wallet.user == interaction.user.id).address.replace('ronin:','0x')
                }
				else{
					interaction.reply(`you are not registered`);
					replied = true;
				}
                
				})
			.catch((err)=>{
				console.log(err);
				interaction.reply('failed to verify')
				replied = true})

        //verify axie was sent from user wallet
		//note: (!replied) is to protect from async race condition
		axios.get(`https://ronin.rest/archive/getTransferHistory/axie/${interaction.options.getString("axie-id")}`)
			.then((res)=>{

				//todo add check that res.data contains.transfers is not empty
                if (res.data.transfers[0].to == gibWallet && res.data.transfers[0].from == donorWallet){
					
					
					if (!replied) {
                        axios.post("http://localhost:8080/api/winner",{ "user":interaction.options.getUser("winner").id,"axieID":interaction.options.getString("axie-id")})
                            .then((res)=>{
                                console.log('winner record added to database')
                                const axieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${interaction.options.getString("axie-id")}/axie/axie-full-transparent.png`);
                                const winEmbed = new EmbedBuilder()
                                    .setDescription(`${interaction.options.getUser("winner")} won Axie #${interaction.options.getString("axie-id")}\n\nuse the /claim command for prize delivery!`)
                                    .setThumbnail('attachment://axie-full-transparent.png')
                                    .setColor(0xe5de00)
                                interaction.reply({content: `${interaction.options.getUser("winner")}`, embeds: [winEmbed], files: [axieImg] })})
                            .catch((err)=>{
                                console.log(err);
                                console.log('winner record not added to database')})
                                            }
                    }
				else {
					if (!replied) {interaction.reply('you are not authorized')}
				}
            })
			.catch((err)=>{
				console.log(err);
				if (!replied) {interaction.reply('failed to verify2')}
			})
	}
};
