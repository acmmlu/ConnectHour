import React, { Component } from "react";
import axios from "axios";
import { Modal, ModalHeader } from "reactstrap";
import { Button } from "react-bootstrap";
import Verify from "./Verify";
import Header from "../Header";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import logo from "../../logo.png";
import head from "../Login.png";

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifymodal: false,
   
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
      <Reset toggleVerify={this.toggleVerify} type={this.props.location.state.type}  history={this.props.history}/>
      <Modal isOpen={this.state.verifymodal}>
      <ModalHeader>Verify</ModalHeader>
      <Verify
        type={this.state.type}
        toggleVerify={this.toggleVerify}
        verifyCode={this.state.formData}
        history={this.props.history}
      />

    </Modal>
    </React.Fragment>
    )
  
  
  }}
  class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        type: this.props.type,
        formname: "reset",
        email: "",
        new_password: "",
        repeat_new_password: "",
        Verified: "false"
      },
    
      passreq: false
    };
  
  }
  togglereq = () => {
    this.setState({
      passreq: true
    });
  }

  render() {
    const lc = /[a-z]/g;
    const uc = /[A-Z]/g;
    const num = /[0-9]/g;

    return (
      <React.Fragment>
        <Header />
        <div className="row">
          <div className="backgrounddiv col-8 "></div>

          <div
            id="resetForm "
            className="  mr-5 container col-3 text-center  reset-container"
          >
            <div>
              <img src={logo} />
              <h5 className="card-title text-info">Reset Password</h5>
             

              <form onSubmit={e => this.onSubmit(e, this.state.formData)}>
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
                      name="new_password"
                      className="form-control"
                      placeholder="Enter new password"
                      
                      onChange={this.handleInputChange}
                      onFocus={this.togglereq}
                      required
                    />
                    {this.state.passreq && (
                      <div className="mt-1">
                        <h5>Password should contain </h5>
                        <ul>
                          {this.state.formData.new_password.length >= 8 ? (
                            <li className="text-success">
                              more than or equal to 8 characters
                            </li>
                          ) : (
                            <li className="text-danger">
                              more than or equal to 8 characters
                            </li>
                          )}
                          {this.state.formData.new_password.match(num) ? (
                            <li className="text-success">a number</li>
                          ) : (
                            <li className="text-danger">a number</li>
                          )}
                          {this.state.formData.new_password.match(uc) ? (
                            <li className="text-success">
                              a character in uppercase
                            </li>
                          ) : (
                            <li className="text-danger">
                              a character in uppercase
                            </li>
                          )}
                          {this.state.formData.new_password.match(lc) ? (
                            <li className="text-success">
                              a character in lowercase
                            </li>
                          ) : (
                            <li className="text-danger">
                              a character in lowercase
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col p-2">
                  {this.state.formData.new_password !=
                this.state.formData.repeat_new_password && (
                <span className="text-danger">Password Does Not Match</span>
              )}
                    <input
                      type="password"
                      name="repeat_new_password"
                      placeholder="Re-enter new password"
                      className="form-control"
                    
                      onChange={this.handleInputChange}
                      required
                    />
                  </div>
                </div>
                <input
                  type="submit"
                  className="btn btn-primary m-auto"
                  value="Submit"
                  disabled={
                    this.state.formData.new_password !=
                      this.state.formData.repeat_new_password ||
                    this.state.formData.repeat_new_password === "" ||
                    this.state.formData.email === "" ||
                    this.state.formData.new_password.length <8 ||
                    this.state.formData.new_password.match(num)===null||
                    this.state.formData.new_password.match(num)===null||
                    this.state.formData.new_password.match(lc)===null
                  }
                />
              </form>
              <div className="col mt-2 ">
                <input
                  className="btn btn-danger m-auto"
                  type="button"
                  value="Back"
                  onClick={() => this.props.history.goBack()}
                />
              </div>
            </div>
          
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleInputChange = e => {
    let formData = { ...this.state.formData };
    formData[e.target.name] = e.target.value;
    this.setState({
      formData
    });
  };

  onSubmit = (e, formData) => {
    e.preventDefault();
    const p = this.props;
    axios
      .post("http://localhost:40951/reset_password", formData)
      .then(function(response, props) {
        const code = parseInt(response.data);
        const data = { formData: formData, code: code };
       
        p.toggleVerify(data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}
