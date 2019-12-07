import React, { Component } from "react";
import EventEdit from "./EventEdit";
import EventCreate from "./EventCreate";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import "../../App.css";
import moment from "moment";

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      eventList: [],
      showEdit: false,
      editFormId: ""
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
    this.setState({
      showEdit: !this.state.showEdit
    });
    this.setState({ editFormId: e.target.id });
  };
  openEditReset() {
    this.setState({
      showEdit: !this.state.showEdit
    });
    this.setState({ editFormId: "" });
  }

  componentDidMount = () => {
    if (Cookies.get("token") && Cookies.get("type") === "/odashboard/") {
      const ID = jwt_decode(Cookies.get("token")).uid;
      const p = this;
      axios
        .get("/event/organizer/" + ID)
        .then(function(response) {
          p.setState({ eventList: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      this.props.history.push("/");
    }
  };

  addEvent(event) {
    let eventList = this.state.eventList;
    eventList.push(event);
    this.setState({ eventList: this.state.eventList });
  }

  render() {
    return (
      <React.Fragment>
        <div className=" container-fluid">
        <div className='row ml-2  justify-content-left'>
            <div className='col ' style={{fontSize:'50px'}}>
              Events
            </div>
          </div>
          <hr/>
          <div className="row ">
            <div className="col">
              <button
                onClick={this.toggleCreateForm}
                className="btn btn-lg btn-info m-2 "
              >
                <i className="fas fa-calendar-plus"></i>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="container-fluid">
                <div className="row">
                  <div className="col">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col">
                          <div className="DisplayRecommended container justify-content-left">
                            <div className="row">
                              {this.state.eventList.map(event => (
                                
                                <Event
                                  key={event.id}
                                  editFormId={this.state.editFormId}
                                  showEdit={this.state.showEdit}
                                  event={event}
                                  history={this.props.history}
                                  openEdit={this.openEdit}
                                  ID={jwt_decode(Cookies.get("token")).uid}
                                  openEditReset={this.openEditReset}
                                ></Event>
                              ))}{" "}
                            </div>
                          </div>
                        </div>

                        <Modal isOpen={this.state.showForm}>
                          <ModalHeader>
                            <div className="text-center text-info">
                              Create Event
                            </div>
                          </ModalHeader>
                          <ModalBody>
                            <EventCreate
                              addEvent={this.addEvent}
                              toggleCreateForm={this.toggleCreateForm}
                              ID={
                                Cookies.get("token")
                                  ? jwt_decode(Cookies.get("token")).uid
                                  : ""
                              }
                            />
                          </ModalBody>
                        </Modal>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registered_vol: [],
      showreg: false,
      regId: ""
    };
    this.togglereg = this.togglereg.bind(this);
    this.getRegisteredVolunteers = this.getRegisteredVolunteers.bind(this);
  }

  togglereg() {
    this.setState({
      showreg: !this.state.showreg
    });
  }
  componentDidMount() {
    let thisstate = this;

    axios
      .get(
        "/event/organizer/registered/" +
          this.props.event.id
      )
      .then(function(response) {
        thisstate.setState({ registered_vol: response.data });
      })

      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    const showreg = this.state.showreg;
    return (
      <div className="p-3 col-xl-4 col-lg-6 col-md-12">
        <div className="card event-card text-center shadow bg-white rounded">
          <h5 className="card-title">
            {this.props.event.EventName}{" "}
            <span className="badge badge-pill badge-primary">
              {this.props.event.Tag}
            </span>
          </h5>
          [ {this.state.registered_vol.length} Registered Vounteer(s)]
          <hr />
          <p className="card-text">
            {this.props.event.Description.length > 58
              ? this.props.event.Description.substring(1, 58) + "..."
              : this.props.event.Description}
          </p>
          <div className="text-center">
            {" "}
            <span className="text-weight-bold">Address: </span>
            {this.props.event.StreetNumber}, {this.props.event.StreetName},{" "}
            {this.props.event.City}, {this.props.event.State},{" "}
            {this.props.event.Zip}
          </div>
          <div className="form-group col-9  text-center mx-auto ">
            {" "}
            Date: {moment(this.props.event.StartTime).format("MM-DD-YYYY")}
          </div>
          <div className="form-group col-9  text-center mx-auto">
            Starting At: {moment(this.props.event.StartTime).format("HH:mm")}
          </div>
          <div className="m-auto   justify-content-center row text-center">
            <input
              className="m-auto btn btn-info "
              id={this.props.event.id}
              onClick={this.props.openEdit}
              value="Edit Event"
              type="button"
            />

            <input
              className="m-2 mt-2 btn btn-danger "
              id={this.props.event.id}
              onClick={this.deleteEvent}
              value="Cancel Event"
              type="button"
            />
          </div>
          <div>
            {/* <div>
                    {this.state.registered_vol.map(vol => (
                      <div key={this.props.event.id} className="text-center m-auto">
                        <div>
                          <span>Name: </span>
                          {vol.FirstName} {vol.LastName}
                        </div>
                        <div>
                          <span>Email: </span>
                          {vol.Email}
                        </div>
                      </div>
                    ))}
                  </div> */}

            <Dropdown isOpen={showreg} toggle={this.togglereg}>
              <DropdownToggle className="bg-info" caret>
                Show Registered Volunteers
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>
                  Registered Volunteers [ {this.state.registered_vol.length} ]
                </DropdownItem>

                {this.state.registered_vol.map(vol => (
                  <DropdownItem
                    key={this.props.event.id}
                    onClick={this.volProfile}
                  >
                    <div className="text-center m-auto">
                      <div className="">
                        <span>Name: </span>
                        {vol.FirstName} {vol.LastName}
                      </div>
                      <div className="">
                        <span>Email: </span>
                        {vol.Email}
                      </div>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* <Button
            
              id={this.props.event.id}
              onClick={this.getRegisteredVolunteers}
              type="button"
            >
              Launch Popover
            </Button>
            
           */}
            <div>
              {/* <Button id={this.props.event.id} type="button">
        Launch Popover
      </Button>
      <Popover placement="bottom" isOpen={this.state.showreg} target={this.props.event.id} toggle={this.toggleedit}>
        <PopoverHeader>Popover Title</PopoverHeader>
        <PopoverBody>
        <div>
                    {this.state.registered_vol.map(vol => (
                      <div key={this.props.event.id} className="text-center m-auto">
                        <div>
                          <span>Name: </span>
                          {vol.FirstName} {vol.LastName}
                        </div>
                        <div>
                          <span>Email: </span>
                          {vol.Email}
                        </div>
                      </div>
                    ))}
                  </div>
        </PopoverBody>
      </Popover> */}
            </div>
          </div>
        </div>
        {this.props.event.id === this.props.editFormId && (
          <Modal isOpen={this.props.showEdit} centered>
            <ModalBody>
              <EventEdit
                eventdata={this.props.event}
                openEditReset={this.props.openEditReset}
                ID={jwt_decode(Cookies.get("token")).uid}
              />
            </ModalBody>
          </Modal>
        )}
      </div>
    );
  }

  getRegisteredVolunteers = e => {
    let thisstate = this;

    axios
      .get("/event/organizer/registered/" + e.target.id)
      .then(function(response) {
        thisstate.setState({ registered_vol: response.data });
      })

      .catch(function(error) {
        console.log(error);
      });
  };

  volProfile = () => {
    const id = this.state.registered_vol[0].volID;
    const t = this;
    t.props.history.push({
      pathname: "/odashboard/profile/volunteer/" + id,
      state: { vid: id }
    });
  };

  deleteEvent = e => {
    let eventid = e.target.id;
    axios
      .delete(
        "/event/" +
          jwt_decode(Cookies.get("token")).uid +
          "/" +
          eventid
      )
      .then(function(response, props) {
        window.location.reload();
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}

export default Events;
