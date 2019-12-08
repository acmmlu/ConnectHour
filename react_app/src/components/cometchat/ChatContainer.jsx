import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import ChatBox from "./ChatBox";

import "react-toastify/dist/ReactToastify.min.css";


class ChatContainer extends Component {
  state = {
    user: {}
   
  };

  componentDidMount() {
    if (this.props.user.authToken !== "") {
      CometChat.getLoggedinUser().then(user => {
        this.setState({ user: user });
      });
    }
    
    let u = this.state.user;
    u.uid = this.props.uid;
    this.setState({user: u});
  }


  render() {
    if (this.props.user.authToken === "")
      return (
        <React.Fragment>
        </React.Fragment>
      );

    


    return (
      <React.Fragment>
        <div className='row'>
  
            <div className="col-md-12 col-xl-12 col-sm-12 col-xs-12 p-0">
              <div className="border-0 row chat-box bg-white">
                <ChatBox
                  user={this.state.user}
          
                />
              </div>
            </div>
      
        </div>
      

       
      </React.Fragment>
    );
  }
}


export default ChatContainer;
