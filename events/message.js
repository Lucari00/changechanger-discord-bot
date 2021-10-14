const config = require("C:/Users/lucap/Desktop/projet_secret/config.json");
const fs = require("fs");
const Discord = require("discord.js12")

module.exports = {
    name: 'message',
    execute(message, client) {
        if (message.author.id != config.id) {
            let prefix = config.prefix
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName);
            if (command != undefined && message.author.id == "312966503077249035") {
                command.run(client, message, args)
            } else {
                const command = client.commands.get("test");
                command.run(client, message, args)
            }
        }        
    }
}