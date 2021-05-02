
const STATE_REGISTER_NAME= 'register_name',
    STATE_REGISTER_DOB= 'register_dob',
    STATE_SIGNED= 'register_signed',
    STATE_STARTED = 'started',
    STATE_READY="ready";
function generateSession(){
    const id = new Date().getTime().toString()
    return {
        id:id,
        data:{
            id:id,
            state:STATE_STARTED,
            user:{
                name:null,
                dob:null,
                avatar:'http://data.cometchat.com.s3-eu-west-1.amazonaws.com/assets/images/avatars/spiderman.png'
            }
        }
    }

}
function getCacheSession(req,key){
    let sessions =  req.app.get('sessionCache')
    return sessions[key]
}
function saveSession(req,key,session){
    let sessions = req.app.get('sessionCache')
    if(sessions[key])
    delete sessions[key]
    sessions[key]=session
    req.app.set('sessionCache',sessions)
}
module.exports={
    STATE_REGISTER_NAME,STATE_REGISTER_DOB,STATE_SIGNED,STATE_STARTED,STATE_READY,
    getSession(req,res){

        let {key} = req.params


        //CHECK SESSION IS EXIST
        if(key)
        {

            let session = getCacheSession(req,key)
            if(session)
            return res.status(200).json(session)

        }

        //GENERATE if not exist or new
        let gSession=generateSession()
        saveSession(req,gSession.id,gSession.data)

        res.status(200).json(gSession.data)

    },
    getCacheSession,saveSession
}
