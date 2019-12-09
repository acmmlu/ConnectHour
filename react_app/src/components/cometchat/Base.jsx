import React, { Component } from "react";
import { CometChat } from "@cometchat-pro/chat";
import { CC_APP_ID, CC_API_KEY, CC_API_REGION } from "../../constants";
import ChatContainer from "./ChatContainer";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";


var groupsRequest = new CometChat.GroupsRequestBuilder()
  .joinedOnly(true)
  .setLimit(50)
  .build();

export default class Base extends Component {
  state = {
    username: "",
    authToken: "",
    errors: [],
    formData: {},
    RegisteredEvents: [],
    groupID: [],
    name: ""
  };

  componentDidMount() {
    //initialize cometchat
  
    CometChat.init(
      CC_APP_ID,
      new CometChat.AppSettingsBuilder()
        .subscribePresenceForAllUsers()
        .setRegion(CC_API_REGION)
        .build()
    );
    if (Cookies.get("token") && Cookies.get("type") === "/vdashboard/") {
        //cometchat initialze
      
            console.log("Initialization completed successfully");
            // You can now call login function.
            var UID = jwt_decode(Cookies.get("token")).uid;
            const p = this;
           
            //getformdata
            axios
              .get("/volunteer/" + UID)
              .then(function(response) {
                console.log('new',response.data)
                p.setState({ formData: response.data });
                p.setState({ name: response.data.FirstName });
                let nam= response.data.FirstName 
                console.log(nam,UID)
                p.setState({ username: UID+nam+UID });

               
                
                //get registered events
                axios
                  .get("/event/volunteer/" + UID)
                  .then(function(response) {
                    const groupID = p.state.groupID;
                    console.log(response.data)
                    if (response.data.length > 0) {
                      response.data.map(event => groupID.push((String(event.id))));
                      //login with name id on formdata
                p.loginUser();
  
                    }
                    p.setState({ RegisteredEvents: response.data });
                    
                  })
                  .catch(function(error) {
                    console.log(error);
                  });
              })
              .catch(function(error) {
                console.log(error);
              });
          
       
      } else {
        this.props.history.push("/");
      }

      document.getElementById("volbase").style.overflow = "hidden";
  }

  loginUser() {
    const username = this.state.username;
    CometChat.login(username, CC_API_KEY).then(
      user => {
        this.setState({
          username: username,
          authToken: user.authToken,
          loginBtnDisabled: false
        });
        console.log('login',username)
        this.joinedGroups(this.state.groupID);
      },
      error => {
        this.createUser();
        this.setState({ error: "Username and/or password is incorrect." });
      }
    );
  }
  createUser = () => {
    var endPoint = "https://api-us.cometchat.io/v2.0/users";
    var data = {
      uid: this.state.username,
      name: this.state.name
    };

    var xhr = new XMLHttpRequest();
    let p = this;
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);

        p.createAuthToken();
      }
    });

    xhr.open("POST", endPoint);
    xhr.setRequestHeader("appid", CC_APP_ID);
    xhr.setRequestHeader("apikey", CC_API_KEY);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("accept", "application/json");

    xhr.send(JSON.stringify(data));
  };

  createAuthToken() {
    var data = null;
    let p = this;
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
        p.loginUser();
      }
    });

    xhr.open(
      "POST",
      "https://api-us.cometchat.io/v2.0/users/" +
        this.state.username +
        "/auth_tokens"
    );
    xhr.setRequestHeader("appid", CC_APP_ID);
    xhr.setRequestHeader("apikey", CC_API_KEY);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("accept", "application/json");

    xhr.send(data);
  }

  handleLogout = () => {
    CometChat.logout().then(
      () => {
        window.location.reload(true);
      },
      error => {
        window.location.reload(true);
      }
    );
  };

  joinedGroups(groupID) {
    groupsRequest.fetchNext().then(
      groupList => {
        let groupListId = [];
        /* groupList will be the list of Group class */
        console.log("Groups list fetched successfully", groupList);
        /* you can display the list of groups available using groupList */
        if (groupList.length > 0) {
          groupList.forEach(element => groupListId.push(element["guid"]));
        }
        let difference = groupID.filter(x => !groupListId.includes(x));
        console.log(groupListId, groupID, difference);

        if (difference.length > 0) {
          difference.forEach(element => this.joinNewGroups(String(element)));
       

        }
      },
      error => {
        console.log("Groups list fetching failed with error", error);
      }
    );
  }
  joinNewGroups(element) {
    var GUID = element;
    var password = "";
    var groupType = CometChat.GROUP_TYPE.PUBLIC;

    CometChat.joinGroup(GUID, groupType, password).then(
      group => {
        console.log("Group joined successfully:", group);
        this.state.groupID.push(GUID);
      },
      error => {
        console.log("Group joining failed with exception:", error);
      }
    );
  }

  render() {
    const userstate = this.state;
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-12 col-xl-12">
              <div className='chatContainer'>
                  {this.state.username !== "" && (
                    <ChatContainer
                      user={userstate}
                      uid={this.state.username}
                      handleLogout={this.handleLogout}
                    />
                  )}
               </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
