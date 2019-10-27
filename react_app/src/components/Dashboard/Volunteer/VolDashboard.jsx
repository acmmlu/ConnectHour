import EventsVol from "./EventsVol";
import Cookies from "js-cookie";

import React from 'react';
import VolLayout from "./VolLayout";

//Dashboard for volunteer
class VolDashboard extends React.Component {
  
  // componentDidMount=()=> {
  //   console.log(Cookies.get()) 
  //   if (Cookies.get("token")) {
  //     console.log(Cookies.get("token")) 
  //   }
  //   else{
  //     this.props.history.push("/");
  //   }
  // }
 
  render() {
    return (       <React.Fragment>
      <VolLayout 
       history={ this.props.history}
      />
      
        <EventsVol 
        history={ this.props.history}
        />

      
      </React.Fragment>
    )
  }
}

export default VolDashboard;