const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("https://api.roninchain.com/rpc");
const addressFrom = "0x903095e8eff84b34f3e13f8ab9c9bc072fc58a76";
const privateKey = process.env.PRIV_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const axieABI = [
    {
        "constant":false,
        "inputs":[
                    {
                        "internalType":"address",
                        "name":"_from",
                        "type":"address"
                    },
                    {
                        "internalType":"address",
                        "name":"_to",
                        "type":"address"
                    },
                    {
                        "internalType":"uint256",
                        "name":"_tokenId",
                        "type":"uint256"
                    }
                ],
        "name":"safeTransferFrom",
        "outputs":[],
        "payable":false,
        "stateMutability":"nonpayable",
        "type":"function"}
]


module.exports = {
	data: new SlashCommandBuilder()
		.setName('purchase')
		.setDescription('buy an axie from the shop')
        .addStringOption(option =>
			option.setName('axie-id')
                .setDescription('what axie to purchase?')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('ronin-address')
                .setDescription('enter your ronin address')
                .setRequired(true)
                .setMinLength(46)
                .setMaxLength(46))
		,
	async execute(interaction) {
		const roninAddress = interaction.options.getString('ronin-address').replace('ronin:','0x');
        const axieID = interaction.options.getString('axie-id');
		
		axios.get(`http://localhost:8080/api/shop/axie/${axieID}`)
			.then((res)=>{
                //check if axie in shop
                console.log(res.data)
                if (res.data.shop == null){
                    interaction.reply('This axie is not available')
                }
                else {
                    //check balance is sufficient
                    axios.get(`http://localhost:8080/api/crystal/userID/${interaction.user.id}`)
                        .then((res2)=>{
                            //console.log(res2.data.result)
                            if (res2.data.result == null || parseInt(res2.data.result.balance) < parseInt(res.data.shop.cost)){
                                interaction.reply('you need more gibbing crystals')
                            }
                            else{
                                //remove crystals
                                axios.put(`http://localhost:8080/api/crystals/${res2.data.result._id}`,{ "balance":String(parseInt(res2.data.result.balance) - res.data.shop.cost)})
                                    .then((res3)=>{
                                        console.log('crystal record edited')

                                        //transfer axie
                                        let axieContract = new ethers.Contract('0x32950db2a7164ae833121501c797d79e7b79d74c',axieABI,wallet)
                                        let receipt = axieContract.safeTransferFrom(addressFrom, roninAddress, axieID);
                                        console.log(receipt);

                                        //remove axie from shop
                                        axios.delete(`http://localhost:8080/api/shop/${res.data.shop._id}`)
                                            .then((res4)=>{
                                                console.log(`you have succesfully deleted axie from shop`)})
                                                interaction.reply("Congrats!!! Your axie is on the way")
                                            .catch((err4)=>{
                                                console.log(err4);
                                                interaction.reply('failed to remove axie from shop')})
                                    })
                                    .catch((err3)=>{
                                        console.log(err3);
                                        interaction.reply('crystal record not edited')})
                            }
                        })
                }
                
				})
			.catch((err)=>{
				console.log(err);
				interaction.reply('failed to purchase')})
		
	},
};