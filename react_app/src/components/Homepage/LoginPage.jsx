import React from "react";
import Header from "../Header";
import { Modal, ModalHeader } from "reactstrap";
import Verify from "./Verify";
import Login from "./LoginForm";
import Register from "./RegistrationForm";
import Cookies from "js-cookie";
import logo from "../../logo.png";
import jwt_decode from "jwt-decode";
import axios from "axios";
import GoogleLogin from 'react-google-login';

//Login page parent component
class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      verifymodal: false, //state used to show hide modal form
      formData: {},
      showlogin: true, //state used to show login/register form
      type: true, //used to show volunteer/organization forms
      formtype: "Volunteer", //maintain the type
      shouldRender: false
    };
    this.toggleLogin = this.toggleLogin.bind(this);
    this.toggleVerify = this.toggleVerify.bind(this);
    this.toggleType = this.toggleType.bind(this);
    this.onGoogleSignIn = this.onGoogleSignIn.bind(this);
  }
  onGoogleSignIn = (response) => {
    console.log(response);
    
    try {
      var profile = response.profileObj;
      let thisprops = this.props;
      let thisstate = this.state;

      axios
        .post("/google_login", {
          type: this.state.formtype,
          Firstname: profile.givenName,
          Lastname: profile.familyName,
          Organization_name: profile.name,
          Email: profile.email,
          pfp: profile.imageUrl,
          City: "",
          State: ""
        }).then(function(response) {
          let path_type = thisstate.formtype === "Volunteer" ? "/vdashboard/" : "/odashboard/";
          
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
      } catch (error) {
        // browser has cookies disabled
        console.log(error);
      }
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
          <div className=" mx-auto login-container login_con container-fluid ">
            <div className="row">
            {/* <div className="container-fluid">
                  <div className="row my-auto">
                    <div className="col">Connect to the Society</div>
                  </div>
                </div> */}
              <div className="backgrounddiv col-8">
               
              </div>

              <div
                className="col-3
            float-left text-center login-container login-container_1 ml-auto mr-5 pr-xl-5 "
              >
                <div>
                  <img src={logo} alt='' />

                  <div className="mx-3">
                    <div
                      className="btn-group mb-1 typetoggle-div btn-group-toggle"
                      data-toggle="buttons"
                    >
                      <label
                        className="btn btn-info active form-control form-control-lg fontType"
                        onClick={
                          this.state.formtype === "Volunteer"
                          ? null
                          : this.toggleType
                        }
                      >
                        <input
                          type="radio"
                          name="options"
                          id="volForm"
                          autoComplete="off"
                          defaultChecked
                        />{" "}
                        <i className="fas mr-1 fa-hands-helping"></i>
                        Volunteer
                      </label>
                      <label
                        className="btn btn-info form-control form-control-lg fontType"
                        onClick={
                          this.state.formtype === "Organization"
                          ? null
                          : this.toggleType
                        }
                      >
                        <input
                          type="radio"
                          name="options"
                          id="orgForm"
                          autoComplete="off"
                        />{" "}
                        <i className="far mr-1 fa-building"></i>Organization
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
                          toggleLogin={this.toggleLogin}
                        />
                      )}
                      {!this.state.showlogin && (
                        <div className="mx-auto">
                          <hr />

                          <button
                            className="btn text-info fontType"
                            onClick={this.toggleLogin}
                          >
                            <i className="fas mr-1 fa-user"></i>Sign in
                          </button>
                        </div>
                      )}

                      {this.state.showlogin && (
                        //Calling the login component

                        <Login
                          type="Volunteer"
                          toggleVerify={this.toggleVerify}
                          history={this.props.history}
                          toggleLogin={this.toggleLogin}
                        />
                      )}

                      {this.state.showlogin && (
                        <div className=" mx-auto">
                          <hr />
                          <button
                            className="btn text-info fontType"
                            onClick={this.toggleLogin}
                          >
                            <i class="fas text-info fa-user-plus"></i> Register
                            for an account
                          </button>
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
                          toggleLogin={this.toggleLogin}
                        />
                      )}
                      {!this.state.showlogin && (
                        <div className=" mx-auto">
                          <hr />

                          <button
                            className="btn text-info fontType"
                            onClick={this.toggleLogin}
                          >
                            <i className="fas mr-1 fa-user"></i>Sign in
                          </button>
                        </div>
                      )}

                      {this.state.showlogin && (
                        //Calling the login component

                        <Login
                          type="Organization"
                          toggleVerify={this.toggleVerify}
                          history={this.props.history}
                          toggleLogin={this.toggleLogin}
                        />
                      )}
                      {this.state.showlogin && (
                        <div className=" ">
                          <hr />
                          <button
                            className="btn text-info fontType"
                            
                            onClick={this.toggleLogin}
                          >
                            <i className="fas text-info fa-user-plus"></i> Register
                            for an account
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="row mt-1">
                  <div className='container'>
                    <div className='row text-center justify-content-center'  style={{fontWeight:'bold',fontSize:'15px'}}>
                      
                    OR
                    </div>
                    
                    <div className='row'>

                <div className="col text-center justify-content-center">
                Sign In with Google{/*<div id="gbutton" className="g-signin2 d-inline-block align-middle pl-2" data-onsuccess="onGoogleSignIn" data-theme="dark"></div>*/}
                  <GoogleLogin
                    clientId="926515268553-bb97lrsb78c4d3ms5auuuu33sq6vdr2i.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={this.onGoogleSignIn}
                    onFailure={this.onGoogleSignIn}
                    cookiePolicy={'single_host_origin'}
                    className='m-1'
                  />
                </div>
                </div>
                </div>
              </div>
              </div>
            </div>
        
            {/*Verify modal form*/}
            <Modal isOpen={this.state.verifymodal} centered>
              <ModalHeader>
                <input
                  className="btn btn-sm btn-danger mr-2"
                  type="button"
                  value="<"
                  onClick={this.toggleVerify}
                />

                <span className="fontType">
                  Please check your mail for the verification code
                </span>
              </ModalHeader>
              <Verify
                type={this.state.type}
                toggleVerify={this.toggleVerify}
                verifyCode={this.state.formData}
                history={this.props.history}
              />
            </Modal>
          </div>
        </React.Fragment>
      )
    );
  }
}

export default LoginPage;
