const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
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

const editLeaders = async (leaderUser) => {
    //check if user exists
    axios.get(`http://localhost:8080/api/leader/userID/${leaderUser.id}`)
        .then((res)=>{
            console.log(res.data.result)
            if (res.data.result == null){
                //add new record
                axios.post("http://localhost:8080/api/leader",{ "userID":leaderUser.id,"username":leaderUser.username,"wins":1})
                    .then((res2)=>{
                        console.log('leader record added to database')})
                    .catch((err2)=>{
                        //console.log(err2);
                        console.log('leader record not added to database')})
            }
            else{
                //edit record
                axios.put(`http://localhost:8080/api/leaders/${res.data.result._id}`,{ "wins":String(parseInt(res.data.result.wins) + 1)})
                    .then((res3)=>{
                        console.log('leader record edited')})
                    .catch((err3)=>{
                        //console.log(err3);
                        console.log('leader record not edited')})
            }
        })
}
let timeout = 15000;
const alive = [];
const dead = [];
let topKills = [];
const deathMessages = [
    "killee encountered a random crit",
    "killer put killee on a stake",
    "killee died by jinx",
    "an eagle swooped down and snatched killee",
    "killee was killed by red hawk's hate",
    "killee died from excessive sadness",
    "killee's hair caught on fire and they suffocated",
    "killee died of dysentery",
    "killee forgot to eat",
    "killer cannibalized killee",
    "killee pressed the red button",
    "killer hired a hitman to kill killee",
    "killee had too much woohoo",
    "killer served killee a poorly prepared pufferfish",
    "killer got killee to 30 stacks",
    "killee owed too much money to killer",
    "killee wrote their own name in the death note",
    "killee took a 5 game LS to killer",
    "killee drowned in chicken soup",
    "killer took killee's life vest",
    "killee got eggycoptered in the face",
    "a single raindrop melted killee",
    "killer yeeted killee",
    "killer pushed killee into some dog poo... and they suffocated",
    "air left the room and suffocated killee",
    "killee died from a fart",
    "axie is so fluffy that killee died",
    "killee kissed a wet washing machine",
    "killee no-clipped off the earth",
    "killee attempted a revive but was assassinated by killer",
    "killee offered themselves to ET",
    "killee kept a rattlesnake as a pet",
    "killee sell kidneys to buy EA",
    "tobi threw a rock at killee",
    "killer threw a rock at killee",
    "killee meowed so hard they bonked their head",
    "killee tagged core",
    "killee stepped on by goth girl killer",
    "killee met bab",
    "killee choked on milktea boba",
    "killer DDoS'ed killee's pacemaker",
    "Hestia melted killee's eyes with RGB",
    "killee dead by guillotine",
    "killee died from heart attack after winning jackpot",
    "killee missed too many gibs",
    "killee dumpster dived in raccoon's trash bin",
    "killee got trapped in the tanning bed",
    "killee threatened a Spartain King",
    "killee didnt turn off their cell phone in the movie theater",
    "killee died by eggbomb",
    "killee was abducted and dissected by aliens",
    "thanos erased killee",
    "killee died from a proper diet",
    "Rand double-sliced killee with a pair of katanas",
    "Rand's spinning blades clipped killee's jugular",
    "killee was tossed overboard by killer",
    "killee was betrayed by killer",
    "killee took a bullet for killer",
    "killer drank killee's blood",
    "killer roundhouse kicked killee",
    "killer exhibited martial arts to killee",
    "killer fed killee to a pride of lions",
    "killer fed killee to a pod of orcas",
    "killer fed killee to a murder of crows",
    "killer gave killee a sky funeral",
    "killer yeeted killee from the top of a canyon",
    "killer yeeted killee through the center of the earth",
    "killer yeeted killee in mid-air",
    "killer yelled really loud at killee",
    "killer insulted killee, causing dehydration from crying",
    "killer hit the ejector seat on killee",
    "killee was squeezed to death by killer",
    "killee was touched by killer",
    "killee got doxxed by killer",
    "killee was trampled by killer",
    "killee was captured in killer's pokeball",
    "killee was body slammed by killer",
    "killee was flamethrowered by killer's charizard",
    "killer glanced at killee",
    "killer gave killee a big ol' smooch on the lips",
    "killer lured killee onto grass",
    "killee starved to death after killer destroyed their stew",
    "killer rick rolled killee"
    
]

const neutralMessages = [
    "thisUser ate some jelly beans",
    "thisUser found a cute dog and fed him some carrots",
    "thisUser saw a rainbow",
    "thisUser finally had a good cry",
    "thisUser got some bad news from the doctor",
    "thisUser found a new romantic interest",
    "thisUser planned out their next move",
    "thisUser is taking a bath",
    "thisUser picked up a banana",
    "thisUser decided to play v2",
    "thisUser went outside",
    "thisUser fell asleep and missed the round",
    "thisUser farted to the tune of their national anthem",
    "thisUser scratched their nails across the chalkboard",
    "thisUser got hypnotized by tailslap's eyebrows"
]

const lifeMessages = [
    "reviver lent revivee some holy water",
    "revivee seems to have reanimated",
    "its not your time yet, get back in the game revivee",
    "revivee landed a healing crit at the last second",
    "revivee saw eggycopter in heaven",
    "revivee woke up in a cave",
    "revivee used cheat engine",
    "mero's puppy licked revivee",
    "revivee aborted the lunacian express",
    "revivee actived totem of undying",
    "olek picked revivee off the ground",
    "revivee was licked by the perfect kitten",
    "gibing tree is revivee's simp",
    "revivee was just sleeping lol",
    "revivee forgot they had work",
    "revivee became a ZOMBIE",
    "revivee woke up from Snowy's neko dance, what a simp",
    "revivee found a glitch in the matrix",
    "revivee touched grass",
    "revivee bought back in",
    "revivee was struck by helpful lightning",
    "revivee was wormholed out of the 8th dimension",
    "revivee woke up in a hotel hallway",
    "revivee woke up in a mansion",
    "revivee busted through their coffin",
    "revivee was rejected from the afterlife",
    "revivee was dropped off by a UFO",

]

const eventMessages = [
    "There was a stampede of Big Yaks!",
    "Rand went berserker mode with his katanas!",
    "Eggy took her ultimate form: Ultra Copter!",
    "It rained bowling balls!",
    "ET Cult attacked!",
    "The Lunacian Express derailed!"
]

//fisher-yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		
		if (message.author.id == 1035608517157068810 && message.embeds.length != 0 && 'title' in message.embeds[0].data && message.embeds[0].data.title.includes('GIBAWAY ALERT')){

			let gibType;
			let countDown;
			let axieID;
			message.embeds[0].data.fields.forEach((field) => {
				if (field.name == 'Gib Type') {gibType = field.value}
				else if (field.name == 'Countdown') {countDown = field.value}
				else if (field.name == 'Axie ID') {axieID = field.value}
			})
            
            if (gibType == 'Deathmatch'){
				message.react('🍑');
                let reviveDict = {};
                let killDict = {};
                let countDownMS = 0;
                if (countDown == '1 minute') { countDownMS = 60000}
                else if (countDown == '2 minutes') { countDownMS = 120000}
                else if (countDown == '3 minutes') { countDownMS = 180000}
                else if (countDown == '5 minutes') { countDownMS = 300000}
                else if (countDown == '10 minutes') { countDownMS = 600000}
                else if (countDown == '10 seconds') { countDownMS = 5000}

				const filter = (reaction, user) => {
					return reaction.emoji.name === '🍑' && !user.bot;
				};
                
				const collector = message.createReactionCollector({ filter, time: countDownMS });
				
				collector.on('collect', (reaction, user) => {
                    if (!alive.includes(user)){
                        alive.push(user)
                        console.log(`Collected ${reaction.emoji} from ${user.tag}`);
                    }
					
				});
				
				collector.on('end', (collected, reason) => {
					console.log("collection ended", collected);

                    let vip = null;
                    let playerList = "";
                    alive.forEach((user) =>{
                        reviveDict[user.tag] = 0;
                        killDict[user] = 0;
                    })
                    if (alive.length > 40){
                        timeout = 20000;
                    }
                    if (alive.length < 28){
                        alive.forEach((user) =>{
                            playerList+=`${user}\n`;
                        })
                    }
                    else {
                        playerList = "Too many to show!"
                    }

                    alive.forEach((user) => {
                        if (user.id == 386948687525576704){
                            vip = user
                        }
                    })

                    // while (alive.length > 28){
                    //     alive.pop()
                    // }

                    //init game
                    const initEmbed = new EmbedBuilder()
                        .setTitle('Let the Deathmatch Commence')
                        .setColor(0xe5de00)
                        .setFields(
                            { name: 'Players', value: `${playerList}` }
                        )
                    
                    message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [initEmbed] })
                    
                    //the game (recursive)
                    let round = 0;
                    async function processRounds() {
                        round+=1
                        let revRate;
                        let deathRate;
                        let messageList = [];

                        // troll jihoz
                        if (vip != null){
                            if (round == 1){
                                const vipImg = new AttachmentBuilder('./assets/jihoz.png');
                                const eventEmbed = new EmbedBuilder()
                                    .setTitle(`A Special Event Occured`)
                                    .setDescription('THE TREE STARTED GLOWING')
                                    .setImage('attachment://jihoz.png')
                                    .setColor(0xe5de00)
                                    .setFooter({text: `${alive.length} players left`})
                                message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [eventEmbed], files: [vipImg] });
                                setTimeout(processRounds, timeout);
                            }
                            if (round == 2){
                                alive.forEach((user) => {
                                    if (user != vip){
                                        messageList.push(`💀 ~~${user}~~`);
                                        alive.splice(alive.indexOf(user),1);
                                        dead.push(user);
                                    }
                                })
                                let messageString = "";
                                
                                if (messageList.length > 28){
                                    messageString="Too many to list"
                                }
                                else if (messageList.length == 0){
                                    messageString="None"
                                }
                                else{
                                    messageList.forEach((message) => {
                                        messageString+=`${message}\n`
                                    })
                                }
                                const eventEmbed = new EmbedBuilder()
                                    .setTitle(`Jihoz activated the Gibbing Crystal`)
                                    .setColor(0xe5de00)
                                    .setFooter({text: `${alive.length} players left`})
                                    .setFields(
                                        { name: 'Casualties', value: `${messageString}` }
                                    )
                                message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [eventEmbed] });
                                setTimeout(processRounds, timeout);
                            }
                            if (round == 3){
                                //add winner record to db
                                axios.post("http://localhost:8080/api/winner",{ "user":alive[0].id,"axieID":axieID})
                                .then((res)=>{
                                    console.log('winner record added to database')})
                                .catch((err)=>{
                                    console.log(err);
                                    console.log('winner record not added to database')})
                                const axieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${axieID}/axie/axie-full-transparent.png`);
                                const winEmbed = new EmbedBuilder()
                                    .setDescription(`${alive[0]} won Axie #${axieID}\n\nuse the /claim command for prize delivery!`)
                                    .setThumbnail('attachment://axie-full-transparent.png')
                                    .setColor(0xe5de00)
                                message.client.channels.cache.get(message.channel.id.toString()).send({ content: `${alive[0]}`, embeds: [winEmbed], files: [axieImg] });
                                alive.length = 0;
                                dead.length = 0;
                                vip = null;
                            }
                        }

                        //dont troll jihoz
                        else if (alive.length > 1){

                            //kill event
                            const eventSeed = Math.random();
                            if (eventSeed < .05){
                                alive.forEach((user) => {
                                    if (alive.length > 1){
                                        subSeed = Math.random();
                                        if (subSeed < .5) {
                                            messageList.push(`💀 ~~${user}~~`)
                                            alive.splice(alive.indexOf(user),1)
                                            dead.push(user);
                                        }
                                    }
                                })
                                let messageString = "";
                                messageList.forEach((message) => {
                                    messageString+=`${message}\n`
                                })
                                if (messageList.length == 0){
                                    messageString="Nobody was injured"
                                }

                                const eventEmbed = new EmbedBuilder()
                                    .setTitle(`${eventMessages[Math.floor(Math.random()*eventMessages.length)]}`)
                                    .setColor(0xe5de00)
                                    .setFooter({text: `${alive.length} players left`})
                                    .setFields(
                                        { name: 'Casualties', value: `${messageString}` }
                                    )
                            
                                message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [eventEmbed] });
                                setTimeout(processRounds, timeout);
                            }
                            //revive event
                            else if (eventSeed > .97){
                                dead.forEach((user) => {
                                    messageList.push(`💗 ${user}`)
                                    dead.splice(dead.indexOf(user),1)
                                    alive.push(user);
                                })
                                let messageString = "";
                                messageList.forEach((message) => {
                                    messageString+=`${message}\n`
                                })
                                if (messageList.length == 0){
                                    messageString="Nobody was dead in the first place"
                                }
                                const eventEmbed = new EmbedBuilder()
                                    .setTitle(`Jihoz Spoketh Unto You!`)
                                    .setColor(0xe5de00)
                                    .setFooter({text: `${alive.length} players left`})
                                    .setFields(
                                        { name: 'Wake up!', value: `${messageString}` }
                                    )
                            
                                message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [eventEmbed] });
                                setTimeout(processRounds, timeout);
                            }
                            //no event
                            else{
                                //check for deaths
                                //TODO: move this out of processRound() , doesnt need to recalc each round
                                let masterList = alive.concat(dead);
                                if (masterList.length > 40){
                                    deathRate = .22;
                                    revRate = .03;
                                }
                                else if (masterList.length > 20){
                                    deathRate = .25;
                                    revRate = .06;
                                }
                                else{
                                    deathRate = .20
                                    revRate = .04
                                }
                                if (round > 8){
                                    revRate-=.015
                                }
                                if (round > 12){
                                    deathRate += .01
                                    revRate-=.015
                                }
                                if (round > 15){
                                    deathRate += .01
                                    revRate-=.015
                                }
                                shuffle(masterList)
                                let killedCount = 0;
                                masterList.forEach((user) => {
                                    if (alive.includes(user)){
                                        if (alive.length > 1){
                                            const seed = Math.random();
                                            console.log(seed)
                                            //killed
                                            if (seed<deathRate){
                                                killedCount+=1
                                                
                                                console.log(`${user} killed`);
                                                console.log(user.username)
                                                let isKiller;
                                                let findKiller = () => {
                                                    isKiller = alive[Math.floor(Math.random()*alive.length)]
                                                    if (isKiller == user){
                                                        findKiller()
                                                    }
                                                    else {
                                                        console.log('iskiller',isKiller)
                                                        killDict[isKiller] += 1;
                                                    }
                                                }
                                                if (round == 1 && killedCount == 1){
                                                    const deathMsg = deathMessages[Math.floor(Math.random()*deathMessages.length)];
                                                    if (deathMsg.includes('killer')){
                                                        findKiller()
                                                    }
                                                    messageList.push('💀 '+deathMsg.replace('killee',`~~${user}~~`).replace('killer',`${isKiller}`))
                                                    alive.splice(alive.indexOf(user),1)
                                                    console.log(alive);
                                                    dead.push(user);
                                                    editCrystals(user.id,4);
                                                    messageList.push(`🔮 First Blood! +4 GC for ${user}`)
                                                }
                                                else if ((round > 1)||(round < 3 && killedCount < 6)){
                                                    const deathMsg = deathMessages[Math.floor(Math.random()*deathMessages.length)];
                                                    if (deathMsg.includes('killer')){
                                                        findKiller()
                                                    }
                                                    messageList.push('💀 '+deathMsg.replace('killee',`~~${user}~~`).replace('killer',`${isKiller}`))
                                                    alive.splice(alive.indexOf(user),1)
                                                    console.log(alive);
                                                    dead.push(user);
                                                    if (Math.random() > .9){
                                                        editCrystals(user.id,1);
                                                        messageList.push(`🔮 RNGzus gave +1 GC for ${user}`)
                                                    }
                                                    if (alive.length == 1){
                                                        editCrystals(user.id,3);
                                                        messageList.push(`🔮 So close! +3 GC for ${user}`)
                                                    }
                                                    
                                                }
                                                
                                            }

                                            //bloodmoon
                                            else if (round >= 20) {
                                                if (seed > .6) {
                                                    console.log(`${user} killed bloodmoon`);
                                                    messageList.push(`🩸 ~~${user}~~ died to bloodmoon`)
                                                    alive.splice(alive.indexOf(user),1)
                                                    console.log(alive);
                                                    dead.push(user);
                                                    if (alive.length == 1){
                                                        editCrystals(user.id,3);
                                                        messageList.push(`🔮 So close! +3 GC for ${user}`)
                                                    }
                                                }
                                            }
                                            else if (round >= 15) {
                                                if (seed > .8) {
                                                    console.log(`${user} killed bloodmoon`);
                                                    messageList.push(`🩸 ~~${user}~~ died to bloodmoon`)
                                                    alive.splice(alive.indexOf(user),1)
                                                    console.log(alive);
                                                    dead.push(user);
                                                    if (alive.length == 1){
                                                        editCrystals(user.id,3);
                                                        messageList.push(`🔮 So close! +3 GC for ${user}`)
                                                    }
                                                }
                                            }

                                            //check for neutrals
                                            else if (seed >= deathRate){
                                                if (seed > .93){
                                                    messageList.push('🚶 '+neutralMessages[Math.floor(Math.random()*neutralMessages.length)].replace('thisUser',`${user}`))
                                                }
                                                console.log(`${user} survived`)
                                            }
                                        }  
                                    }

                                    //revives
                                    else if (dead.includes(user)){
                                        const seed = Math.random();
                                        if (reviveDict[user.tag] <= 2 && seed<revRate) {
                                            console.log(`${user} revived`);
                                            messageList.push('💗 '+lifeMessages[Math.floor(Math.random()*lifeMessages.length)].replace('revivee',`${user}`).replace('reviver',`${alive[Math.floor(Math.random()*alive.length)]}`))
                                            reviveDict[user.tag] += 1;
                                            dead.splice(dead.indexOf(user),1)
                                            alive.push(user);
                                        }
                                        else if (seed>=revRate){
                                            console.log(`${user} not revived`)
                                        }
                                    }
                                })
                                
                                let messageString = "";
                                messageList.forEach((message) => {
                                    messageString+=`${message}\n`
                                })
                                if (messageList.length > 25){messageString="too many to list"}
                                if (messageList.length == 0){messageString="Everyone is Bing Chilling"}
                            
                                let topKillsString = "";

                                const topKills = Object.entries(killDict)
                                    .sort((curr, next) => next[1] - curr[1])
                                topKills.slice(0,2).forEach((topKiller)=>{
                                    if (topKiller[1] > 0) {
                                        topKillsString+=`${topKiller[1]}  ${topKiller[0]}\n`
                                    }
                                })
                                if (topKillsString.length ==0){topKillsString="None"}
                                const roundEmbed = new EmbedBuilder()
                                    .setTitle(`Round ${round}`)
                                    .setColor(0xe5de00)
                                    .setFooter({text: `${alive.length} players left`})
                                    .setFields(
                                        { name: 'Kill Log', value: `${messageString}` } ,
                                        { name: 'Top Kills', value: `${topKillsString}`}
                                    )
                            
                                message.client.channels.cache.get(message.channel.id.toString()).send({ embeds: [roundEmbed] });
                                setTimeout(processRounds, timeout);
                            }
                        }
                        else{
                            editLeaders(alive[0]);
                            //add winner record to db
                            axios.post("http://localhost:8080/api/winner",{ "user":alive[0].id,"axieID":axieID})
                            .then((res)=>{
                                console.log('winner record added to database')})
                            .catch((err)=>{
                                console.log(err);
                                console.log('winner record not added to database')})
                            const axieImg = new AttachmentBuilder(`https://axiecdn.axieinfinity.com/axies/${axieID}/axie/axie-full-transparent.png`);
                            const winEmbed = new EmbedBuilder()
                                .setDescription(`${alive[0]} won Axie #${axieID}\n\nuse the /claim command for prize delivery!`)
                                .setThumbnail('attachment://axie-full-transparent.png')
                                .setColor(0xe5de00)
                            message.client.channels.cache.get(message.channel.id.toString()).send({ content: `${alive[0]}`, embeds: [winEmbed], files: [axieImg] });
                            alive.length = 0;
                            dead.length = 0;   
                        }
                    }
                    setTimeout(processRounds, timeout);

				});
			}
		}
	},
};


