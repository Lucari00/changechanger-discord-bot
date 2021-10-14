const Discord = require("discord.js12");
const {Intents} = require("discord.js");
const config = require("./config.json");
const fs = require("fs");


const client = new Discord.Client({ 
	/*intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]*/ 
});

client.commands = new Discord.Collection();

const loadCommands = (dir = "./commands") => {
	fs.readdirSync(dir).forEach(dirs => {
	  const commandFiles = fs.readdirSync(`${dir}/${dirs}/`).filter(file => file.endsWith(".js"));
  
	  for (const file of commandFiles) {
		const getFileName = require(`${dir}/${dirs}/${file}`);
		client.commands.set(getFileName.help.name, getFileName);
		console.log(`${getFileName.help.name}: Commande Chargée.`)
	  }
	})
  }

loadCommands()

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.login(config.TOKEN);