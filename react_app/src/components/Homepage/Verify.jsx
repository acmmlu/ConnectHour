import React from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import Header from '../Header'



import { createBrowserHistory } from "history";

const history = createBrowserHistory();

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
  toggleErrmMsg() {
    this.setState({
      errmsg: !this.state.errmsg
    });
  }

  render() {
    return (<React.Fragment>
     

      <div id="Volunteer_form" className="card  mb-3 p-4 ">
   
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

          <input type="submit" className="btn btn-primary m-1" value="Submit" />
        </form>
        
        <input
          className="btn btn-danger m-auto"
          type='button'
          value='Close'
          onClick={this.props.toggleVerify}
        />

      </div>
      </React.Fragment>
    );
  }

  handleInputChange = e => {
    this.setState({ code: e.target.value });
  };
 

  onSubmit = e => {
    e.preventDefault();

    
    //redirect to dashboard
    console.log(this.props.verifyCode)

    console.log(this.props.verifyCode.code,this.state.code)

    if (this.props.verifyCode.code.verification_token=== parseInt(this.state.code)) {
      console.log('in',this.props.verifyCode.code.verification_token,this.state.code)

      this.props.verifyCode["formData"]["Verified"] = "True";
      const type = this.props.verifyCode["formData"]["type"];
    const fname = this.props.verifyCode["formData"]["formname"];
    const thisprops=this.props

      if (this.state.errmsg) {
        this.toggleErrmMsg();
      }
      if (type === "Volunteer" ) {
        
        if (fname === "login" || fname==='Volunteerlogin') {
          //redirect to dashboard
         
          axios
            .post(
              "http://localhost:40951/login",
              this.props.verifyCode["formData"]
            )
            .then(function(response) {
              console.log('response',response)
              const ID=response.data.id
               thisprops.history.push('/vdashboard/'+ID)
              console.log("Volunteer Logged in",response);
              
            })
            .catch(function(error) {
              console.log(error);
              //Perform action based on error
            });
        }
        if (fname === "VolunteerRegister") {
          
          //redirect to dashboard
          axios
            .post(
              "http://localhost:40951/register",
              this.props.verifyCode["formData"]
            )
            .then(function(response) {

             
              thisprops.toggleVerify()
              window.location.reload();
              console.log(response);
             
            })
            .catch(function(error) {
              console.log(error);
              //Perform action based on error
            });
        }
        if (fname === "reset"|| fname==='Volunteerreset') {
          
          //alert and redirect to login
          axios
            .post(
              "http://localhost:40951/reset_password",
              this.props.verifyCode["formData"]
            )
            .then(function(response) {
              thisprops.toggleVerify()
              thisprops.history.push('/')
            })
            .catch(function(error) {
              console.log(error);
              //Perform action based on error
            });
        }
      }

      if (type === "Organization") {
        if (fname === "login" || fname==='Organiztionlogin') {
          //redirect to dashboard
          axios
            .post(
              "http://localhost:40951/login",
              this.props.verifyCode["formData"]
            )
            .then(function(response) {
              const ID=response.data.id
              thisprops.history.push('/odashboard/'+ID)

              console.log("Organization loggedin");
            })
            .catch(function(error) {
              console.log("Account does not Exists");
              //Perform action based on error
            });
        }
        if (fname === "OrganizationRegister") {
          //redirect to dashboard
          axios
            .post(
              "http://localhost:40591/register",
              this.props.verifyCode["formData"]
            )
            .then(function(response) {
              console.log("Organization registered");
            })
            .catch(function(error) {
              thisprops.history.push('/')

              console.log("Account Exists");
              //Perform action based on error
            });
        }
        if (fname === "reset" || fname==='Organizationreset') {
          //alert and redirect to login
          axios
            .post(
              "http://localhost:40591/reset_password",
              this.props.verifyCode["formData"]
            )
            .then(function(response) {
              thisprops.history.push('/')

              console.log("Organization Password reset");
            })
            .catch(function(error) {
              console.log("error");
              //Perform action based on error
            });
        }
      }

      //Perform action based on response redirect
    } else {
      if (!this.state.errmsg) {
        this.toggleErrmMsg();
      }
    }
  };
}

export default Verify;
