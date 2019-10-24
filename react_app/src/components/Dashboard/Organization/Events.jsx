import React, { Component } from "react";
import EventCreate from "./EventCreate";
import EventEdit from "./EventEdit";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  closeButton
} from "reactstrap";
import { Animated } from "react-animated-css";
import axios from "axios";
import OrgLayout from "./OrgLayout";
import { BrowserRouter, Link, Route } from "react-router-dom";
class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      eventList: [
      ],
      editFormId: '',
    };
    this.addEvent = this.addEvent.bind(this);
    this.toggleCreateForm = this.toggleCreateForm.bind(this);
    this.openEdit = this.openEdit.bind(this);
    this.openEditReset = this.openEditReset.bind(this);
  }
  toggleCreateForm() {
    this.setState({
      showForm: !this.state.showForm,
      editFormId: ""
    });
  }
  openEdit = e => {
    this.setState({ editFormId: e.target.id });
   
  };
  openEditReset() {
    this.setState({ editFormId: "" });
  }

  componentDidMount=()=> {
    const p= this
    axios
      .get("http://localhost:40951/event/organizer/1")
      .then(function(response) {
        console.log(response)
        p.setState({ eventList: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  componentDidMount() {
    console.log(this.state.eventList);
  }
  addEvent(event) {
    let eventList = this.state.eventList;
    eventList.push(event);
    this.setState({ eventList: this.state.eventList });
  }

  render() {
    return (
      <React.Fragment>
        <div className="container col-6 text-center Events">
          <button onClick={this.toggleCreateForm} className="btn btn-info m-2 ">
            Create Event
          </button>

          {this.state.eventList.map(event => (
            <Animated
              key={event.id}
              animationIn="bounceInRight"
              animateOnMount={false}
              isVisible={true}
            >
              <Event
                key={event.id}
                editFormId={this.state.editFormId}
                event={event}
                openEdit={this.openEdit}
                openEditReset={this.openEditReset}
              ></Event>
            </Animated>
          ))}

          <div
            className={
              !this.state.showForm
                ? "EventCreate displaynone"
                : "EventCreate displayblock"
            }
          >
            <button
              onClick={this.toggleCreateForm}
              className="btn btn-danger m-2 "
            >
              Close
            </button>
            <EventCreate
              addEvent={this.addEvent}
              toggleCreateForm={this.toggleCreateForm}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class Event extends Component {
  render() {  

    return (
      <div className="card m-2 shadow p-3 mb-5 bg-white rounded Eventlist">
        <h5 className="card-title">{this.props.event.EventName}</h5>
        <span>{this.props.event.date} </span>
        <hr />
        <p className="card-text">{this.props.event.Description}</p>
        {this.props.editFormId != this.props.event.id && (
          <input
            className="m-auto btn btn-info col-3"
            id={this.props.event.id}
            onClick={this.props.openEdit}
            value="Edit Event"
            type="button"
          />
        )} 
        {this.props.editFormId == this.props.event.id && (
          <EventEdit
            eventdata={this.props.event}
            openEditReset={this.props.openEditReset}
          /> 
        )}
      </div>
    );
  }
}

export default Events;
