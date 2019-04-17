const Discord = require("discord.js");

let coin = require("../coin.json");

module.exports.run = async(bot, message, args) => {
	if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Nope").then(msg => {msg.delete(5000)});
	if(!args[1]) return message.channel.send("Erreur : $motherlode <membre> <montant> <raison>").then(msg => {msg.delete(5000)});

	let mem = message.guild.member(message.mentions.users.first()) || message.guild.member.get(args[0]);
	let amount = parseInt(args[1]);
	let reason = args[2];
	addCoin(mem, amount, reason);
}

module.exports.help = {
	name: "motherlode"
}

function addCoin(member, amount, reason) {
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
	.addField("Montant crédité", `${parseInt(amount)} neo`)
	.addField("Raison", reason)
	.addField("Nouveau solde", `${newUserCoin} neo`)
	.setFooter(botconfig.phrase, bot.user.displayAvatarURL)

	member.guild.channels.find("name", "neo").send(addCoinEmbed);

	fs.writeFile("./coin.json", JSON.stringify(coin), (err) => {
		if(err) console.log(err);
	});
}
