import React from "react";
import { Modal } from "reactstrap";
import ShowEventDetails from './EventDetails'


//Child component to display registered events
class Registered extends React.Component {
    render() {
      return (
        <div className=" text-center card p-3 mb-5 bg-white rounded ">
          <h5 className="card-title">{this.props.event.EventName}</h5>
          <span>{this.props.event.date}</span>
          <hr />
          <p className="card-text">{this.props.event.Description}</p>
          <input
            className="m-auto btn btn-info col-3"
            id={this.props.event.id}
            name="Registered"
            onClick={this.props.showForm}
            value="Details"
            type="button"
          />
        {/*Show modal for registered event details */}
          <Modal
            isOpen={
              this.props.showFormId == this.props.event.id &&
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