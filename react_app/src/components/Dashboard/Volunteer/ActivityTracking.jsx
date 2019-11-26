import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { Modal } from "reactstrap";
import moment, { min } from "moment";

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
        .get("/event/activity/" + ID)
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
                      history={this.props.history}
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
      eid: ""
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
    console.log(this.props.activityData)
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
            <input
              type="button"
              className="btn text-info"
              onClick={this.orgProfile}
              value={this.props.activityData.OrganizationName}
            />

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
  orgProfile = () => {
    const id = this.props.activityData.EventId;
    const t = this;
    axios
      .get("/profile/organization/" + id)
      .then(function(response, props) {
        t.props.history.push({
          pathname:
            "/vdashboard/profile/organizer/" + response.data[0].ORGANIZER,
          state: { oid: response.data[0].ORGANIZER }
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };
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
              {data.StreetNumber}, {data.StreetName}, {data.City}, {data.State},{" "}
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

export default ActivityTracking;
