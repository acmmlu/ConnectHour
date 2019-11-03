import React from "react";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import VolLayout from "./VolLayout";

class VolProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        AccountName: "",
        pfp: "",
        Email: "",
        Description: "",
        StreetName: "",
        StreetNumber: "",
        City: "",
        State: "",
        ZIP: ""
      },
      id: "",
      Editing: false
    };

    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount = () => {
    console.log(Cookies.get());

    if (Cookies.get("token") && Cookies.get("type") === "/vdashboard/") {
      const ID = jwt_decode(Cookies.get("token")).uid;
      const p = this;
      axios
        .get("/volunteer/" + ID)
        .then(function(response) {
          p.setState({ formData: response.data });
          console.log(p.state.formData, response);
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      this.props.history.push("/");
    }
  };

  handleChange(event) {
    let formData = this.state.formData;
    formData[event.target.id] = event.target.value;
    this.setState({
      formData
    });
  }

  toggleEditMode() {
    if (this.state.Editing) {
      for (let e of document.getElementsByClassName("toggleedit")) {
        e.readOnly = true;
      }
      let submit = document.getElementById("submit");
      submit.innerHTML = "Edit";
      this.setState({ Editing: false });
    } else {
      for (let e of document.getElementsByClassName("toggleedit")) {
        e.readOnly = false;
      }
      let submit = document.getElementById("submit");
      submit.innerHTML = "Save";
      this.setState({ Editing: true });
    }
  }

//   populateFields() {
//     for (let e of document.getElementsByClassName("toggleedit")) {
//       e.value = this.state.formData[e.id];
//     }
//   }
  render() {
    return (
      <>
        <VolLayout />
        <div className=" topdist container volprofile">
          <form onSubmit={e => this.onSubmit(e, this.state.formData)}>
            <div className="row mb-5" style={{ marginTop: "20px" }}>
              <div className="col-4">
                <img
                  src=""
                  className="img-thumbnail"
                  style={{ width: "200px", height: "200px" }}
                />
                {/* Profile picture here */}
              </div>
              <div className="col-8">
                <div className="row h-100 align-items-center justify-content-start">
                  <div className="col-5">
                    <h5 id="AccountName" className="font-weight-bold">
                      {this.state.formData.FirstName} {this.state.formData.LastName}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="row pt-3 pb-3 mb-4 justify-content-start bg-light">
              <div className="col-12">
                <h3 htmlFor="Description">Description</h3>
                <textarea
                  id="Description"
                  placeholder="Description"
                  className="form-control toggleedit"
                  onChange={this.handleChange}
                  defaultValue={this.state.formData.Description}
                  readOnly
                />
              </div>
            </div>
            <div className="row pt-3 mb-2 bg-light d-flex justify-content-center">
              <div className="col">
                <div className="row mb-5">
                  {" "}
                  {/* Address Section */}
                  <div className="col">
                    <h3>Address Info</h3>
                  </div>
                </div>
                <div className="row mb-5 pr-2">
                  {" "}
                  {/* Building No. & Street Name */}
                  <div className="col-2">
                    <h5 className="text-right"> Street Number</h5>
                  </div>
                  <div className="col-2">
                    <input
                      id="StreetNumber"
                      type="text"
                      placeholder=""
                      className="form-control toggleedit"
                      onChange={this.handleChange}
                      defaultValue={this.state.formData.StreetNumber}
                      readOnly
                    />
                  </div>
                  <div className="col-2">
                    <h5 className="text-right">Street</h5>
                  </div>
                  <div className="col-5">
                    <input
                      id="StreetName"
                      type="text"
                      placeholder="Address"
                      className="form-control toggleedit"
                      onChange={this.handleChange}
                      defaultValue={this.state.formData.StreetName}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row mb-5 pr-2">
                  {" "}
                  {/* City & State */}
                  <div className="col-2">
                    <h5 className="text-right">City</h5>
                  </div>
                  <div className="col-5">
                    <input
                      id="City"
                      type="text"
                      placeholder="City"
                      className="form-control toggleedit"
                      onChange={this.handleChange}
                      defaultValue={this.state.formData.City}
                      readOnly
                    />
                  </div>
                  <div className="col-2">
                    <h5 className="text-right">State</h5>
                  </div>
                  <div className="col-2">
                    <input
                      id="State"
                      type="text"
                      placeholder="State"
                      className="form-control toggleedit"
                      defaultValue={this.state.formData.State}
                      onChange={this.handleChange}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row mb-5 pr-2">
                  {" "}
                  {/* Zip & Buttons*/}
                  <div className="col-2">
                    <h5 className="text-right">Zip</h5>
                  </div>
                  <div className="col-2">
                    <input
                      id="ZIP"
                      type="text"
                      placeholder="Zip Code"
                      className="form-control toggleedit"
                      onChange={this.handleChange}
                      defaultValue={this.state.formData.ZIP}
                      readOnly
                    />
                  </div>
                  <div className="col-4"></div>
                  <div className="col-1">
                    <button
                      id="submit"
                      type="submit"
                      className="btn btn-primary visible"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row pt-3 pb-3 mb-4 justify-content-start bg-light">
              <div className="col-12">
                <h3 htmlFor="Description">Contact Info</h3>
                <div className="col-5">
                  <h5 id="AccountEmail">Email:  {this.state.formData.Email}</h5>
                </div>{" "}
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }

  onSubmit = (e, formData) => {
    e.preventDefault();
    let submit = document.getElementById("submit");

    if (submit.innerHTML === "Save") {
      this.toggleEditMode();
      const ID = jwt_decode(Cookies.get("token")).uid;
      console.log(formData);
      const p = this.props;
      axios
        .put("/volunteer/" + ID, formData)
        .then(function(response, props) {
          console.log(response);
           window.location.reload();
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      this.toggleEditMode();
    }
  };
}

export default VolProfile;
