import React from "react";
import Cookies from "js-cookie";
import { Modal } from "reactstrap";
import jwt_decode from "jwt-decode";
import ShowEventDetails from "./EventDetails";

//Searched events components
class Searched extends React.Component {
  render() {
    return (
      <div className="card text-center shadow p-3 mb-5 bg-white rounded ">
        <h5 className="card-title">{this.props.event.EventName}</h5>
        <span>{this.props.event.date}</span>
        <hr />
        <p className="card-text">{this.props.event.Description}</p>
        <input
          className="m-auto btn btn-info col-3"
          id={this.props.event.id}
          onClick={this.props.showForm}
          value="Details"
          name="Searched"
          type="button"
        />
        <Modal
          isOpen={
            this.props.showFormId == this.props.event.id &&
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
}

export default Searched;
