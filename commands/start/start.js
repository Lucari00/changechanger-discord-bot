const Discord = require("discord.js12");
const config = require("C:/Users/lucap/Desktop/projet_secret/config.json");
const main = require("./question.js");
const {MongoClient} = require("mongodb");

module.exports.help = {name: "start"};
module.exports.question = {start: false, numero: 0, reponse: ""};

const loadCommand = (client) => {
	const getFileName = require(`./question.js`);
	client.commands.set(getFileName.help.name, getFileName);
}

module.exports.run = async (client, message, args) => {
    if (!main.question.start) {
        console.log("------Egnime start------");
        message.delete();
        message.channel.send("On a la date, il nous manque l'heure et l'endroit... \nMais pour les déterminer, il vous faudra certainement coopérer... ou pas pour y arriver.\nNous allons commencer doucement pour vous mettre en bouche : \n\nQuel est cette fameuse date que vous entendez souvent depuis ces derniers jours (ou plus 👀) ?\n(réponse attendue sous la forme jour/mois/année)\n||@everyone||");
        numero = 1;
        const objet = {channel_id: message.channel.id};
        Data(objet);
        main.run(client, message, 1)
    } else {console.log("Déjà start");}
}

async function Data(objet) {
    const uri = "mongodb+srv://LucariO:pgEvpl9HODdkhlWo@cluster.ppk1w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        await createListing(client, objet);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
} 

async function createListing(client, newListing) {
    const result = await client.db("oct6").collection("Question").insertOne(newListing);

    console.log(`Nouvelle donnée avec cette id : ${result.insertedId}`)
}
