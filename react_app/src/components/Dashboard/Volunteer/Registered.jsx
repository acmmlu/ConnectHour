import React from "react";
import { Modal } from "reactstrap";
import ShowEventDetails from "./EventDetails";
import moment from "moment";
import axios from "axios";

//Child component to display registered events
class Registered extends React.Component {
  orgProfile = () => {
    const id = this.props.event.id;
    const t = this;
    axios
      .get("/profile/organization/" + id)
      .then(function(response, props) {
       console.log(response)
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
  render() {
    return (
      <div className="card event-card  my-3 shadow bg-white rounded border-info">
      <div className="card-title p-2 text-center  pb-3 bg-info" style={{fontWeight:'bold',fontSize:'18px'}}>
        {this.props.event.EventName}
    
       
      </div>
     
    
      <div className="container  px-3" style={{minHeight:'260px'}}>

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
          

          <div className="col mt-4">
          <button
                 className="btn btn-info text-nowrap "
                 id={this.props.event.id}
                 name="Registered"
                 onClick={this.props.showForm}
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
      
        {/*Show modal for registered event details */}
        <Modal
          centered
          isOpen={
            String(this.props.showFormId) === String(this.props.event.id) &&
            this.props.name === "Registered"
          }
        >
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
export default Registered;
