import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Header from "../Header";
import { Modal, ModalHeader } from "reactstrap";
import Verify from "./Verify";
import axios from "axios";

import logo from "../../logo.png";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verifymodal: false,
      formData: {},
      showlogin: true,
      type: true,
      formtype: "Organization"
    };
    this.toggleLogin = this.toggleLogin.bind(this);
    this.toggleVerify = this.toggleVerify.bind(this);

    this.toggleType = this.toggleType.bind(this);
  }

  toggleVerify(data) {
    this.setState({ verifymodal: !this.state.verifymodal });
    this.setState({ formData: data });
  }
  toggleLogin() {
    this.setState({ showlogin: !this.state.showlogin });
  }
  toggleType() {
    this.setState({ type: !this.state.type });
    if (this.state.formtype === "Volunteer") {
      this.setState({ formtype: "Organization" });
    } else {
      this.setState({ formtype: "Volunteer" });
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="row">
          <div className="backgrounddiv col-8"></div>
          <div className="container col-3   text-center mr-5 login-container">
            <div>
              <img src={logo} />
              <div className="row typetoggle">
                <div
                  className="btn-group typetoggle-div btn-group-toggle"
                  data-toggle="buttons"
                >
                  <label
                    className="btn btn-info active"
                    onClick={
                      this.state.formtype === "Volunteer"
                        ? this.toggleType
                        : null
                    }
                  >
                    <input
                      type="radio"
                      name="options"
                      id="option1"
                      autoComplete="off"
                      defaultChecked
                    />{" "}
                    Volunteer
                  </label>
                  <label
                    className="btn btn-info"
                    onClick={
                      this.state.formtype === "Organization"
                        ? this.toggleType
                        : null
                    }
                  >
                    <input
                      type="radio"
                      name="options"
                      id="option2"
                      autoComplete="off"
                    />{" "}
                    Organization
                  </label>
                </div>
              </div>
              {this.state.type && (
                <div>
                  {!this.state.showlogin && (
                    <Register
                      type="Volunteer"
                      toggleVerify={this.toggleVerify}
                      history={this.props.history}
                    />
                  )}
                  {!this.state.showlogin && (
                    <div>
                      Already have an account?
                      <input
                        type="button"
                        className="btn btn-sm btn-success m-2"
                        value="Sign in"
                        onClick={this.toggleLogin}
                      />
                    </div>
                  )}

                  {this.state.showlogin && (
                    <Login
                      type="Volunteer"
                      toggleVerify={this.toggleVerify}
                      history={this.props.history}
                    />
                  )}
                  {this.state.showlogin && (
                    <div>
                      Don't have an account?
                      <input
                        type="button"
                        className="btn  btn-sm btn-success m-2"
                        value="Sign Up"
                        onClick={this.toggleLogin}
                      />
                    </div>
                  )}
                </div>
              )}

              {!this.state.type && (
                <div>
                  {!this.state.showlogin && (
                    <Register
                      type="Organization"
                      toggleVerify={this.toggleVerify}
                      history={this.props.history}
                    />
                  )}
                  {!this.state.showlogin && (
                    <div>
                      Already have an account?
                      <input
                        type="button"
                        className="btn btn-sm btn-success m-2"
                        value="Sign in"
                        onClick={this.toggleLogin}
                      />
                    </div>
                  )}

                  {this.state.showlogin && (
                    <Login
                      type="Organization"
                      toggleVerify={this.toggleVerify}
                      history={this.props.history}
                    />
                  )}
                  {this.state.showlogin && (
                    <div>
                      Don't have an account?
                      <input
                        type="button"
                        className="btn btn-sm btn-success m-2"
                        value="Sign Up"
                        onClick={this.toggleLogin}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            <Modal isOpen={this.state.verifymodal}>
              <ModalHeader>Verify</ModalHeader>
              <Verify
                type={this.state.type}
                toggleVerify={this.toggleVerify}
                verifyCode={this.state.formData}
                history={this.props.history}
              />
            </Modal>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

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
      }
    };
  }

  render() {
    return (
      <div id="Login_form" className=" mb-3 p-3 ">
        <h5 className="card-title text-info">
          {" "}
          {this.state.formData.type} Login
        </h5>

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
        <Link
          to={{
            pathname: "/volunteer/reset",
            state: { type: this.state.formData.type }
          }}
          className="text-center"
        >
          Reset Password?
        </Link>
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

  onSubmit = (e, formData, props) => {
    e.preventDefault();

    const thisprops = this.props;
    axios
      .post("http://localhost:40951/login", formData)
      .then(function(response) {
        
        const code = response.data;
        const data = { formData: formData, code: code }; //code mailed from backend
        thisprops.toggleVerify(data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}

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
        passreq: false
      }
    };
  }

  render() {
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
            {this.state.formData.type} Registrataion
          </h5>
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
              {this.state.passreq && (
                <div className='mt-1'>
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
              this.state.formData.Password.length <8 ||
              this.state.formData.Password.match(num)===null||
              this.state.formData.Password.match(num)===null||
              this.state.formData.Password.match(lc)===null
            }
            
          />
        </form>
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
  togglereq = () => {
    this.setState({
      passreq: true
    });
  };

  onSubmit = (e, formData, props) => {
    e.preventDefault();
    const thisprops = this.props;
    axios
      .post("http://localhost:40951/register", formData)
      .then(function(response) {
        console.log(response)
        const code =parseInt(response.data.verification_token); //code mailed from backend
        const data = { formData: formData, code: code };
        thisprops.toggleVerify(data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}




export default LoginPage;
