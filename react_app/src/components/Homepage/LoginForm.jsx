import axios from "axios";
import React, { Component } from "react";
import {  Link } from "react-router-dom";

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
      <div id="Login_form" className=" px-3 ">
        <h4 className="card-title text-info fontType">
          {" "}
          {this.state.formData.type} Login
        </h4>
        <div className="text-danger">{this.state.errmsg}</div>
        <form
          className="text-center"
          onSubmit={e => this.onSubmit(e, this.state.formData)}
        >
          <div className="row">
            <div className="col py-1 px-3">
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
            <div className="col py-1 px-3">
              <input
                type="password"
                name="password"
                className="form-control form-control-lg fontType"
                placeholder="Enter password"
                value={this.state.password}
                onChange={this.handleInputChange}
                required
              />
            </div>
          </div>
          <div className='row pt-2'>
          <div className="mx-auto col">
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block fontType"
              >Login<i class="fas ml-1 fa-sign-in-alt"></i></button>
</div>

            </div>
            <div className='row'>
          <div className=" col">
               {/*show if type is volunteer */}
        {this.state.formData.type === "Volunteer" && (
          <div className="float-left ">
            <i class="fas fa-key mr-1"></i>
          <Link
            to={{
              pathname: "/volunteer/reset",
              state: { type: this.state.formData.type }
            }}
            className="text-center fontType"
          >
            Forgot your password?
          </Link>
          </div>
        )}
        {/*show if type is Organization */}
        {this.state.formData.type ==="Organization" && (
          <div className="float-left">
            <i class="fas fa-key mr-1"></i>
          <Link
            to={{
              pathname: "/organization/reset",
              state: { type: this.state.formData.type }
            }}
            className="text-center fontType"
          >
            Forgot your password?
          </Link>
          </div>
        )}
            
         
            </div>
          </div>
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
        if (error.status === 401) {
          p.loginErr(); //display the error message
        }
      });
  };
}

export default Login;
