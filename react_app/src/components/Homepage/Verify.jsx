import React from "react";
import axios from "axios";
import { createBrowserHistory } from "history";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const history = createBrowserHistory();

//Child component for verifying
class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errmsg: false,
      code: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleErrmMsg = this.toggleErrmMsg.bind(this);
  }

  //sunction the hide/show the error message
  toggleErrmMsg() {
    this.setState({
      errmsg: !this.state.errmsg
    });
  }

  render() {
    return (
      <React.Fragment>
        <div id="Volunteer_form" className="card  mb-3 p-4 ">
          {/*Error message */}
          {this.state.errmsg && (
            <span className="error_msg text-danger">
              Invalid Code. Try again.
            </span>
          )}
          <form className="text-center" onSubmit={e => this.onSubmit(e)}>
            <div className="row">
              <div className="col p-2">
                <input
                  type="text"
                  name="Reset_code"
                  onChange={this.handleInputChange}
                  className="form-control"
                  placeholder="Check Your Email For Verification Code"
                  required
                />
              </div>
            </div>

            <input
              type="submit"
              className="btn btn-primary m-1"
              value="Submit"
            />
          </form>

          <input
            className="btn btn-danger m-auto"
            type="button"
            value="Close"
            onClick={this.props.toggleVerify}
          />
        </div>
      </React.Fragment>
    );
  }

  handleInputChange = e => {
    this.setState({ code: e.target.value });
  };

  //on submit function
  onSubmit = e => {
    e.preventDefault();
    console.log(this.props.verifyCode.code.verification_token);
    //check if the user code and the actual code matches
    if (
      parseInt(this.props.verifyCode.code.verification_token) ===
        parseInt(this.state.code) ||
      parseInt(this.props.verifyCode.code) === parseInt(this.state.code)
    ) {
      this.props.verifyCode["formData"]["Verified"] = "True";
      const type = this.props.verifyCode["formData"]["type"];
      const fname = this.props.verifyCode["formData"]["formname"];
      const thisprops = this.props;
      let path_type = "";

      //clear the error message on correct code
      if (this.state.errmsg) {
        this.toggleErrmMsg();
      }
      //enter if redirected from register page
      if (fname === "VolunteerRegister" || fname === "OrganizationRegister") {
        axios
          .post(
            "/register",
            this.props.verifyCode["formData"]
          )
          .then(function(response) {
            thisprops.toggleVerify();
            window.location.reload();
          })
          .catch(function(error) {
            console.log(error);
          });
      }

      //enter if redirected from reset page
      if (
        fname === "reset" ||
        fname === "Volunteerreset" ||
        fname === "Organizationreset"
      ) {
        axios
          .post(
            "/reset_password",
            this.props.verifyCode["formData"]
          )
          .then(function(response) {
            thisprops.toggleVerify();
            thisprops.history.push("/");
          })
          .catch(function(error) {
            console.log(error);
          });
      }

      //enter if redirected from login page
      if (
        fname === "login" ||
        fname === "Organizationlogin" ||
        fname === "login" ||
        fname === "Volunteerlogin"
      ) {
        if (type === "Volunteer") {
          path_type = "/vdashboard/";
        } else {
          path_type = "/odashboard/";
        }
        axios
          .post(
            "/login",
            this.props.verifyCode["formData"]
          )
          .then(function(response) {
            let token = response.data.jwt;
            let ID = jwt_decode(String(token)).uid;
            console.log(path_type + ID);

            Cookies.remove("token", {});
            Cookies.remove("type");
            Cookies.set("token", token);

            Cookies.set("type", path_type);
            thisprops.history.push({
              pathname: path_type + ID
            });
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    } else {
      //display error message
      if (!this.state.errmsg) {
        this.toggleErrmMsg();
      }
    }
  };
}

export default Verify;
