module.exports.help = { name: "question"}

module.exports.question = QuestionMaker(0)

module.exports.run = async (client, message, args) => {
    module.exports.question = QuestionMaker(args)
}

function QuestionMaker(question) {
    switch(question) {
        case 0:
            return {start: false, numero: 0, reponse: ""}
        case 1:
            return {start: true, numero: 1, reponse: "01/01/2022"}
        case 2:
            return {start: true, numero: 2, reponse: "16/03/2020"}
        case 2:
            return {start: true, numero: 2, reponse: "42"}
    }
} 
