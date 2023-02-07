const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

const timeout = 15000


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		
        if (interaction.options._subcommand == "trivia"){
            const gibType = interaction.options._subcommand;
			const countDown = interaction.options.get("countdown").value;
			const axieID = interaction.options.get("axie-id").value;

            let countDownMS = 0;
            if (countDown == '1 minute') { countDownMS = 60000}
            else if (countDown == '2 minutes') { countDownMS = 120000}
            else if (countDown == '3 minutes') { countDownMS = 180000}
            else if (countDown == '5 minutes') { countDownMS = 300000}
            else if (countDown == '10 minutes') { countDownMS = 600000}
            else if (countDown == '10 seconds') { countDownMS = 5000}
            

            //TODO: DM host to fetch category and answer variables
            let question = '';
            let answer = '';
            let dmClosed = false;
            interaction.member.send('Hi, what is your trivia question?')
                .then(message =>{
                    const filter = m => (true);
                    const channel = message.channel;
                    const collector = channel.createMessageCollector(filter, { time: 10000 });
                    console.log("collector started");
                    collector.on('collect', m => {
                        console.log(`Collected ${m.content}`);
                        question = m.content.toLowerCase();
                        for (let i = 0; i < answer.length; i++) {
                            if (answer[i] != ' ') {
                                prompt+='-'
                            }
                            else{
                                prompt+=' '
                            }
                        }
                        collector.stop()
                    })
                    collector.on('end', x => {
                        console.log('collected');
                        interaction.member.send('Great! and what is the correct answer?')
                            .then(message2 =>{
                                const filter = m => (true);
                                const channel = message.channel;
                                const collector2 = channel.createMessageCollector(filter, { time: 10000 });
                                console.log("collector started");
                                collector2.on('collect', m => {
                                    console.log(`Collected ${m.content}`);
                                    answer = m.content.toLowerCase();
                                    collector2.stop()
                                })
                                collector2.on('end', x => {
                                    interaction.member.send('Got it, thanks!')
                                })
                            })
                    });
                })
            .catch((error) => {
                dmClosed = true;
                interaction.channel.send('Cant host this game with DMs closed, GIBAWAY CANCELLED')
            })
            
            let finished = false;

            const startGib = async () => {
                if (question != '' && answer != ''){
                    const phraseEmbed = new EmbedBuilder()
                        .setTitle(`Trivia Time!`)
                        .setColor(0xe5de00)
                        .setFields(
                            { name: 'Question', value: `${question}`}
                        )
                        .setFooter({'text':'type answers in chat'})
                    
                    interaction.member.guild.channels.cache.get(interaction.channelId.toString()).send({ embeds: [phraseEmbed] })
                    
                    // `m` is a message object that will be passed through the filter function
                    const filter = m => true;
                    const collector = interaction.member.guild.channels.cache.get(interaction.channelId.toString()).createMessageCollector({ filter, time: 1000000 });

                    collector.on('collect', m => {
                        
                        if (m.content.toLowerCase().includes(answer)){
                            //add winner record to db
                            axios.post("http://localhost:8080/api/winner",{ "user":m.author.id,"axieID":axieID})
                                .then((res)=>{
                                    console.log('winner record added to database')})
                                .catch((err)=>{
                                    console.log(err);
                                    console.log('winner record not added to database')})
                                const axieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${axieID}/axie/axie-full-transparent.png`);
                                const winEmbed = new EmbedBuilder()
                                    .setDescription(`${m.author} won Axie #${axieID}\n\nuse the /claim command for prize delivery!`)
                                    .setThumbnail('attachment://axie-full-transparent.png')
                                    .setColor(0xe5de00)
                                interaction.channel.send({ content: `${m.author}`, embeds: [winEmbed], files: [axieImg] });
                            finished = true
                            collector.stop()
                            
                        }
                        console.log(`Collected ${m.content}`);
                    });

                    collector.on('end', collected => {
                        console.log(`Collected ${collected.size} items`);
                    });
                }
                else if (!dmClosed){
                    interaction.channel.send('You didnt provide a question. Try again and check DMs')
                }
                
            }
            
            setTimeout(startGib, countDownMS);
            
            
			
        }
		
	},
};


