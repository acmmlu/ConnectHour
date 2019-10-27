import React, { Component } from "react";
import Header from "../Header";
import { Modal, ModalHeader } from "reactstrap";
import Verify from "./Verify";
import Login from "./LoginForm";
import Register from "./RegistrationForm";
import Cookies from "js-cookie";
import logo from "../../logo.png";
import jwt_decode from "jwt-decode";

//Login page parent component
class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      verifymodal: false, //state used to show hide modal form
      formData: {},
      showlogin: true, //state used to show login/register form
      type: true, //used to show volunteer/organization forms
      formtype: "Organization", //maintain the type
      shouldRender:false
    };
    this.toggleLogin = this.toggleLogin.bind(this);
    this.toggleVerify = this.toggleVerify.bind(this);
    this.toggleType = this.toggleType.bind(this);
  }
  componentDidMount() {
  
    if (Cookies.get("token")) {
      console.log('a')
       window.location.href = Cookies.get("type")+(jwt_decode(Cookies.get("token"))).uid
       
    }else{this.setState({ shouldRender: true });}
  }
  //function to hide/show verify form
  toggleVerify(data) {
    this.setState({ verifymodal: !this.state.verifymodal });
    this.setState({ formData: data });
  }

  //function to hide/show login/register form
  toggleLogin() {
    this.setState({ showlogin: !this.state.showlogin });
  }

  //function to maintain the user type
  toggleType() {
    this.setState({ type: !this.state.type });
    if (this.state.formtype === "Volunteer") {
      this.setState({ formtype: "Organization" });
    } else {
      this.setState({ formtype: "Volunteer" });
    }
  }

  render() {
    const { shouldRender } = this.state;
    return (
      shouldRender &&
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
                  {/*Forms for Volunteer type*/}
                  {!this.state.showlogin && (
                    //*Calling the regiter component
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
                    //Calling the login component

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

              {/*Forms for Organization type*/}
              {!this.state.type && (
                <div>
                  {!this.state.showlogin && (
                    //Calling the REgister component

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
                    //Calling the login component

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
            {/*Verify modal form*/}
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

export default LoginPage;
