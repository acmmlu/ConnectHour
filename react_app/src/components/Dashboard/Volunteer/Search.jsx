import React from "react";
import Cookies from "js-cookie";
import { Modal } from "reactstrap";
import jwt_decode from "jwt-decode";
import ShowEventDetails from "./EventDetails";
import "./volunteer.css";
import moment from "moment";
import axios from "axios";

//Searched events components
class Searched extends React.Component {

  render() {
    
    return (
      
      <div className="p-2 col-xl-4 col-lg-6 col-md-12 " >
        <div className="card event-card text-center shadow bg-white rounded">
          <h5 className="card-title bg-info">{this.props.event.EventName}
          <span className="badge badge-pill badge-primary">
              {this.props.event.Tag}
            </span>   <input
            type="button"

            className="btn text-white"
            onClick={this.orgProfile}
            value={'-Created by '+this.props.event.OrganizationName}
          /></h5>

        

        
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
              Starting At: {moment(this.props.event.StartTime).format("HH:mm")}
            </p>
          </div>

          <div className="m-auto justify-content-center row ">
            <button
              className=" mx-1 btn btn-success text-nowrap pl-1 pr-1  col-lg-6 col-md-5 "
              type="submit"
              onClick={e => this.onSubmit(e)}
            >
              Register
            </button>

            <button
              className="btn btn-info text-nowrap col-lg-5 pl-1 pr-1 col-md-5 "
              id={this.props.event.id}
              onClick={this.props.showForm}
              name="Searched"
              type="button"
            >
              Details
            </button>
            </div>
          </div>
          <Modal
            centered
            isOpen={
              this.props.showFormId === this.props.event.id &&
              this.props.name === "Searched"
            }
          >
            {/*call the child component for showing event details*/}
            <ShowEventDetails
              ID={jwt_decode(Cookies.get("token")).uid}
              eventdata={this.props.event}
              showFormReset={this.props.showFormReset}
              reg={true}
            />
          </Modal>
       
      </div>
    );
  }
  orgProfile = () => {
    const id = this.props.event.id;
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

export default Searched;
