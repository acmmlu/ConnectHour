import axios from "axios";
import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

const recaptchaRef = React.createRef();

//Register child component
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
        repeat_password: "",
        State: "",
        Verified: "false",
        passreq: false //used for password validation
      },
      errmsg: "" //stores the errr message to display
    };
    this.isVerified = this.isVerified.bind(this);
  }
  isVerified() {
    let formData = this.state.formData;
    formData.Verified = true;
    this.setState({
      Verified: true
    });
  }
  render() {
    //formadata is used to store the input values of the user

    const lc = /[a-z]/g;
    const uc = /[A-Z]/g;
    const num = /[0-9]/g;

    return (
      <div id="RegisterForm" className="container  ">
        <form
          className="text-center"
          onSubmit={e => this.onSubmit(e, this.state.formData)}
        >
          <h4 className="card-title text-info fontType" style={{fontWeight:'bold'}}>
            {" "}
            {this.state.formData.type} Registration
          </h4>
          <div className="text-danger">{this.state.errmsg}</div>

          {/*Form field to display if a volunteer */}
          {this.state.formData.type === "Volunteer" && (
            <div className="row">
              <div className="col p-1">
                <input
                  type="text"
                  name="Firstname"
                  onChange={this.handleInputChange}
                  className="form-control form-control-lg fontType"
                  placeholder="First name..."
                  required
                />
              </div>
              <div className="col p-1">
                <input
                  type="text"
                  name="Lastname"
                  onChange={this.handleInputChange}
                  className="form-control form-control-lg fontType"
                  placeholder="Last name..."
                  required
                />
              </div>
            </div>
          )}
          {/*Form field to display if an Organization */}

          {this.state.formData.type === "Organization" && (
            <div className="row">
              <div className="col p-1">
                <input
                  type="text"
                  name="Organization_name"
                  onChange={this.handleInputChange}
                  className="form-control form-control-lg fontType"
                  placeholder="Organisation name..."
                  required
                />
              </div>
            </div>
          )}

          <div className="row">
            <div className="col p-1">
              <input
                type="email"
                name="Email"
                onChange={this.handleInputChange}
                className="form-control form-control-lg fontType" 
                placeholder="Email..."
                required
              />
            </div>
          </div>
          <div className="row">
            <div className=" col p-1">
              <input
                type="password"
                name="Password"
                onChange={this.handleInputChange}
                className="form-control form-control-lg fontType"
                placeholder="Password..."
                required
                onFocus={this.togglereq}
              />
              {/*Password validation */}
              {this.state.passreq && (
                <div className="mt-1">
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
            <div className="col p-1">
              {this.state.formData.Password !==
                this.state.formData.repeat_password && (
                <span className="text-danger">Password Does Not Match</span>
              )}
              <input
                type="password"
                name="repeat_password"
                placeholder="Re-enter new password..."
                className="form-control form-control-lg fontType"
                onChange={this.handleInputChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className=" col p-1">
              <input
                type="text"
                name="City"
                onChange={this.handleInputChange}
                className="form-control form-control-lg fontType"
                placeholder="City..."
                required
              />
            </div>
            <div className=" col p-1">
              <input
                type="text"
                name="State"
                onChange={this.handleInputChange}
                className="form-control form-control-lg fontType"
                placeholder="State..."
                required
              />
            </div>
          </div>
          <div className="row my-1">
            <div className="my-auto col p-1">
              <button
                className="btn btn-primary btn-lg btn-block fontType"
                disabled={
                  this.state.formData.Password !==
                    this.state.formData.repeat_password ||
                  this.state.formData.repeat_password === "" ||
                  this.state.formData.Email === "" ||
                  this.state.formData.Password.length < 8 ||
                  this.state.formData.Password.match(num) === null ||
                  this.state.formData.Password.match(num) === null ||
                  this.state.formData.Password.match(lc) === null
                }
              >
                Register<i class="fas ml-1 fa-sign-in-alt"></i>
              </button>
            </div>
          </div>
          <div className="row mx-auto">
            <div className="my-auto col">
          <ReCAPTCHA
            ref={recaptchaRef}
            onChange={this.isVerified}
            sitekey="6Lehb8QUAAAAAAiJMvm-IETRGme1_i-8-DgawbzF"
          /></div></div>
        </form>
      </div>
    );
  }

  //handle input change and upate field values
  handleInputChange = e => {
    let formData = { ...this.state.formData };
    formData[e.target.name] = e.target.value;
    this.setState({
      formData
    });
  };

  //toggle password validing state
  togglereq = () => {
    this.setState({
      passreq: true
    });
  };

  //function to change error message
  regErr() {
    this.setState({ errmsg: "Account Already Exists" });
  }

  //function to clear error message
  noregErr() {
    this.setState({ errmsg: "" });
  }

  //On submit function
  onSubmit = (e, formData, props) => {
    e.preventDefault();
    const p = this;
    //request to backend
    if (this.state.formData.Verified === true) {
      this.setState({ errmsg: "" });

      axios
        .post("/register", formData)
        .then(function(response, props) {
          p.noregErr(); //clear the error message
          p.props.toggleLogin();
        })
        .catch(function(error) {
          p.regErr(); //show the error message
          console.log(error);
        });
    } else {
      this.setState({ errmsg: "Please verify that you are Human." });
    }
  };
}

export default Register;
