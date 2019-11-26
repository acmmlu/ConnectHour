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
import ShowEventDetails from "./EventDetails";

class OrgProfileLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      activityData: [],
      scheduled: [],
      Subscribed: false,
      regeventid:[]
    };
    this.toggleSubscribeMode = this.toggleSubscribeMode.bind(this);
  }
  componentDidMount = () => {
    if (Cookies.get("token") && Cookies.get("type") === "/vdashboard/") {
      //PrfileData

      const p = this;
      axios
        .get(
          "/organizer/" + this.props.location.state.oid
        )
        .then(function(response) {
          p.setState({ formData: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });

      //PastEvents
      axios
        .get(
          "/event/activityOrg/" +
            this.props.location.state.oid
        )
        .then(function(response) {
          p.setState({ activityData: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
        const regeventid = this.state.regeventid;
        axios
          .get(
            "/event/volunteer/" +jwt_decode(Cookies.get("token")).uid
          )
          .then(function(response) {
            if (response.data.length > 0) {
              response.data.map(event => regeventid.push((event.id)));
            }
            console.log(p.state.regeventid)
          })
          .catch(function(error) {
            console.log(error);
          });
      //scheduled events
      axios
        .get(
          "/event/organizer/" +
            this.props.location.state.oid
        )
        .then(function(response) {
          p.setState({ scheduled: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });

      //check if subscribed
      axios
        .get(
          "/event/issubscribed/" +
            jwt_decode(Cookies.get("token")).uid +
            "/" +
            this.props.location.state.oid
        )
        .then(function(response) {
          p.setState({ Subscribed: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      this.props.history.push("/");
    }
  };

  toggleSubscribeMode() {
    let t = this;
    if (this.state.Subscribed) {
      //if already subscribed, unsubscribe

      axios
        .post(
          "/event/unsubscribe/" +
            jwt_decode(Cookies.get("token")).uid +
            "/" +
            this.props.location.state.oid
        )
        .then(function(response, props) {
          // window.location.reload();
          t.setState({ Subscribed: false });
        })
        .catch(function(error) {
          console.log(error);
        });
    } //subscribe
    else {
      axios
        .post(
          "/event/subscribe/" +
            jwt_decode(Cookies.get("token")).uid +
            "/" +
            this.props.location.state.oid
        )
        .then(function(response, props) {
          // window.location.reload();
          t.setState({ Subscribed: true });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

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
                        <div className="col-9">
                          <h5 id="AccountName" className=" m-auto display-4">
                            {this.state.formData.Name}{" "}
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
                      <div className="row">
                        <div className="col-3 float-left">
                          <input
                            className="btn btn-info"
                            type="button"
                            name="Donate"
                            value="Donate?"
                          />
                        </div>

                        <div className="col-3 float-left">
                          {!this.state.Subscribed && (
                            <button
                              onClick={e => {
                                e.preventDefault();
                                this.toggleSubscribeMode();
                              }}
                              id="subscribe"
                              className="btn btn-success visible"
                            >
                              Subscribe
                            </button>
                          )}
                          {this.state.Subscribed && (
                            <button
                              onClick={e => {
                                e.preventDefault();
                                this.toggleSubscribeMode();
                              }}
                              id="subscribe"
                              className="btn btn-success visible"
                            >
                              UnSubscribe
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row m-2 p-3 shadow  bg-white rounded">
                <div className="col-12">
                  <h3 htmlFor="Description">About Us</h3>
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
                    <h4 className="float-left"> Scheduled Events</h4>
                  </div>

                  <div className="row">
                    {this.state.scheduled.map(scheduled => (
                      //call the registered component
                      <ScheduledEvents
                        activityData={scheduled}
                        key={scheduled.EventId}
                        showForm={this.props.location.state.showForm}
                        event={scheduled}
                        showFormReset={this.props.location.state.showFormReset}
                        id={scheduled.id}
                        regEventId={this.state.regeventid}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
      // showreg: false,
      // regId: ""
    };
    this.toggleeid = this.toggleeid.bind(this);
    // this.togglereg = this.togglereg.bind(this);
  }
  // componentDidMount() {
  //   let thisstate = this;

  //   axios
  //     .get(
  //       "http://localhost:40951/event/organizer/registered/" +
  //         this.props.activityData.id
  //     )
  //     .then(function(response) {
  //       thisstate.setState({ registered_vol: response.data });
  //       console.log(thisstate.state.registered_vol,thisstate.props.activityData.EventName)

  //     })

  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // }
  toggleeid(e) {
    if (e.target.id) {
      this.setState({ eid: e.target.id });
    } else {
      this.setState({ eid: "" });
    }
  }
  // togglereg() {
  //   this.setState({
  //     showreg: !this.state.showreg
  //   });
  // }

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
            {/*             
            <Dropdown  isOpen={showreg}  toggle={this.togglereg} >
      <DropdownToggle className='bg-info' caret>
        Show Registered Volunteers
        </DropdownToggle>
      <DropdownMenu >
        <DropdownItem header>Registered Volunteers [ {this.state.registered_vol.length} ]</DropdownItem>
        
        {this.state.registered_vol.map(vol => (
          <DropdownItem key={this.props.event.id}>
                      <div  className="text-center m-auto">
                        <div className=''>
                          <span >Name: </span>
                          {vol.FirstName} {vol.LastName}
                        </div>
                        <div className=''>
                          <span >Email: </span>
                          {vol.Email}
                        </div>
                      </div>
                      </DropdownItem>
                        ))}
       
      </DropdownMenu>
    </Dropdown>
 */}

            <Modal
              centered
              isOpen={this.state.eid == this.props.activityData.EventId}
            >
              <ShowDetails
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

class ScheduledEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eid: "",
      registered_vol: "",
      regeventid:this.props.regEventId
      // showreg: false,
      // regId: ""
     
      // regeventid: []
    };
    this.toggleeid = this.toggleeid.bind(this);
    // this.togglereg = this.togglereg.bind(this);
  }
  // componentDidMount() {
  //   let thisstate = this;
  //   const regeventid = this.state.regeventid;
  //   axios
  //     .get(
  //       "http://localhost:40951/event/volunteer/" +jwt_decode(Cookies.get("token")).uid
  //     )
  //     .then(function(response) {
  //       if (response.data.length > 0) {
  //         response.data.map(event => regeventid.push((event.id)));
  //       }
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // }
  toggleeid=e=> {
    if (e.target.id) {
      this.setState({ eid: e.target.id });
    } else {
      this.setState({ eid: "" });
    }
    console.log(e.target.id,this.state.eid)

  }
  // togglereg() {
  //   this.setState({
  //     showreg: !this.state.showreg
  //   });
  // }

  render() {
    
   
    return (
      <>
        <div className="p-3 col-xl-4 col-lg-6 col-md-12">
          <div className="card event-card text-center shadow bg-white rounded">
            <h5 className="card-title">
              {this.props.event.EventName}
              <span className="badge badge-pill badge-primary">
                {this.props.event.Tag}
              </span>
            </h5>

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
            <div className="form-group col-9  text-center m-auto ">
              <p>
                {" "}
                Date: {moment(this.props.event.StartTime).format("MM-DD-YYYY")}
              </p>{" "}
              <p>
                Starting At:{" "}
                {moment(this.props.event.StartTime).format("HH:mm")}
              </p>
            </div>

            <div className="m-auto   justify-content-center row text-center">
             { !this.state.regeventid.includes(this.props.event.id) && <button
                className=" m-auto btn btn-success text-nowrap col "
                type="submit"
                onClick={e => this.onSubmit(e)}
              >
                Register
              </button>
             }
              {/* <button
              className="m-auto btn btn-info text-nowrap col-lg-5 col-md-5 "
              id={this.props.event.id}
              onClick={this.props.showForm}
              name="Searched"
              type="button"
            >
              Details
            </button> */}
            <input
                className="m-auto btn btn-info col"
                id={this.props.event.id}
                onClick={this.toggleeid}
                value="Details"
                type="button"
              />
            </div>
            <Modal
              centered
              isOpen={this.state.eid ==this.props.event.id}
            >
              {/*call the child component for showing event details*/}

              <ShowDetails
                eventdata={this.props.event}
                toggleeid={this.toggleeid}

            />
            </Modal>
          </div>
        </div>
      </>
    );
  }
  onSubmit = e => {
    e.preventDefault();
    const formData = this.props.event;
    axios
      .post(
        "/event/register/" +
          jwt_decode(Cookies.get("token")).uid +
          "/" +
          formData["id"],
        formData
      )
      .then(function(response, props) {
        window.location.reload();
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}

class ShowDetails extends React.Component {
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

export default OrgProfileLink;
