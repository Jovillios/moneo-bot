const botconfig = require("./botconfig.json")
const tokenfile = require("./tokenfile.json")
const Discord = require("discord.js");
const fs = require("fs")
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

let coin = require("./coin.json");

// ----------- PREPA COMMANDES ----------------

fs.readdir("./commands/", (err, files) => {
	if(err) console.log(err);
	let jsfile = files.filter(f => f.split(".").pop() == "js");
	if(jsfile.length <= 0) {
		console.log("Commande non trouvée");
		return;
	}
	jsfile.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		console.log(`${f} chargé`);
		bot.commands.set(props.help.name, props);
	});
})

// ----------- PREPA COMMANDES ----------------

bot.on("ready", async () => {
	console.log(`${bot.user.username} est en ligne!`);
});

bot.on("guildMemberAdd", member => {
	addCoin(member, 100, "Cadeau de Bienvenue!");
});

bot.on("message", message => {
	if(message.author.bot) return;
	if(message.channel.type == 'dm') return;

	// ----------- COMMANDE ---------------

	let prefix = botconfig.prefix;
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);

	let commandfile = bot.commands.get(cmd.slice(prefix.length));
	if(commandfile) commandfile.run(bot, message, args);


	// ----------- COMMANDE ---------------

});

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

bot.login(process.env.BOT_TOKEN);
