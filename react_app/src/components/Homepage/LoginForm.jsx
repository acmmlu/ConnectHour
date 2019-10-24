import React, { Component } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { Modal, ModalHeader } from "reactstrap";
import Verify from "./Verify";
import Header from '../Header'


export default class MainForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.location.state.type,
      verifymodal: false,
      formData: {}
    };

    this.toggleVerify = this.toggleVerify.bind(this);
  }

  toggleVerify(data) {
    this.setState({ verifymodal: !this.state.verifymodal });
    this.setState({ formData: data });
  }

  render() {
    return (
        <React.Fragment>
        <Header/>

      <div className="container col-4">
        
            {this.state.type === "Volunteer" && (
              <Register
                type={this.state.type}
                toggleVerify={this.toggleVerify}
                history={this.props.history}
              />
            )}

            {this.state.type === "Organization" && (
              <Register
                type={this.state.type}
                toggleVerify={this.toggleVerify}
                history={this.props.history}
              />
            )}

          
            <Login
              type={this.state.type}
              toggleVerify={this.toggleVerify}
              history={this.props.history}
            />
         

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
        formname: "login",
        email: "",
        password: "",
        Verified: "false"
      }
    };
  }

  render() {
    return (
      <div id="Login_form" className="card mb-3 p-3 ">
        <h5 className="card-title">Login</h5>

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
        console.log("worked", response);

        const code = response.code.data;
        const data = { formData: formData, code: code }; //code mailed from backend
        thisprops.toggleVerify(data);
        console.log("worked", data);

      })
      .catch(function(error) {
        console.log("Wrong Credentials");
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
        Verified: "false"
      }
    };
  }

  render() {
    return (
      <div id="RegisterForm" className="card  mb-3 p-4 ">
        <form
          className="text-center"
          onSubmit={e => this.onSubmit(e, this.state.formData)}
        >
          <h5 className="card-title">Register</h5>
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
              />
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

          <input type="submit" className="btn btn-primary m-1" value="Submit" />
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

  onSubmit = (e, formData, props) => {
    e.preventDefault();

    const thisprops = this.props;
    console.log("worked", formData);
    axios
      .post("http://localhost:40951/register", formData)
      .then(function(response) {
        console.log("worked",response);

        const code = response.data; //code mailed from backend
        const data = { formData: formData, code: code };
        thisprops.toggleVerify(data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}
