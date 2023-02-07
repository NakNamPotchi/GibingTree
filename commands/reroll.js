const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder  } = require('discord.js');
const axios = require("axios");
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

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reroll')
		.setDescription('take the high road')
		.addStringOption(option =>
			option.setName('axie-id')
			.setDescription('the axie to forfeit')
			.setRequired(true))
		,
	async execute(interaction) {
		const axieID = interaction.options.getString('axie-id');
		let auth = false;
        let recordID;

        //define function for deleting record
        const deleteWinner = async (recordID) => {
            axios.delete(`http://localhost:8080/api/winner/${recordID}`)
			.then((res)=>{
				interaction.reply(`reroll granted!`)
                editCrystals(interaction.user.id,3);
				const hostGCEmbed = new EmbedBuilder()
					.setDescription(`${interaction.user} received 🔮 3 GC! 🔮`)
					.setColor(0xe5de00)
				interaction.channel.send({ embeds: [hostGCEmbed] });
            })
			.catch((err)=>{
				console.log(err);
				interaction.reply('failed to reroll')})
        }
		//fetch winners
        axios.get(`http://localhost:8080/api/winners`)
        .then((res)=>{
            res.data.winners.forEach((winner)=>{
                if (winner.user == interaction.user.id && winner.axieID == axieID){
                    auth = true;
                    recordID = winner._id;
                    deleteWinner(recordID)
                }
            })
            if (!auth) {
                interaction.reply('not your axie')
            }
            
        })
        .catch((err)=>{
            interaction.reply('failed to find winners')
        })
	},
}
