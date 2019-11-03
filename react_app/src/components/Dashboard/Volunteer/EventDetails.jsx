import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

//Show event details child component
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
            <form
              className="EventCreate  text-center"
              onSubmit={e => this.onSubmit(e)}
            >
              <div className="form-group  bg-info card row p-4">
                <span className=" pt-2 display-4 text-center ">
                  {" "}
                  {data.EventName}
                </span>
              </div>
  
              <div className="form-group   text-center  ">{data.Description}</div>
              <hr />
  
              <div className="text-center"> Address: {data.City}</div>
  
              <hr />
              <div className="form-group rowtext-center">
                <span className="col-3 ">
                  {" "}
                  Date: {t.getUTCMonth()}/{t.getUTCDate()}/{t.getFullYear()}{" "}
                  Starting At- {t.getUTCHours()}:{t.getMinutes()}
                </span>
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
                  onClick={this.props.showFormReset}
                />
              </div>
            </form>
          </div>
        </React.Fragment>
      );
    }

    //Onsubmit function handler
    onSubmit = e => {
      e.preventDefault();
      const formData = this.state.formData;
      axios
        .post(
          "http://localhost:40951/event/register/" +
          (jwt_decode(Cookies.get("token"))).uid +
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

  export default ShowEventDetails;