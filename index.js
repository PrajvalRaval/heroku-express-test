const PORT = process.env.PORT || 3000;
const express = require("express");
const axios = require('axios');
const app = express();

var client = require('redis').createClient(process.env.REDIS_URL);

client.on('error', (err) => {
  console.log("Error " + err);
});

app.use(express.json());

var result;

const flashBriefingMessage = async () => {
  await axios
    .get(`https://bots.rocket.chat/api/v1/channels.anonymousread?roomName=flashbriefingchannel`)
    .then((res) => {

      result = JSON.stringify( {
        uid: res.data.messages[0]._id,
        updateDate: res.data.messages[0].ts,
        titleText: "RC FLASH BRIEFING",
        mainText: res.data.messages[0].msg,
        redirectionUrl: "https://bots.rocket.chat/channel/flashbriefingchannel"
      });

    })
    .catch((err) => {
      console.log(err.message);
    });
};


app.get('/', async (req, res) => {
  try {
    await flashBriefingMessage();
    const resultJSON = JSON.parse(result);
    return res.status(200).json(resultJSON);
  } catch {
    //this will eventually be handled by your error handling middleware
    res.send("ERROR");
  }
})


app.listen(PORT, function () {
  console.log(`Listening on Port ${PORT}`);
});
