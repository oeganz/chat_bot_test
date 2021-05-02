const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const Schema=mongoose.Schema
const NAME='m_chat'
/*
EX:PAYLOAD
{
    text: "Hello there",
        id:1,
    sender: {
        name: "Ironman",
        uid: "user2",
        avatar: "https://data.cometchat.com/assets/images/avatars/ironman.png",
        }
}
*/
const chatSchema = mongoose.Schema({text:String}, { strict: false})

const Chat = mongoose.model(NAME, chatSchema)
Chat.NAME=NAME
Chat.ensureIndexes(function(err) {
        if (err)
            console.error(err);
        else
            console.log(`create ${NAME} index successfully`);
    });
module.exports=Chat
