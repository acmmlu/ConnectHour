import React, { Component } from "react";
import axios from "axios";
import { TimePicker } from "antd";
import "antd/dist/antd.css";

import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

class EventCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        EventName: "",
        Description: "",
        OrganizationName: "",
        OrganizationId: this.props.ID,
        StreetNumber: "",
        StreetName: "",
        City: "",
        State: "",
        ZIP: "",
        date: "",
        tag: "",
        StartTime: "",
        EndTime: ""
      }
    };
    this.onEndTime = this.onEndTime.bind(this);
    this.onStartTime = this.onStartTime.bind(this);
  }

  onStartTime(n, time) {
    console.log(time);
    let formData = { ...this.state.formData };
    formData["StartTime"] = time;
    this.setState({
      formData
    });
    console.log(this.state.formData);
  }
  onEndTime(n, time) {
    console.log(time);
    let formData = { ...this.state.formData };
    formData["EndTime"] = time;
    this.setState({
      formData
    });
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
        <div>
          <form
            className="card  "
            onSubmit={e => this.onSubmit(e, this.state.formData)}
          >
            <div className="form-group  bg-info card  p-4">
              <span className=" pt-2 text-center " style={{ fontSize: "30px" }}>
                {" "}
                Create Event
              </span>
            </div>
            <div className="form-group row px-3 pr-4 ml-1 pt-1 text-center">
              <label  htmlFor="EventName">
                Event Name:
              </label>
              <input
                type="text"
                name="EventName"
                onChange={this.handleInputChange}
                className="form-control "
                id="EventName"
                placeholder="Enter Event Name"
                required
              />
            </div>
            <div className="form-group row px-3 pr-4 ml-1 pt-1 text-center">
              <label htmlFor="Tag">Category:</label>
              <input
                type="text"
                name="Tag"
                onChange={this.handleInputChange}
                className="form-control "
                id="Tag"
                placeholder="Enter Category"
                required
              />
              {/* <div className="input-group row pl-4 pr-2 pt-1 text-center">
  <select onChange={this.handleInputChange} className="custom-select" id="inputGroupSelect04">
    <option selected>Choose...</option>
    <option name="Animals">Animals</option>
    <option name="Children">Children</option>
    <option name="Customer Service">Customer Service</option>
    <option name="Elderly">Elderly</option>
    '<option name="Construction">Construction</option>
  </select> */}
            </div>
            <div className="form-group row px-3 pr-4 ml-1 text-center">
              <label htmlFor="description">Event Description:</label>
              <textarea
                className="form-control pr-3 "
                onChange={this.handleInputChange}
                name="Description"
                id="Description"
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-group row px-3 pr-4 ml-1 text-center">
              <label htmlFor="StreetName">Street Name:</label>
              <input
                type="text"
                onChange={this.handleInputChange}
                className="form-control "
                name="StreetName"
                id="StreetName"
                placeholder="Enter Street Name"
                required
              />
            </div>

            <div className="form-group row px-4">
              <label htmlFor="City" className=" pt-2  col-2">
                City:
              </label>
              <input
                type="text"
                onChange={this.handleInputChange}
                className="form-control col-4"
                name="City"
                id="City"
                placeholder="Enter City"
                required
              />
              <label htmlFor="State" className=" pt-2 col-2">
                State:
              </label>
              <input
                type="text"
                onChange={this.handleInputChange}
                className="form-control col-4"
                name="State"
                id="State"
                placeholder="Enter State Name"
                required
              />
            </div>
            <div className="form-group row px-4">
              <label htmlFor="ZIP" className=" pt-2 col-2">
                ZIP:
              </label>
              <input
                pattern="[0-9]{5}"
                title="Please Enter Valid Zip"
                type="text"
                onChange={this.handleInputChange}
                className="form-control col-4"
                name="ZIP"
                id="ZIP"
                placeholder="Enter ZIP"
                required
              />
              <label htmlFor="date" className="  pt-2 col-2">
                Date:
              </label>
              <input
                type="date"
                id="date"
                onChange={this.handleInputChange}
                className="form-control  col-4"
                name="date"
              />
            </div>

            <div className="form-group row px-4">
              <label htmlFor="StartTime" className="  col-2">
                Start Time:
              </label>
              <div className="  col-4">
                <TimePicker
                  format="HH:mm"
                  onChange={this.onStartTime}
                  required
                />
              </div>
              <label htmlFor="EndTime" className="col-2 ">
                End Time:
              </label>
              <div className="  col-4">
                <TimePicker format="HH:mm" onChange={this.onEndTime} required />
              </div>
            </div>

            <div className=" text-center m-2">
              <span className=" m-2 ">
                <input type="submit" className="btn btn-info " value="Submit" />
              </span>
              <span className=" m-2 ">
                <input
                  type="button"
                  className="btn btn-danger "
                  onClick={this.props.toggleCreateForm}
                  value="Close"
                />
              </span>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }

  onSubmit = (e, formData) => {
    e.preventDefault();
    const p = this.props;
    console.log(formData);
    axios
      .post(
        "/event/" +
          jwt_decode(Cookies.get("token")).uid +
          "/",
        formData
      )
      .then(function(response, props) {
        console.log("success");
        p.addEvent(formData);
        p.toggleCreateForm();
        console.log("server", response);
        window.location.reload();
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}

export default EventCreate;
