import React from "react";
import axios from "axios";
import "./App.css";
import 'react-chatbox-component/dist/style.css';
import {ChatBox} from 'react-chatbox-component';
// const url =''
const url ='http://localhost:5000'
export default class App extends React.Component {

  state = {
    messages : [],
    user:{
      uid : 4123123123,
      name:"oeganz",
      avatar:"http://data.cometchat.com.s3-eu-west-1.amazonaws.com/assets/images/avatars/spiderman.png"
    },
    session:'',
    loading:true,
    error:null
  };
  componentDidMount() {

    axios.get(url+"/api/session").then((response) => {
        if(response.data )
        {
            let res = response.data
            this.setState({
                user: {uid:res.id,name:res.id,avatar:res.user.avatar},
                session:res.id,
                messages:[{
                    text: "Hello there!! say something to activate me!!",
                    sender: {
                        name: "Bot",
                        uid: 123123123123,
                        avatar: "https://data.cometchat.com/assets/images/avatars/ironman.png",
                    }
                }],
                loading:false
            })
        }else{
            this.setState({
                loading:false,
                error:'Cant Get payload response please refresh'
            })

        }
    }).catch(e=>
        this.setState({
        loading:false,
        error:e.message
    }));

  }
    sendMessage = (msg)=> {

        let nmessagess=this.state.messages
        const newMsg =
            {
                text: msg,
                sender: {
                    name: this.state.user.name,
                    uid: this.state.user.uid,
                    avatar:  this.state.user.avatar,
                }
            }
        nmessagess.push(newMsg)

          this.setState({
              messages:nmessagess
          })

        axios.post(url+"/api/chat/"+this.state.session,{
            "text":msg
        }).then((response) => {

            if(response.data )
            {
                let res = response.data

                nmessagess.push(res)
                this.setState({
                    loading:false,
                    messages: nmessagess
                })
            }else{
                this.setState({
                    loading:false,
                    messages: 'Cant load Response'
                })
            }
        }).catch(e=>
            {
                this.setState({
                    loading:true,
                    messages:e.message
                })
            }
        );
    }
  render() {

    let state =this.state;
    let { messages,user,session,loading,error } = state;

      let errView
      if(error)
          errView=<div>
              {error}
              <button onClick={() => window.location.reload()}>reload</button>
          </div>




    return (
        <div>
            <div className='chat-header'>
                <h5>Ganz Chat Bot</h5>

            </div>
            {errView}
            <ChatBox
                isLoading={loading}
                messages={messages}
                user={user}
                onSubmit={this.sendMessage}
            />

        </div>
    );
  }
}
