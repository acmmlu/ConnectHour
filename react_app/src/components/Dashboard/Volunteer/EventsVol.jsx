import React from "react";
import Events from "./EventsVol";
import axios from "axios";

import EventEdit from "../Organization/EventEdit";
import { Animated } from "react-animated-css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  closeButton
} from "reactstrap";
import VolLayout from "./VolLayout";
import { message } from "antd";

const block1 = {
  cursor: "pointer"
};

class EventsVol extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      EventsList: [
      
      ],
      RegisteredEvents: [
    
      ],
      showDetails: false,
      errmsg: "",
      showFormId: "",
      name:''
    };
    this.showForm = this.showForm.bind(this);
    this.showFormReset = this.showFormReset.bind(this);
    this.DisplayEvents = this.DisplayEvents.bind(this);
    this.ClearDisplay = this.ClearDisplay.bind(this);
  }

  componentDidMount() {
    const p=this
    let RegisteredEvents=this.state.RegisteredEvents
    axios
      .get("http://localhost:40951/event/volunteer/1")
      .then(function(response) {
        console.log(response.data)
        p.setState({ RegisteredEvents:response.data });
        console.log(RegisteredEvents)
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  showForm = (e) => {
   
    this.setState({ showFormId: e.target.id });
    this.setState({name:e.target.name})
   
  };
  showFormReset() {
    this.setState({ showFormId: "" });
  }
  DisplayEvents(Events) {
    this.state.EventsList = Events;

    this.setState({
      EventsList: this.state.EventsList
    });
    if (this.state.EventsList.length < 1) {
      this.setState({ errmsg: "No Results Found" });
    } else {
      this.setState({ errmsg: "" });
    }
  }
  ClearDisplay() {
    this.setState({
      EventsList: [],
      errmsg: "Search Events"
    });
  }
  render() {
    return (
      <React.Fragment>
        <div className="row  container text-center">
          <div className=" mt-2 mb-2  container">
            <SearchEvents
              DisplayEvents={this.DisplayEvents}
              ClearDisplay={this.ClearDisplay}
              
            />
          </div>
        </div>
        <div className="row">
          <div className="DisplayEvents container  col-6">
            <div className="display-4 text-center">
              <p>{this.state.errmsg}</p>{" "}
            </div>
            {this.state.EventsList.map(event => (
              <Searched
                event={event}
                key={event.id}
                showFormId={this.state.showFormId}
                showForm={this.showForm}
                showFormReset={this.showFormReset}
                name={this.state.name}
              ></Searched>
            ))}
          </div>

          <div className="DisplayRegisteredEvents col-3 shadow p-3 mb-5 bg-white rounded card container text-center float-right">
            <div className="display-4">Registered Events </div>

            {this.state.RegisteredEvents.map(event => (
              <Registered
                event={event}
                key={event.id}
                showFormId={this.state.showFormId}
                showForm={this.showForm}
                showFormReset={this.showFormReset}
                name={this.state.name}
              />
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class Searched extends React.Component {
  render() {
    return (
      <div className="card text-center shadow p-3 mb-5 bg-white rounded ">
        <h5 className="card-title">{this.props.event.EventName}</h5>
        <span>{this.props.event.date}</span>
        <hr />
        <p className="card-text">{this.props.event.Description}</p>
        <input
          className="m-auto btn btn-info col-3"
          id={this.props.event.id}
          onClick={this.props.showForm}
          value="Details"
          name='Searched'
          type="button"
        />
        <Modal isOpen={this.props.showFormId == this.props.event.id && this.props.name==='Searched'}>
          <ShowEventDetails
            eventdata={this.props.event}
            showFormReset={this.props.showFormReset}
            reg={true}
          />
        </Modal>
      </div>
    );
  }
}

class Registered extends React.Component {
  
  render() {
    console.log(this.props)
    return (
      <div className=" text-center card p-3 mb-5 bg-white rounded ">
        <h5 className="card-title">{this.props.event.EventName}</h5>
        <span>{this.props.event.date}</span>
        <hr />
        <p className="card-text">{this.props.event.Description}</p>
        <input
          className="m-auto btn btn-info col-3"
          id={this.props.event.id}
          name='Registered'
          onClick={this.props.showForm}
          value="Details"
          type="button"
        />

        <Modal isOpen={this.props.showFormId == this.props.event.id && this.props.name==='Registered'}>
          <ShowEventDetails
            eventdata={this.props.event}
            showFormReset={this.props.showFormReset}
            reg={false}
          />
        </Modal>
      </div>
    );
  }
}

class SearchEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        SearchString: "",
        city: "",
        date: ""
      }
    };
  }

  handleInputChange = e => {
    let formData = { ...this.state.formData };
    formData[e.target.name] = e.target.value;
    this.setState({
      formData
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="ml-5">
          <form
            className="form-inline my-2 my-lg-0 ml-5"
            onSubmit={e => this.onSubmit(e, this.state.formData)}
          >
            <input
              className="form-control m-2 mr-sm-2 shadow-sm"
              type="search"
              name="SearchString"
              placeholder="Search"
              aria-label="Search"
              onChange={this.handleInputChange}
            />

            {/* <input
              className="form-control m-2 mr-sm-2 shadow-sm"
              type="text"
              name="city"
              placeholder="City"
              onChange={this.handleInputChange} //http://asohafseofj/search?q=searchstring&date=aoehifaowjs&city=aiwuehofoawejidf
            /> */}
{/* 
            <input
              className="form-control m-2 mr-sm-2 shadow-sm"
              type="text"
              name="date"
              placeholder="Date"
              onChange={this.handleInputChange}
            /> */}
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
            >
              Search
            </button>
            <input
              className="form-control btn btn-danger m-2"
              value="cancel"
              type="button"
              onClick={this.props.ClearDisplay}
            />
          
          </form>
        </div>
      </React.Fragment>
    );
  }

  onSubmit = (e, formData) => {
    e.preventDefault();
console.log(formData)
    const p = this.props;
    axios
      .get(
        "http://localhost:40951/search?q=" +
          formData["SearchString"] +
          "&date=" +
          formData["city"] +
          "&city=" +
          formData["date"]
      )
      .then(function(response, props) {
        console.log(response);
        let Events = response.data;

        p.DisplayEvents(Events);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}

class ShowEventDetails extends React.Component {
  constructor(props){
    super(props)
        this.state={
          formData:this.props.eventdata
    
        }
      }
  render() {
    
    const data = this.props.eventdata;
    return (
      
      <React.Fragment>
        <div className="showDetails ">
          <form className="EventCreate  text-center" onSubmit={e => this.onSubmit(e)}>
    
            <div className="form-group  bg-info card row p-4">
              
              <span className=" pt-2 display-4 text-center "> {data.EventName}</span>
            </div>

            <div className="form-group   text-center  ">
              
              {data.Description}
            </div>
            <hr/>


<div className='text-center'>  Address: {data.Location}
  </div>
          
           
            <hr/>
            <div className="form-group rowtext-center">
            
              <span className=" pl-4 col-3"> On {data.date}</span>
              <span className="col-3 "> From {data.StartTime} Hours  to {data.EndTime} Hours</span>
              
            </div>
            <div className='m-auto text-center'>
            {this.props.reg &&<input
              className=" btn btn-success m-2"
              value="Register"
              type="submit"
            />}
            <input
              className="btn btn-danger m-2"
              value="Cancel"
              type="button"
              onClick={this.props.showFormReset}
            /></div>
         
       
          </form>
        </div>
      </React.Fragment>
    );
   
  }
  onSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.formData);
    const formData=this.state.formData
    axios
      .post(
        "http://localhost:40951/event/register/1/"+formData['id'] ,
        formData
      )
      .then(function(response, props) {
        console.log(response);
        
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}
export default EventsVol;
