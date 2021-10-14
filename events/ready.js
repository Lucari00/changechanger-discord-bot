module.exports = {
    name: 'ready',
    once: "true",
    execute(client) {
        console.log("je suis up b")
        client.user.setActivity("👀");
        client.user.setStatus('invisible');
    },
};