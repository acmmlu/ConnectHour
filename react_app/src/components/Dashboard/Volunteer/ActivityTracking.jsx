import React from 'react'
import axios from 'axios'
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

class ActivityTracking extends React.Component{
 constructor(props){
   super(props);
   this.state={
       activityData:{}
   }
 }
 componentDidMount(){
    if (Cookies.get("token") && Cookies.get("type")==='/vdashboard/') {
    const ID= (jwt_decode(Cookies.get("token"))).uid
    const p = this;
     axios
     .get("/event/activity/"+ID)
     .then(function(response) {
         console.log(response)
         //this.setState({activityData:response.data})
     })
     .catch(function(error) {
       console.log(error);
     });
    }
    else{
       this.props.history.push("/");
    }
 }
 render(){
   return(
     <div className = "event-item">
     <p className="name">Event Name</p>
     <p>Event Description</p>
     <p>Organizer</p>
     <p>StreetNumber</p>
     <p>City</p>
     <hr/>
     </div>
   );
   }
}

export default ActivityTracking