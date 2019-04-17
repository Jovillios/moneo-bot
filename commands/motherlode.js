const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const fs = require("fs");

let coin = require("../coin.json");

module.exports.run = async(bot, message, args) => {
	if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Nope").then(msg => {msg.delete(5000)});

	let mem = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	addCoin(bot, mem, args[1], args[2]);
}

module.exports.help = {
	name: "motherlode"
}

function addCoin(bot, member, amount, reason) {
	if(!coin[member.id]) {
		coin[member.id] = {
			neo: 0
		};
	}

	let userCoin = coin[member.id].neo;
	let newUserCoin = userCoin + parseInt(amount);
	coin[member.id].neo = newUserCoin;

	let addCoinEmbed = new Discord.RichEmbed()
	.setTitle("Crédit")
	.setColor("#ffbf00")
	.addField("Client", member.user.username)
	.addField("Montant crédité", `${parseInt(amount)} neo`)
	.addField("Raison", reason)
	.addField("Nouveau solde", `${newUserCoin} neo`)
	.setFooter(botconfig.phrase, bot.user.displayAvatarURL)

	member.guild.channels.find("name", "neo").send(addCoinEmbed);

	fs.writeFile("../coin.json", JSON.stringify(coin), (err) => {
		if(err) console.log(err);
	});
}
