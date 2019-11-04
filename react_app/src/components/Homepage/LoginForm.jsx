import axios from "axios";
import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

//Login child component
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        type: this.props.type,
        formname: this.props.type + "login",
        email: "",
        password: "",
        Verified: "false"
      },
      errmsg: "" //stores the error message to display
    };
  }

  render() {
    return (
      <div id="Login_form" className=" mb-3 p-3 ">
        <h5 className="card-title text-info">
          {" "}
          {this.state.formData.type} Login
        </h5>
        <div className="text-danger">{this.state.errmsg}</div>
        <form
          className="text-center"
          onSubmit={e => this.onSubmit(e, this.state.formData)}
        >
          <div className="row">
            <div className="col p-2">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email"
                value={this.state.email}
                onChange={this.handleInputChange}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col p-2">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={this.state.password}
                onChange={this.handleInputChange}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col m-auto ">
              <input
                type="submit"
                className="btn btn-primary "
                value="Submit"
              />
            </div>
          </div>
        </form>
        {/*show if type is volunteer */}
        {this.state.formData.type == "Volunteer" && (
          <Link
            to={{
              pathname: "/volunteer/reset",
              state: { type: this.state.formData.type }
            }}
            className="text-center"
          >
            Reset Password?
          </Link>
        )}
        {/*show if type is Organization */}
        {this.state.formData.type == "Organization" && (
          <Link
            to={{
              pathname: "/organization/reset",
              state: { type: this.state.formData.type }
            }}
            className="text-center"
          >
            Reset Password?
          </Link>
        )}
      </div>
    );
  }

  handleInputChange = e => {
    let formData = { ...this.state.formData };
    formData[e.target.name] = e.target.value;
    this.setState({
      formData
    });
  };

  //function to change the error message to display
  loginErr() {
    this.setState({ errmsg: "Wrong Email/Password entered" });
  }

  //function to clear the error message
  nologinErr() {
    this.setState({ errmsg: "" });
  }

  //onsubmit function
  onSubmit = (e, formData, props) => {
    e.preventDefault();

    const thisprops = this.props;
    const p = this;

    //request to backend
    axios
      .post("/login", formData)
      .then(function(response) {
        p.nologinErr(); //clear the error message
        const code = response.data;
        const data = { formData: formData, code: code }; //code mailed from backend
        thisprops.toggleVerify(data); //toggle the modal state to show verification form
      })
      .catch(function(error) {
        if (error.response.status === 401) {
          p.loginErr(); //display the error message
        }
      });
  };
}

export default Login;
