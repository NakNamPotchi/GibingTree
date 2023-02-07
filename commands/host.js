const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

const gibWallet = "0x903095e8eff84b34f3e13f8ab9c9bc072fc58a76";
let donorWallet = "";

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
		.setName('host')
		.setDescription('host a gibaway')
		.addSubcommand((subcommand) => 
			subcommand
				.setName('deathmatch')
				.setDescription('survive or rebayb')
				.addStringOption(option =>
					option.setName('axie-id')
						.setDescription('the axie to be given')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('countdown')
					.setDescription('how long to wait before start')
					.setRequired(true)
					.addChoices(
						{ name: '1 minute', value: '1 minute' },
						{ name: '2 minutes', value: '2 minutes' },
						{ name: '3 minutes', value: '3 minutes' },
						{ name: '5 minutes', value: '5 minutes' },
						{ name: '10 minutes', value: '10 minutes' },
						{ name: 'test', value: '10 seconds' },
						)
					)
		)
		.addSubcommand((subcommand) => 
			subcommand
				.setName('emoji-race')
				.setDescription("orca's shitty horse race")
				.addStringOption(option =>
					option.setName('axie-id')
						.setDescription('the axie to be given')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('countdown')
					.setDescription('how long to wait before start')
					.setRequired(true)
					.addChoices(
						{ name: '1 minute', value: '1 minute' },
						{ name: '2 minutes', value: '2 minutes' },
						{ name: '3 minutes', value: '3 minutes' },
						{ name: '5 minutes', value: '5 minutes' },
						{ name: '10 minutes', value: '10 minutes' },
						{ name: 'test', value: '10 seconds' },
						)
					)
		)
		.addSubcommand((subcommand) => 
			subcommand
				.setName('find-out')
				.setDescription("fuck around and find out")
				.addStringOption(option =>
					option.setName('axie-id')
						.setDescription('the axie to be given')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('countdown')
					.setDescription('how long to wait before start')
					.setRequired(true)
					.addChoices(
						{ name: '1 minute', value: '1 minute' },
						{ name: '2 minutes', value: '2 minutes' },
						{ name: '3 minutes', value: '3 minutes' },
						{ name: '5 minutes', value: '5 minutes' },
						{ name: '10 minutes', value: '10 minutes' },
						{ name: 'test', value: '10 seconds' },
						)
					)
		)
		.addSubcommand((subcommand) => 
			subcommand
				.setName('guess-the-phrase')
				.setDescription('guess the phrase to win')
				.addStringOption(option =>
					option.setName('axie-id')
						.setDescription('the axie to be given')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('countdown')
					.setDescription('how long to wait before start')
					.setRequired(true)
					.addChoices(
						{ name: '1 minute', value: '1 minute' },
						{ name: '2 minutes', value: '2 minutes' },
						{ name: '3 minutes', value: '3 minutes' },
						{ name: '5 minutes', value: '5 minutes' },
						{ name: '10 minutes', value: '10 minutes' },
						{ name: 'test', value: '10 seconds' },
						)
					)
				
		)
		.addSubcommand((subcommand) => 
			subcommand
				.setName('trivia')
				.setDescription('trivia gibaway')
				.addStringOption(option =>
					option.setName('axie-id')
						.setDescription('the axie to be given')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('countdown')
					.setDescription('how long to wait before start')
					.setRequired(true)
					.addChoices(
						{ name: '1 minute', value: '1 minute' },
						{ name: '2 minutes', value: '2 minutes' },
						{ name: '3 minutes', value: '3 minutes' },
						{ name: '5 minutes', value: '5 minutes' },
						{ name: '10 minutes', value: '10 minutes' },
						{ name: 'test', value: '10 seconds' },
						)
					)
				
		)
		.addSubcommand((subcommand) => 
			subcommand
				.setName('spin-the-wheel')
				.setDescription('spin a wheel to eliminate losers')
				.addStringOption(option =>
					option.setName('axie-id')
						.setDescription('the axie to be given')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('countdown')
					.setDescription('how long to wait before start')
					.setRequired(true)
					.addChoices(
						{ name: '1 minute', value: '1 minute' },
						{ name: '2 minutes', value: '2 minutes' },
						{ name: '3 minutes', value: '3 minutes' },
						{ name: '5 minutes', value: '5 minutes' },
						{ name: '10 minutes', value: '10 minutes' },
						{ name: 'test', value: '10 seconds' },
						)
					)
				
		),
		
	async execute(interaction) {
		//console.log(interaction.options.getSubcommand)
		let replied = false;

		

		//crystal-mode games
		if (interaction.options.getString('axie-id') == 'crystals'){
			const hasRole = interaction.member.roles.cache.some(r => r.name === "Core")
			if (hasRole){
					if (interaction.options.getSubcommand() == 'guess-the-phrase'){
						//check timestamp
						axios.get("http://localhost:8080/api/timestamp/game/guess-the-phrase")
							.then((res)=>{
								//todo : if timestamp is permissible
								console.log(res.data.result.time)
								const currentTime = Math.floor(Date.now() / 1000)
								console.log(currentTime)
								//3 min passed
								if ( currentTime - parseInt(res.data.result.time) > 3600){

									//post embed
									let gibType = 'Guess the Phrase';
									let footer = {text: "type 'solve your-guess-here' in chat"};
									let description = "🔮 🔮 🔮 🔮 🔮 🔮 🔮 🔮 🔮\nThis game awards CRYSTALS\n🔮 🔮 🔮 🔮 🔮 🔮 🔮 🔮 🔮\n\ngl"
									const hostEmbed = new EmbedBuilder()
										.setTitle(`🚨 GIBAWAY ALERT 🚨`)
										.setDescription(`${description}`)
										.setColor(0xe5de00)
										.setFields(
											{ name: 'Gib Type', value: `${gibType}`, inline: true},
											{ name: 'Axie ID', value: `${interaction.options.getString("axie-id")}`, inline: true},
											{ name: 'Countdown', value: `${interaction.options.getString('countdown')}`, inline: true},
										)
										.setFooter(footer)
									
									if (!replied){interaction.reply({ embeds: [hostEmbed] });}
									replied = true;
								}
								else{
									interaction.reply(`You need to wait ${3600 - (currentTime - parseInt(res.data.result.time))} seconds`);
									replied = true;
								}
								})
							.catch((err)=>{
								console.log(err);
								interaction.reply('failed to verify timestamp')
								replied = true})
						
				}
				else{
					interaction.reply('this game is not available in crystal mode')
				}
			}
			else{
				interaction.reply('core only')
			}
		}
		//axie mode games
		else{
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

			axios.get(`https://ronin.rest/archive/getTransferHistory/axie/${interaction.options.getString("axie-id")}`)
				.then((res)=>{

					//todo add check that res.data contains.transfers is not empty
					//console.log('transfers' in res.data)
					//console.log(res.data.transfers.length)
					if ('transfers' in res.data && res.data.transfers.length > 0){
						console.log(res.data.transfer)
						if (res.data.transfers[0].to == gibWallet && res.data.transfers[0].from == donorWallet){
								let gibType = "";
								let description = "";
								let footer = {text: ""};
								if (interaction.options.getSubcommand() == 'pick-random'){
									gibType = "Pick Random"
									description = 'React with 🍑 to join'
									footer.text = 'React with 🍑 to join'
								}
								else if (interaction.options.getSubcommand() == 'deathmatch'){
									gibType = "Deathmatch"
									description = 'React with 🍑 to join'
									footer.text = 'React with 🍑 to join'
								}
								else if (interaction.options.getSubcommand() == 'find-out'){
									gibType = "Find Out"
									description = 'React with 🍑 to join'
									footer.text = 'React with 🍑 to join'
								}
								else if (interaction.options.getSubcommand() == 'emoji-race'){
									if (interaction.channel.id != 1039863438169620490){
										if (!replied) {interaction.reply('not allowed in this channel, try #the-gibing-tree')}
										replied = true
									}
									else {
										gibType = "Emoji Race"
										description = 'Player Cap: 20'
										footer.text = 'React with your favorite emoji to join'
									}
								}
								else if (interaction.options.getSubcommand() == 'guess-the-phrase'){
									gibType = "Guess the Phrase"
									description = 'You get one guess per round! To submit your guess type "solve your-answer-here"'
									footer.text = 'Type "solve your-answer-here"'
								}
								else if (interaction.options.getSubcommand() == 'trivia'){
									gibType = "Trivia"
									description = 'wait for the question, then type your answers in chat'
									footer.text = 'type your answers in chat'
								}
								else if (interaction.options.getSubcommand() == 'spin-the-wheel'){
									gibType = "Spin the Wheel"
									description = 'Dont get picked!'
									footer.text = 'React with 🍑 to join'
								}
								
								const axieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${interaction.options.getString("axie-id")}/axie/axie-full-transparent.png`);
								const hostEmbed = new EmbedBuilder()
									.setTitle(`🚨 GIBAWAY ALERT 🚨`)
									.setDescription(`${description}`)
									.setColor(0xe5de00)
									.setFields(
										{ name: 'Gib Type', value: `${gibType}`, inline: true},
										{ name: 'Axie ID', value: `${interaction.options.getString("axie-id")}`, inline: true},
										{ name: 'Countdown', value: `${interaction.options.getString('countdown')}`, inline: true},
									)
									.setImage('attachment://axie-full-transparent.png')
									.setFooter(footer)
								if (!replied) {
									interaction.reply({ embeds: [hostEmbed], files: [axieImg]});
									editCrystals(interaction.user.id,2);
									const hostGCEmbed = new EmbedBuilder()
										.setDescription(`Host ${interaction.user} received 🔮 2 GC! 🔮`)
										.setColor(0xe5de00)
									interaction.channel.send({ embeds: [hostGCEmbed] });
								}
							
						}
						else {
							if (!replied) {interaction.reply('host failed, try waiting xD')}
						}
					}
					else{
						interaction.reply('axie not valid, try waiting')
					}
				})
				.catch((err)=>{
					console.log(err);
					if (!replied) {interaction.reply('failed to verify2')}
				})
		}
        //verify axie was sent from user wallet
		//note: (!replied) is to protect from async race condition
		
	}
};
