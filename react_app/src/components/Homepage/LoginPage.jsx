import React, { Component } from "react";
import Header from "../Header";
import { Modal, ModalHeader } from "reactstrap";
import Verify from "./Verify";
import Login from "./LoginForm";
import Register from "./RegistrationForm";
import Cookies from "js-cookie";
import logo from "../../logo.png";
import jwt_decode from "jwt-decode";
import axios from "axios";

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
      shouldRender: false
    };
    this.toggleLogin = this.toggleLogin.bind(this);
    this.toggleVerify = this.toggleVerify.bind(this);
    this.toggleType = this.toggleType.bind(this);
    this.onGoogleSignIn = this.onGoogleSignIn.bind(this);
  }

  onGoogleSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    let thisprops = this.props;

    axios
      .post("/google_login", {
        type: this.state.formtype,
        Firstname: profile.getGivenName(),
        Lastname: profile.getFamilyName(),
        Organization_name: profile.getName(),
        Email: profile.getEmail(),
        pfp: profile.getImageUrl(),
        City: "",
        State: ""
      }).then(function(response) {
        let path_type = "";
        
        if (this.state.formtype === "Volunteer") {
          path_type = "/vdashboard/";
        } else {
          path_type = "/odashboard/";
        }
        
        let token = response.data.jwt;
        let ID = jwt_decode(String(token)).uid;
        console.log(path_type + ID);

        Cookies.remove("token", {});
        Cookies.remove("type");
        Cookies.set("token", token);

        Cookies.set("type", path_type);
        thisprops.history.push(path_type + ID);
            
      }).catch(function(err) {
        console.log(err);
      });
    // console.log("ID: " + profile.getId());
    // console.log('Full Name: ' + profile.getName());
    // console.log('Given Name: ' + profile.getGivenName());
    // console.log('Family Name: ' + profile.getFamilyName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail());

    // var id_token = googleUser.getAuthResponse().id_token;
    // console.log("ID Token: " + id_token);
  }

  componentDidMount() {
    if (Cookies.get("token")) {
      window.location.href =
        Cookies.get("type") + jwt_decode(Cookies.get("token")).uid;
    } else {
      this.setState({ shouldRender: true });
    }
    
    window.gapi.signin2.render('gbutton', {
      'scope': 'profile email',
      'longtitle': true,
      'onsuccess': this.onGoogleSignIn,
    });
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
      shouldRender && (
        <React.Fragment>
          <Header />
          <div className="row mx-auto ">
             <div className="backgrounddiv col-8"></div>
            <div className="container-fluid col-3  text-center mr-5 login-container pr-xl-5">
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
                        id="volForm"
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
                        id="orgForm"
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
              <div className="row mt-1">
                <div className="col text-center justify-content-center">
                  Or Sign In with Google <div className="g-signin2 d-inline-block align-middle pl-2" data-onsuccess="onGoogleSignIn" data-theme="dark"></div>
                </div>
              </div>
              {/*Verify modal form*/}
              <Modal isOpen={this.state.verifymodal}>
                <ModalHeader>Please check your mail and enter the code</ModalHeader>
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
      )
    );
  }
}

export default LoginPage;
