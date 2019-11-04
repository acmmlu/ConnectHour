import axios from "axios";
import React, { Component } from "react";
import currDom from "../../Config";

const dom = currDom();
//Register child component
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        type: this.props.type,
        formname: this.props.type + "Register",
        Firstname: "",
        Lastname: "",
        Organization_name: "",
        Email: "",
        Password: "",
        City: "",
        State: "",
        Verified: "false",
        passreq: false //used for password validation
      },
      errmsg: "" //stores the errr message to display
    };
  }

  render() {
    //formadata is used to store the input values of the user

    const lc = /[a-z]/g;
    const uc = /[A-Z]/g;
    const num = /[0-9]/g;

    return (
      <div id="RegisterForm" className="  mb-3 p-4 ">
        <form
          className="text-center"
          onSubmit={e => this.onSubmit(e, this.state.formData)}
        >
          <h5 className="card-title text-info">
            {" "}
            {this.state.formData.type} Registration
          </h5>
          <div className="text-danger">{this.state.errmsg}</div>

          {/*Form field to display if a volunteer */}
          {this.state.formData.type === "Volunteer" && (
            <div className="row">
              <div className="col p-2">
                <input
                  type="text"
                  name="Firstname"
                  onChange={this.handleInputChange}
                  className="form-control"
                  placeholder="First name"
                  required
                />
              </div>
              <div className="col p-2">
                <input
                  type="text"
                  name="Lastname"
                  onChange={this.handleInputChange}
                  className="form-control"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
          )}
          {/*Form field to display if an Organization */}

          {this.state.formData.type === "Organization" && (
            <div className="row">
              <div className="col p-2">
                <input
                  type="text"
                  name="Organization_name"
                  onChange={this.handleInputChange}
                  className="form-control"
                  placeholder="Organisation name"
                  required
                />
              </div>
            </div>
          )}

          <div className="row">
            <div className="col p-2">
              <input
                type="email"
                name="Email"
                onChange={this.handleInputChange}
                className="form-control"
                placeholder="Email"
                required
              />
            </div>
          </div>
          <div className="row">
            <div className=" col p-2">
              <input
                type="password"
                name="Password"
                onChange={this.handleInputChange}
                className="form-control"
                placeholder="Password"
                required
                onFocus={this.togglereq}
              />
              {/*Password validation */}
              {this.state.passreq && (
                <div className="mt-1">
                  <h5>Password should contain </h5>
                  <ul>
                    {this.state.formData.Password.length >= 8 ? (
                      <li className="text-success">
                        more than or equal to 8 characters
                      </li>
                    ) : (
                      <li className="text-danger">
                        more than or equal to 8 characters
                      </li>
                    )}
                    {this.state.formData.Password.match(num) ? (
                      <li className="text-success">a number</li>
                    ) : (
                      <li className="text-danger">a number</li>
                    )}
                    {this.state.formData.Password.match(uc) ? (
                      <li className="text-success">a character in uppercase</li>
                    ) : (
                      <li className="text-danger">a character in uppercase</li>
                    )}
                    {this.state.formData.Password.match(lc) ? (
                      <li className="text-success">a character in lowercase</li>
                    ) : (
                      <li className="text-danger">a character in lowercase</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className=" col p-2">
              <input
                type="text"
                name="City"
                onChange={this.handleInputChange}
                className="form-control"
                placeholder="City"
                required
              />
            </div>
            <div className=" col p-2">
              <input
                type="text"
                name="State"
                onChange={this.handleInputChange}
                className="form-control"
                placeholder="State"
                required
              />
            </div>
          </div>

          <input
            type="submit"
            className="btn btn-primary m-1"
            value="Submit"
            disabled={
              this.state.formData.Password.length < 8 ||
              this.state.formData.Password.match(num) === null ||
              this.state.formData.Password.match(num) === null ||
              this.state.formData.Password.match(lc) === null
            }
          />
        </form>
      </div>
    );
  }

  //handle input change and upate field values
  handleInputChange = e => {
    let formData = { ...this.state.formData };
    formData[e.target.name] = e.target.value;
    this.setState({
      formData
    });
  };

  //toggle password validing state
  togglereq = () => {
    this.setState({
      passreq: true
    });
  };

  //function to change error message
  regErr() {
    this.setState({ errmsg: "Account Already Exists" });
  }

  //function to clear error message
  noregErr() {
    this.setState({ errmsg: "" });
  }

  //On submit function
  onSubmit = (e, formData, props) => {
    e.preventDefault();
    const thisprops = this.props;
    const p = this;
    //request to backend
    axios
      .post("/register", formData)
      .then(function(response) {
        p.noregErr(); //clear the error message
        const code = response.data; //code mailed from backend
        const data = { formData: formData, code: code };
        thisprops.toggleVerify(data); //toggle the modal state to show verification form
      })
      .catch(function(error) {
        p.regErr(); //show the error message
      });
  };
}

export default Register;
