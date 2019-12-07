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
      <div className=" text-center card p-3 mb-5 bg-white rounded ">
        <h5 className="card-title">
          {this.props.event.EventName}
          <span className="badge badge-pill badge-primary">
            {this.props.event.Tag}
          </span>
        </h5>
        <input
              type="button"
              className="btn text-info"
              onClick={this.orgProfile}
              value={this.props.event.OrganizationName}
            />
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
            Starting At: {moment(this.props.event.StartTime).format("HH:mm")}
          </p>
        </div>

        <input
          className="m-auto btn btn-info col-lg-4 col-md-10 col-sm-12"
          id={this.props.event.id}
          name="Registered"
          onClick={this.props.showForm}
          value="Details"
          type="button"
        />
        {/*Show modal for registered event details */}
        <Modal
          centered
          isOpen={
            this.props.showFormId === this.props.event.id &&
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
