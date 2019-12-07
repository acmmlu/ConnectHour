import React, { Component } from "react";
import axios from "axios";
import { Modal, ModalHeader } from "reactstrap";
import Verify from "./Verify";
import Header from "../Header";
import logo from "../../logo.png";

//Reset password (parent) component for login page.
export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      verifymodal: false, //state used to show or hide verify code modal form
      errmsg: "" //stores the errr message to display
    };
    this.toggleVerify = this.toggleVerify.bind(this);
  }

  //function to toggle verify modal state and update the formdata state
  toggleVerify(data) {
    this.setState({ verifymodal: !this.state.verifymodal });
    this.setState({ formData: data });
  }

  render() {
    return (
      <React.Fragment>
        {/*Displaying the reset component that contains the reset form*/}
        <Reset
          toggleVerify={this.toggleVerify}
          type={this.props.location.state.type}
          history={this.props.history}
        />

        {/*Displaying the verify account component */}

        <Modal isOpen={this.state.verifymodal} centered>
          <ModalHeader>
            <input
              className="btn btn-sm btn-danger mr-2"
              type="button"
              value="<"
              onClick={this.toggleVerify}
            />
            <span className="fontType">
              Please check your mail and enter the code
            </span>
          </ModalHeader>
          <Verify
            type={this.state.type}
            toggleVerify={this.toggleVerify}
            verifyCode={this.state.formData}
            history={this.props.history}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

//the reset password child component
class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //formadata is used to store the input values of the user
      formData: {
        type: this.props.type,
        formname: "reset",
        email: "",
        new_password: "",
        repeat_new_password: "",
        Verified: "false"
      },
      //state used for password validation
      passreq: false
    };
  }

  //funtion for changing passreq state
  togglereq = () => {
    this.setState({
      passreq: true
    });
  };

  render() {
    
      /*USed for password validation*/
    
    const lc = /[a-z]/g;
    
      /*lowercase*/
    
    const uc = /[A-Z]/g;
    
      /*upercase*/
    
    const num = /[0-9]/g;
    
      /*number*/
    

    return (
      <React.Fragment>
        <Header />
        <div className=" mx-auto login-container login_con container-fluid ">
          <div className="row">
            <div className="backgrounddiv col-8 "></div>

            <div
              id="resetForm "
              className="  reset-container col-3
            float-left text-center login-container login-container_1 ml-auto mr-5 pr-xl-5 "
            >
              <div>
                <img src={logo} alt=''/>
                <div className="container">
                  <div className="row">
                    <div className="">
                      <button
                        className="btn  float-left btn-sm btn-danger "
                        onClick={() => this.props.history.goBack()}
                      >
                        <i class="fas fa-chevron-left"></i>
                      </button>
                    </div>
                    <h4 className="card-title mr-4 text-info col fontType">
                      Reset Password{" "}
                    </h4>
                  </div>
                </div>

                <div className="text-danger">{this.state.errmsg}</div>
                <form onSubmit={e => this.onSubmit(e, this.state.formData)}>
                  <div className="row">
                    <div className="col py-1">
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-lg fontType"
                        placeholder="Enter email"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col py-1">
                      <input
                        type="password"
                        name="new_password"
                        className="form-control form-control-lg fontType"
                        placeholder="Enter new password"
                        onChange={this.handleInputChange}
                        onFocus={this.togglereq}
                        required
                      />
                      {/*Password validation */}
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
                    <div className="col py-1">
                      {this.state.formData.new_password !==
                        this.state.formData.repeat_new_password && (
                        <span className="text-danger fontType">
                          Password Does Not Match
                        </span>
                      )}
                      <input
                        type="password"
                        name="repeat_new_password"
                        placeholder="Re-enter new password"
                        className="form-control form-control-lg fontType"
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <input
                    type="submit"
                    className="btn btn-primary my-1  btn-lg btn-block fontType"
                    value="Submit"
                    disabled={
                      this.state.formData.new_password !==
                        this.state.formData.repeat_new_password ||
                      this.state.formData.repeat_new_password === "" ||
                      this.state.formData.email === "" ||
                      this.state.formData.new_password.length < 8 ||
                      this.state.formData.new_password.match(num) === null ||
                      this.state.formData.new_password.match(num) === null ||
                      this.state.formData.new_password.match(lc) === null
                    }
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
  //HAndle change function for updating form inout values
  handleInputChange = e => {
    let formData = { ...this.state.formData };
    formData[e.target.name] = e.target.value;
    this.setState({
      formData
    });
  };
  resetErr() {
    this.setState({ errmsg: "Account Does Not Exists" });
  }

  //function to clear error message
  noresetErr() {
    this.setState({ errmsg: "" });
  }
  //on submit function
  onSubmit = (e, formData) => {
    e.preventDefault();

    const thisprops = this.props;
    const p = this;
    //request to backend
    axios
      .post("/reset_password", formData)
      .then(function(response, props) {
        p.noresetErr();
        const code = response.data; //store the verification code
        const data = { formData: formData, code: code };
        thisprops.toggleVerify(data); //toggle the modal state to show verification form
      })
      .catch(function(error) {
        p.resetErr();
        console.log(error);
      });
  };
}
