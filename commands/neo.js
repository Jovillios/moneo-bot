const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

let coin = require("../coin.json");

module.exports.run = async(bot, message, args) => {
	if(!coin[message.author.id]) {
		coin[message.author.id] = {
			neo: 0
		};
	}
	let userNeo = coin[message.author.id].neo;
	let balanceEmbed = new Discord.RichEmbed()
	.setTitle("Balance neo")
	.setColor("#ffbf00")
	.addField("Client", message.author.username)
	.addField("Solde", `${userNeo} neo`)
	.setFooter(botconfig.phrase, bot.user.displayAvatarURL)

	message.channel.send(balanceEmbed);
}

module.exports.help = {
	name: "neo"
}