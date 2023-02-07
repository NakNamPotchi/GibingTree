const { SlashCommandBuilder } = require('discord.js');
const axios = require("axios");
const { ethers } = require("ethers");
require('dotenv').config();

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
		.setName('claim')
		.setDescription('claim your prize')
		.addStringOption(option =>
			option.setName('axie-id')
			.setDescription('the ID of the axie you won')
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
        //check if prize is claimable by user
        axios.get(`http://localhost:8080/api/winner/axieID/${axieID}`)
            .then((res) => {
                if (res.data.winner == null){
                    interaction.reply(`you did not win axie ${axieID}`);
                }
                else {
                    //WINNER
                    //todo wait for promise to resolve
                    console.log(res.data.winner.user,interaction.user.id)
                    if (res.data.winner.user == interaction.user.id){
                        let axieContract = new ethers.Contract('0x32950db2a7164ae833121501c797d79e7b79d74c',axieABI,wallet)
                        let receipt = axieContract.safeTransferFrom(addressFrom, roninAddress, axieID);
                        console.log(receipt)
                        interaction.reply('your prize is on its way!');

                        //delete record todo: on promise resolution
                        axios.delete(`http://localhost:8080/api/winner/${res.data.winner._id}`)
                            .then((res)=>{
                                console.log('succesfully deleted winner record')})
                            .catch((err)=>{
                                console.log(err);
                                console.log('failed to delete winner record')})
                    }
                    else {
                        interaction.reply(`you did not win axie ${axieID}`);
                    }
                }
            })
            .catch((err) => {
                console.log('failed get;')
                console.log(err)
            })
		
		
	},
};
