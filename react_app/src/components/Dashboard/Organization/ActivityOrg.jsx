import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { Modal } from "reactstrap";
import moment, { min } from "moment";
import {
  ModalBody,
  ModalHeader,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

class ActivityOrg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityData: []
    };
  }
  componentDidMount() {
    if (Cookies.get("token") && Cookies.get("type") === "/odashboard/") {
      const ID = jwt_decode(Cookies.get("token")).uid;
      const p = this;
      axios
        .get("/event/activityOrg/" + ID)
        .then(function(response) {
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
        <div className="container-fluid mt-5">
          <div className="row">
            <div className="col">
              <div className="DisplayRecommended container justify-content-left">
                <div className="row">
                  <h4 className="float-left"> Past Events</h4>
                </div>
                <div className="row">
                  {this.state.activityData.map(activityData => (
                    //call the registered component
                    <PastEvents
                      activityData={activityData}
                      key={activityData.EventId}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <VolLayout />
        
        <div className="row EventsVol">
          <div className="  col-8 activity">
            {this.state.activityData.map(activityData => (
              //call the registered component
              <PastEvents
                activityData={activityData}
                key={activityData.EventId}
              />
            ))}
          </div>
        </div>*/}
      </>
    );
  }
}

class PastEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eid: "",
      registered_vol: [],
      showreg: false,
      regId: ""
    };
    this.toggleeid = this.toggleeid.bind(this);
    this.togglereg = this.togglereg.bind(this);
  }
  componentDidMount() {
    let thisstate = this;

    axios
      .get(
        "/event/organizer/registered/" +
          this.props.activityData.id
      )
      .then(function(response) {
        thisstate.setState({ registered_vol: response.data });
        console.log(
          thisstate.state.registered_vol,
          thisstate.props.activityData.EventName
        );
      })

      .catch(function(error) {
        console.log(error);
      });
  }
  toggleeid(e) {
    if (e.target.id) {
      this.setState({ eid: e.target.id });
    } else {
      this.setState({ eid: "" });
    }
  }
  togglereg() {
    this.setState({
      showreg: !this.state.showreg
    });
  }

  render() {
    const showreg = this.state.showreg;
    return (
      <>
        {" "}
        <div className="p-3 col-xl-4 col-lg-6 col-md-12">
          <div className="card text-center  event-card shadow bg-white rounded ">
            <h5 className="card-title">
              {this.props.activityData.EventName}
              <span className="badge badge-pill badge-primary">
                {this.props.activityData.Tag}
              </span>
            </h5>
            [ {this.state.registered_vol.length} Registered Vounteer(s)]
            <hr />
            <p className="card-text">
              {this.props.activityData.Description.length > 58
                ? this.props.activityData.Description.substring(1, 58) + "..."
                : this.props.activityData.Description}
            </p>
            <div className="text-center">
              {" "}
              <span className="text-weight-bold">Address: </span>
              {this.props.activityData.Streetnumber},{" "}
              {this.props.activityData.Streetname},{" "}
              {this.props.activityData.City}, {this.props.activityData.State},{" "}
              {this.props.activityData.Zip}
            </div>
            <div className="form-group col-9  text-center m-auto ">
              <p>
                {" "}
                Date:{" "}
                {moment(this.props.activityData.StartTime).format("MM-DD-YYYY")}
              </p>{" "}
              <p>
                Starting At:{" "}
                {moment(this.props.activityData.StartTime).format("HH:mm")}
              </p>
            </div>
            <div className="m-auto row text-center">
              <input
                className="m-auto btn btn-info col"
                id={this.props.activityData.EventId}
                onClick={this.toggleeid}
                value="Details"
                type="button"
              />
            </div>
            <Dropdown isOpen={showreg} toggle={this.togglereg}>
              <DropdownToggle className="bg-info" caret>
                Show Registered Volunteers
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>
                  Registered Volunteers [ {this.state.registered_vol.length} ]
                </DropdownItem>

                {this.state.registered_vol.map(vol => (
                  <DropdownItem key={this.props.event.id}>
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
            <Modal
              centered
              isOpen={this.state.eid == this.props.activityData.EventId}
            >
              <ShowEventDetails
                eventdata={this.props.activityData}
                toggleeid={this.toggleeid}
              />
            </Modal>
          </div>
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
    console.log(data);
    return (
      <React.Fragment>
        <div className="showDetails ">
          <form className="  text-center">
            <div className="form-group  bg-info card  p-4">
              <span className=" pt-2 display-4 text-center ">
                {" "}
                {data.EventName}
              </span>
            </div>

            <div className="form-group   text-center  ">{data.Description}</div>
            <hr />

            <div className="text-center">
              {" "}
              <span className="text-weight-bold">Address: </span>
              {data.Streetnumber}, {data.Streetname}, {data.City}, {data.State},{" "}
              {data.Zip}
            </div>

            <hr />
            <div className="form-group col-9  text-center m-auto ">
              <p>
                {" "}
                Date:{" "}
                {moment(this.state.formData.StartTime).format("YYYY-MM-DD")}
              </p>{" "}
              <p>
                Starting At-{" "}
                {moment(this.state.formData.StartTime).format("HH:mm")}
              </p>
            </div>
            <div className="m-auto text-center">
              {this.props.reg && (
                <input
                  className=" btn btn-success m-2"
                  value="Register"
                  type="submit"
                />
              )}
              <input
                className="btn btn-danger m-2"
                value="Cancel"
                type="button"
                onClick={this.props.toggleeid}
              />
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default ActivityOrg;
