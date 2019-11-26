import React from "react";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import moment, { min } from "moment";
import user from "../../user.png";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

class VolProfileLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      activityData: []
    };
  }
  componentDidMount = () => {
    if (Cookies.get("token") && Cookies.get("type") === "/odashboard/") {
      const p = this;
      axios
        .get(
          "/volunteer/" + this.props.location.state.vid
        )
        .then(function(response) {
          p.setState({ formData: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
      axios
        .get(
          "/event/activity/" +
            this.props.location.state.vid
        )
        .then(function(response) {
          p.setState({ activityData: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      this.props.history.push("/");
    }
  };

  render() {
    return (
      <>
        <div className="container">
          <div className="row justify-content-center">
            <form
              className=" topdist  volprofile col-8"
              onSubmit={e => this.onSubmit(e, this.state.formData)}
            >
              <div className="container">
                <div className="row" style={{ marginTop: "20px" }}>
                  <div className="col">
                    <img
                      src={user}
                      className="img-thumbnail shadow p-3 bg-white rounded"
                      style={{ width: "200px", height: "200px" }}
                    />
                    {/* Profile picture here */}
                  </div>
                  <div className="col-8 ">
                    <div className="container">
                      <div className="row h-100 ">
                        <div className="col-10">
                          <h5 id="AccountName" className=" m-auto display-4">
                            {this.state.formData.FirstName}{" "}
                            {this.state.formData.LastName}
                          </h5>{" "}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <h5 className=" m-auto " id="AccountEmail">
                            Email ID: {this.state.formData.Email}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row m-2 p-3 shadow  bg-white rounded">
                <div className="col-12">
                  <h3 htmlFor="Description">About Me</h3>
                  {this.state.formData.Description}
                </div>
              </div>
              <div className="row  d-flex  m-2 p-3 card shadow  bg-white rounded ">
                <div className="col">
                  <div className="container">
                    <div className="row">
                      {" "}
                      {/* Address Section */}
                      <div className="col">
                        <h3>Address Info</h3>
                      </div>
                    </div>

                    <div className="row m-1 justify-content-left">
                      {" "}
                      {/* City & State */}
                      {this.state.formData.StreetName},
                      {this.state.formData.City},{this.state.formData.State},
                      {this.state.formData.ZIP}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
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
        </div>
      </>
    );
  }
}

class PastEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eid: "",
      registered_vol: ""
    };
    this.toggleeid = this.toggleeid.bind(this);
  }

  toggleeid(e) {
    if (e.target.id) {
      this.setState({ eid: e.target.id });
    } else {
      this.setState({ eid: "" });
    }
  }

  render() {
    console.log(this.props.activityData);
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
            <span>{this.props.activityData.date}</span>
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

export default VolProfileLink;
