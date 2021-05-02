const {Chat} = require('../model')
const {STATE_REGISTER_NAME,STATE_REGISTER_DOB,STATE_SIGNED,STATE_STARTED,STATE_READY,saveSession,getCacheSession} = require('./session')
const validateDate = require("validate-date");
require('dotenv').config()
const POSITIVE_CHAT = process.env.POSITIVE_CHAT //CONFIGURABLE POSITIVE VALUE
const NEGATIVE_CHAT = process.env.NEGATIVE_CHAT //CONFIGURABLE NEGATIVE_CHAT VALUE

function _convertPayload(session,text,isbot=false) {
    let id = session.id
    let avatar = "https://data.cometchat.com/assets/images/avatars/spiderman.png"
    if(isbot)
    {
        id=`Bot-${id}`
        avatar=`https://data.cometchat.com/assets/images/avatars/ironman.png`
    }

    return {
        text:text,
        sender:{
            name:id,
            uid:id,
            avatar: avatar
        },
        createAt:new Date()
    }
}
function _saveToMongo(payload) {

    Chat.create(payload)
}
function _calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - new Date(birthday).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
function _calculateNextBirthday(v) { // birthday is a date
    var one_day = 1000 * 60 * 60 * 24
    let varr = v.split('-')
    var birthday = new Date(parseInt(varr[0]), parseInt(varr[1]), parseInt(varr[2]));
    var today = new Date();
    birthday.setFullYear(today.getFullYear());
    if (today > birthday) {
        birthday.setFullYear(today.getFullYear() + 1);
    }
   //Calculate difference between days
   return Math.floor((birthday - today) / (one_day))
}

function _botLogic(session,text){

    console.log('STATE',session.state)
    switch (session.state) {
        case STATE_STARTED:{
            session.state=STATE_READY
            return {session:session,text:'Hello there!!, I\'m The fortune teller Bot, I can tell your age. Do you like to try me?'}
        }
        case STATE_READY:{
            if(POSITIVE_CHAT.toString().toLowerCase().includes(text)){
                session.state=STATE_REGISTER_NAME
                return {session:session,text:'Awesome!!, Please Say Your Name..'}
            }else if (NEGATIVE_CHAT.toString().toLowerCase().includes(text)){
                return {session:session,text:'Awww!!, Looks Like you Dont Believe me.. Goodbye 👋👋'}
            } else{
                return {session:session,text:`Sorry i dont understand what you say, please chat me with ${POSITIVE_CHAT} or ${NEGATIVE_CHAT}` }
            }
        }
        case STATE_REGISTER_NAME :{
            session.user.name=text
            session.state=STATE_REGISTER_DOB
            return {session:session,text:`Awesome!!, So your name is.. ${text}. Can you Say Your Date Of Birth?`}
        }
        case STATE_REGISTER_DOB :{
            if(validateDate(text, "boolean"))
            {
                session.user.dob=text
                session.state=STATE_SIGNED
                let age = _calculateAge(text)
                let days = _calculateNextBirthday(text)
                return {session:session,text:`Hmmm!!, Let me check my crystal ball.. !@#KSIWM@! (BOT Spelling some magic words~~~ )... AHAA!! Sorry to Keep You waiting ${session.user.name}, your age is ${age} Years old and your next birthday is ${parseInt(days)} more days !! , Do you like to Try Again?`}
            }else{
                return {session:session,text:`Ooops!!,I can't understand "${text}" Please chat me with these format YYYY-MM-DD EX: 1992-10-30`}
            }
        }
        case STATE_SIGNED :{
            if(POSITIVE_CHAT.toString().toLowerCase().includes(text)){
                session.state=STATE_REGISTER_NAME
                return {session:session,text:'Awesome!!, Please Say Your Name..'}
            }else if (NEGATIVE_CHAT.toString().toLowerCase().includes(text)){
                return {session:session,text:'Awww!!, Looks Like you Dont Believe me.. Goodbye 👋👋'}
            } else{
                return {session:session,text:`Sorry i dont understand what you say, please chat me with ${POSITIVE_CHAT} or ${NEGATIVE_CHAT}` }
            }
        }

    }


}
/*{
    text: "Hello there",
        id:1,
    sender: {
    name: "Ironman",
        uid: "user2",
        avatar: "https://data.cometchat.com/assets/images/avatars/ironman.png",
    }
}*/
module.exports={
    listener(req,res){
        const {sessionId} = req.params
        const {text} = req.body



        if(!sessionId)
           return  res.status(401).send('Session not set')
        if(!text)
            return res.status(400).send('Payload not set')

        //CHECK SESSION EXIST
        let session =getCacheSession(req,sessionId)
        if(!session)
            return res.status(401).send('Session not Exist')



        //SAVE USER CHAT
        _saveToMongo(_convertPayload(session,text))

        //BOT CHAT LOGIC
        let result = _botLogic(session,text);
        console.log('RESULT=>',result)


        //SAVE BOT CHAT
        saveSession(req,result.session.id,result.session)
        let response = _convertPayload(result.session,result.text,true)
        _saveToMongo(response)

        res.status(200).json(response)
    },
    async chats(req, res) {
        const {id} = req.params

        let response
        if(id)
        response = await Chat.findById(id)
        else  response = await Chat.find({})

        res.status(200).json(response)
    }
}
