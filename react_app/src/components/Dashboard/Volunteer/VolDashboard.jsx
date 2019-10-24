import EventsVol from "./EventsVol";

import React from 'react';
import VolLayout from "./VolLayout";


class VolDashboard extends React.Component {
  
   
 
  render() {
    return (       <React.Fragment>
      <VolLayout/>
        <EventsVol />

      
      </React.Fragment>
    )
  }
}

export default VolDashboard;