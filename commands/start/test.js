const main = require("./question.js")
const {MongoClient} = require("mongodb");
const { question } = require("./start.js");

module.exports.help = { name: "test"}

function QuestionMaker(question) {
    switch(question) {
        case 0:
            return {start: false, numero: 0, reponse: ""}
        case 1:
            return {start: true, numero: 1, reponse: "01/01/2022"} // quelle est la fameuse date ?
        case 2:
            return {start: true, numero: 2, reponse: "16/03/2020"} // premier message dans trydard_1 ? 
        case 3:
            return {start: true, numero: 3, reponse: "42"} //Combien de rôle relié à l'ECOLE y a t-il sur le serv ? 
    }
} 

const loadCommand = (client) => {
	const getFileName = require(`./question.js`);
	client.commands.set(getFileName.help.name, getFileName);
}

module.exports.run = async (client, message, args) => {
    loadCommand(client);
    resultChannel = await Data(message, "channel", {});
    if (resultChannel === null) {
         channel_id = "";
    } else {channel_id = resultChannel.channel_id}
    
    if (main.question.start && channel_id === message.channel.id){
        result = await Data(message, "check", {});
        if (result === null){
            await Data(message, true, {id: "everyone", atQuestion: 1, solved_answer: 0 });
            answer = QuestionMaker(1);
        } else {
            answer = QuestionMaker(result.atQuestion);
        }
        if (answer.numero !== 4 && message.content.toLowerCase().includes(answer.reponse.toLowerCase())) { 
            const command = client.commands.get("question");
            console.log(answer.numero)
            switch(answer.numero) {
                case 1:
                    await Data(message, false, {id: "everyone", atQuestion: 2, solved_answer: 1})
                    message.channel.send(`Bravo <@${message.author.id}> ! \nTu as trouvé la réponse à la première question. Voici la deuxième avec un peu plus de recherche : \n\nQuel est la date du tout premier message du channel \"tryhard_1\" ?\n(réponse attendue sous la forme jour/mois/année)\n||@everyone||`)
                    break;
                case 2:
                    await Data(message, false, {id: "everyone", atQuestion: 3, solved_answer: 2})
                    message.channel.send(`Bravo <@${message.author.id}> ! \nTu as trouvé la réponse à la deuxième question. Voici la troisième et la dernière (pour cette fois ci 👀): \n\nCombien de rôle relié à l'ECOLE y a t-il sur le serv ?\n||@everyone||`)
                    break;
                case 3:
                    await Data(message, false, {id: "everyone", atQuestion: 3, solved_answer: 2})
                    message.channel.send(`Bravo à <@${message.author.id}> pour avoir trouvé la dernière question !\nL'heure est... 20h30 !\nPour résumer, rendez-vous le 1er janvier 2022 à 20h30 !\nDes bisooooous\n||@everyone||`)
                    break;                    
                default:
                    console.log("rien")
            }           
        } else if (answer.numero == 4) {
            for (let el of answer.reponse) {
                if (message.content.toLowerCase().includes(el.toLowerCase())) {
                    console.log("il contient !!")
                    message.delete()
                    Data(message, false, {id: message.author.id, atQuestion: 4, solved_answer: 4})
                    message.channel.send(`Bravo <@${message.author.id}> ! \nTu as trouvé la réponse à la quatrième question. Voici la cinquième : \n\nà trouver`);
                    break;
                }
            }
        } else {
            console.log("mauvaise réponse")
        }
    }
}

async function Data(message, first, objet) {
    const uri = "mongodb+srv://LucariO:pgEvpl9HODdkhlWo@cluster.ppk1w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        if (first == true) {
            console.log("create")
            await createListing(client, objet);
        } else if (first == "check") {
            console.log("check")
            return await checkListing(client, "everyone");
            
        } else if (first == "channel") {
            console.log("channel");
            return await checkListingChannel(client, message.channel.id);
        } 
        else if (first == false) {
            console.log("update")
            await updateListing(client, "everyone", objet);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
} 

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases : ");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function updateListing(client, id, updatedListing) {
    const result = await client.db("oct6").collection("Question").updateOne({id: id}, {$set : updatedListing})
}

async function createListing(client, newListing) {
    const result = await client.db("oct6").collection("Question").insertOne(newListing);

    console.log(`Nouvelle donnée avec cette id : ${result.insertedId}`)
}

async function checkListing(client, id, List) {
    return await client.db("oct6").collection("Question").findOne({id: id})
}

async function checkListingChannel(client, id, List) {
    return await client.db("oct6").collection("Question").findOne({channel_id: id})
}