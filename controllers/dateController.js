const { Products } = require("../models")
const schedule = require("node-schedule")
const fs = require("fs")
module.exports = () => {
    const month = schedule.scheduleJob('0 0 0 * * *', async function() {
        var text = fs.readFileSync('test.txt', 'utf8')

        console.log('guni pozya');
    });
}