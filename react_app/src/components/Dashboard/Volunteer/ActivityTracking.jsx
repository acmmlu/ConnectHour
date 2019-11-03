import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { Modal } from "reactstrap";

import VolLayout from "./VolLayout";

class ActivityTracking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityData: []
    };
  }
  componentDidMount() {
    if (Cookies.get("token") && Cookies.get("type") === "/vdashboard/") {
      const ID = jwt_decode(Cookies.get("token")).uid;
      const p = this;
      axios
        .get("http://localhost:40951/event/activity/" + ID)
        .then(function(response) {
          console.log(response);
          p.setState({ activityData: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      this.props.history.push("/");
    }
  }
  render() {
    return (
      <>
        <VolLayout />
        <div className='text-center display-2'> Past Events</div>
        <div className='row EventsVol'>
        
        <div className="  col-8 activity">
          {this.state.activityData.map(activityData => (
            //call the registered component
            <PastEvents
              activityData={activityData}
              key={activityData.EventId}
            />
          ))}
        </div>
        </div>
      </>
    );
  }
}

class PastEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eid: ""
    };
    this.toggleeid = this.toggleeid.bind(this);
  }

  toggleeid(e) {
    if(e.target.id){
    this.setState({ eid: e.target.id });
    }
    else{this.setState({ eid: ''});}
  }
 
  render() {
    return (
      <>

        <div className="card text-center shadow p-3 mb-5 bg-white rounded ">
          <h5 className="card-title">{this.props.activityData.EventName}</h5>
          <span>{this.props.activityData.date}</span>
          <hr />
          <p className="card-text">{this.props.activityData.Description}</p>
          <input
            className="m-auto btn btn-info col-3"
            id={this.props.activityData.EventId}
            onClick={this.toggleeid}
            value="Details"
            type="button"
          />
          <Modal isOpen={this.state.eid == this.props.activityData.EventId}>
             <ShowEventDetails
        eventdata={this.props.activityData}
        toggleeid={this.toggleeid}

      /> 
          </Modal>
        </div>
      </>
    );
  }
}

class ShowEventDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.eventdata
    };
  }
 
  render() {
    const data = this.props.eventdata;
    const t = new Date(data.StartTime);
    return (
      <React.Fragment>
        <div className="showDetails ">
         
            <div className="form-group  bg-info card row p-4">
              <span className=" pt-2 display-4 text-center ">
                {" "}
                {data.EventName}
              </span>
            </div>

            <div className="form-group   text-center  ">{data.Description}</div>
            <hr />

            <div className="text-center"> Address: {data.City}</div>

            <hr />
            <div className="form-group col-9  m-auto ">
              <span className=" ">
                {" "}
                Date: {t.getUTCMonth()}/{t.getUTCDate()}/{t.getFullYear()}{" "}
                
                Starting At- {t.getUTCHours()}:{t.getMinutes()}
              </span>
            </div>
            <div className="m-auto text-center"> <input
                  className="btn btn-danger m-2"
                  value="Cancel"
                  type="button"
                  onClick={this.props.toggleeid}
                /></div>
           
        </div>
      </React.Fragment>
    );
  }

}


export default ActivityTracking;
