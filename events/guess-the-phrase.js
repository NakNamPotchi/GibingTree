const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

const timeout = 15000

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
//potential todo: create new folder called modules, /modules/huess-thephrase.js import this from host command and trigger events manually, sending metadata (user phrase) 
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		
        if (interaction.options._subcommand == "guess-the-phrase"){
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
            

            let category = '';
            let answer = '';
            let prompt = '';
            let dmClosed = false;
            let timestampFail = false;

            if (axieID == 'crystals'){
                axios.get("http://localhost:8080/api/timestamp/game/guess-the-phrase")
					.then((res)=>{
						const currentTime = Math.floor(Date.now() / 1000)

						//3 min passed
                        const hasRole = interaction.member.roles.cache.some(r => r.name === "Core")
						if ( currentTime - parseInt(res.data.result.time) > 3600 && hasRole){
                            interaction.member.send('Hi, what is the phrase that you want to be guessed?')
                            .then(message =>{
                                const filter = m => (true);
                                const channel = message.channel;
                                const collector = channel.createMessageCollector(filter, { time: 10000 });
                                console.log("collector started");
                                collector.on('collect', m => {
                                    console.log(`Collected ${m.content}`);
                                    answer = m.content.toLowerCase();
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
                                    interaction.member.send('Great! and what category is your phrase in?')
                                        .then(message2 =>{
                                            const filter = m => (true);
                                            const channel = message.channel;
                                            const collector2 = channel.createMessageCollector(filter, { time: 10000 });
                                            console.log("collector started");
                                            collector2.on('collect', m => {
                                                console.log(`Collected ${m.content}`);
                                                category = m.content.toLowerCase();
                                                collector2.stop()
                                            })
                                            collector2.on('end', x => {
                                                interaction.member.send('Got it, thanks!')
                                                //update timsetamp
                                                axios.put(`http://localhost:8080/api/timestamps/${res.data.result._id}`,{ "time":currentTime})
                                                    .then((res3)=>{
                                                        console.log('timestamp record edited')})
                                                    .catch((err3)=>{
                                                        //console.log(err3);
                                                        console.log('timestamp record not edited')})
                                            })
                                        })
                                });
                            })
                            .catch((error) => {
                                dmClosed = true;
                                interaction.channel.send('Cant host this game with DMs closed, GIBAWAY CANCELLED')
                            })
							
						}
						else if (hasRole){
							interaction.member.send(`You need to wait ${3600 - (currentTime - parseInt(res.data.result.time))} seconds`);
							timestampFail = true;
						}
					})
					.catch((err)=>{
						console.log(err);
					})
            }
            else{
                //todo: if gibtype crystal and timestamp is ok
                interaction.member.send('Hi, what is the phrase that you want to be guessed?')
                    .then(message =>{
                        const filter = m => (true);
                        const channel = message.channel;
                        const collector = channel.createMessageCollector(filter, { time: 10000 });
                        console.log("collector started");
                        collector.on('collect', m => {
                            console.log(`Collected ${m.content}`);
                            answer = m.content.toLowerCase();
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
                            interaction.member.send('Great! and what category is your phrase in?')
                                .then(message2 =>{
                                    const filter = m => (true);
                                    const channel = message.channel;
                                    const collector2 = channel.createMessageCollector(filter, { time: 10000 });
                                    console.log("collector started");
                                    collector2.on('collect', m => {
                                        console.log(`Collected ${m.content}`);
                                        category = m.content.toLowerCase();
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
            }

            
            
            let round = 0;
            let finished = false;
            let guessed = [];
            

            const revealLetter = () => {
                //pick a random letter
                let found = false;
                let letter;
                while (!found) {
                    letter = answer[Math.floor(Math.random() * answer.length)]
                    if (!prompt.includes(letter)){
                        found = true
                    }
                }
                console.log(letter)
                console.log(1,prompt)
                //convert
                for (let i = 0; i < answer.length; i++) {
                    if (answer[i] == letter) {
                        prompt = prompt.substring(0, i) + letter + prompt.substring(i + 1)
                    };
                }
                console.log(2,prompt)
            }

            const nextRound = async () => {
                if (category != '' && answer != ''){
                    round++
                    revealLetter()
                    const phraseEmbed = new EmbedBuilder()
                        .setTitle(`Round ${round}`)
                        .setColor(0xe5de00)
                        .setFields(
                            { name: 'Category', value: `${category}`},
                            { name: 'Solve the Puzzle', value: `${prompt}`}
                        )
                    
                    //message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [phraseEmbed] })
                    interaction.member.guild.channels.cache.get(interaction.channelId.toString()).send({ embeds: [phraseEmbed] })
                    guessed = [];
                    // `m` is a message object that will be passed through the filter function
                    const filter = m => m.content.toLowerCase().startsWith('solve');
                    const collector = interaction.member.guild.channels.cache.get(interaction.channelId.toString()).createMessageCollector({ filter, time: 30000 });

                    collector.on('collect', m => {
                        
                        //winner
                        if (!guessed.includes(m.author) && m.content.toLowerCase().includes(answer)){
                            //axie mode
                            if (axieID != 'crystals'){
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
                            
                            }
                            //crystal mode
                            else{
                                editCrystals(m.author.id,4);
                                const winEmbed = new EmbedBuilder()
                                    .setDescription(`GG!\n\n${m.author} won 🔮 +4 GC 🔮`)
                                    .setColor(0xe5de00)
                                interaction.channel.send({ content: `${m.author}`, embeds: [winEmbed] });
                                finished = true
                                collector.stop()
                            }
                            
                            
                        }
                        guessed.push(m.author);
                        console.log(`Collected ${m.content}`);
                    });

                    collector.on('end', collected => {
                        if (!finished){nextRound();}
                        
                        console.log(`Collected ${collected.size} items`);
                    });
                }
                else if (!timestampFail && !dmClosed){
                    interaction.channel.send('You forgot to provide a phrase. Try again and check DMs')
                }
                
            }
            
            
            setTimeout(nextRound, countDownMS);
            
            
			
        }
		
	},
};


