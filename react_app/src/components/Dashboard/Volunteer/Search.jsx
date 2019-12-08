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
      <div className="col-xl-4 col-lg-6 col-md-12 my-3">
        <div className="card event-card  shadow bg-white rounded border-info">
          <div className="card-title p-2 text-center  pb-3 bg-info" style={{fontWeight:'bold',fontSize:'18px'}}>
            {this.props.event.EventName}
         
           
          </div>
         
        
          <div className="container  px-3" style={{minHeight:'240px'}}>
   
            <div className="row ">
            <div className=" badge badge-pill  mx-auto float-right badge-dark">
            {this.props.event.Tag}
          </div>{" "}
            </div>
            <div className="row py-1 text-center" style={{minHeight:'50px'}}>
              <div className="col">
                {this.props.event.Description.length > 58
                  ? this.props.event.Description.substring(0, 58) + "..."
                  : this.props.event.Description}
              </div>
            </div>
            <div className="row text-left py-1" style={{minHeight:'45px'}}>
              <div className="col text-center">
                <span className="text-info" style={{ fontWeight: "bold" }}>
                  Address:{" "}
                </span>
                <span>
                  {this.props.event.StreetNumber}, {this.props.event.StreetName}
                  , {this.props.event.City}, {this.props.event.State},{" "}
                  {this.props.event.Zip}
                </span>
              </div>
            </div>

            <div className="row pt-1">
              <div className="col text-center m-auto ">
                <span className="text-info" style={{ fontWeight: "bold" }}>
                  On {moment(this.props.event.StartTime).format("MM-DD-YYYY")}
                </span>
              </div>
            </div>
            <div className="row ">
              <div className="col text-center m-auto ">
                <span className="text-info" style={{ fontWeight: "bold" }}>
                  At {moment(this.props.event.StartTime).format("HH:mm")}{" "}
                  
                </span>
              </div>
            </div>

            <div className="justify-content-center row ">
              <div className="col ">
                <button
                  className=" mx-1 btn btn-success text-nowrap   "
                  type="submit"
                  onClick={e => this.onSubmit(e)}
                >
                  Register
                  <i className="fas fa-calendar-check ml-1"></i>
                </button>
              </div>

              <div className="col">
                <button
                  className="btn btn-info text-nowrap  "
                  id={this.props.event.id}
                  onClick={this.props.showForm}
                  name="Searched"
                  type="button"
                >
                  Details
                  <i className="fas ml-1 fa-info-circle"></i>
                </button>
              </div>
              
            </div>
            <div className="row "style={{position:'absolute',bottom:'0',right:'0'}}>
              <div className="col">
              <input
              type="button"
              className="btn btn-sm text-primary float-right "
              onClick={this.orgProfile}
              value={"-Created by " + this.props.event.OrganizationName}
            />
              </div>
            </div>
          </div>
        </div>

        <Modal
          centered
          isOpen={
            String(this.props.showFormId) === String(this.props.event.id) &&
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
