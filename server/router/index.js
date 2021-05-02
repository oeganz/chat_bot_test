const route = require('express').Router();
const {session,chat} = require('../controller')

route.get('/session/:key',session.getSession)
route.get('/session',session.getSession)
route.post('/chat/:sessionId',chat.listener)
route.get('/chat',chat.chats)
route.get('/chat/:id',chat.chats)
module.exports=route;
