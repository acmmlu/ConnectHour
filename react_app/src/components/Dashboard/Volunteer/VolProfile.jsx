import React from "react";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import VolLayout from "./VolLayout";
import user from "../../user.png";
import { ListGroup, ListGroupItem } from "reactstrap";
import {
  Modal,
  ModalBody,
 
} from "reactstrap";

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
        // StreetNumber: "",
        City: "",
        State: "",
        ZIP: ""
      },
      subscribedOrg: [],
      id: "",
      Editing: false
    };
    this.toggleEditForm = this.toggleEditForm.bind(this);

    // this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount = () => {
    console.log('mount')
    if (Cookies.get("token") && Cookies.get("type") === "/vdashboard/") {
      console.log('in')
      const ID = jwt_decode(Cookies.get("token")).uid;
      const p = this;
      axios
        .get("/volunteer/" + ID)
        .then(function(response) {
          p.setState({ formData: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });

      axios
        .get("/event/get_subscribed_org/" + ID)
        .then(function(response) {
          p.setState({ subscribedOrg: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      console.log('out')
      this.props.history.push("/");
    }
  };

  toggleEditForm() {
    this.setState({ Editing: !this.state.Editing });
   
  }

  // handleChange(event) {
  //   let formData = this.state.formData;
  //   formData[event.target.id] = event.target.value;
  //   this.setState({
  //     formData
  //   });
  // }

  // toggleEditMode() {
  //   if (this.state.Editing) {
  //     for (let e of document.getElementsByClassName("toggleedit")) {
  //       e.readOnly = true;
  //     }
  //     let submit = document.getElementById("submit");
  //     submit.innerHTML = "Edit";
  //     this.setState({ Editing: false });
  //   } else {
  //     for (let e of document.getElementsByClassName("toggleedit")) {
  //       e.readOnly = false;
  //     }
  //     let submit = document.getElementById("submit");
  //     submit.innerHTML = "Save";
  //     this.setState({ Editing: true });
  //   }
  // }

  //   populateFields() {
  //     for (let e of document.getElementsByClassName("toggleedit")) {
  //       e.value = this.state.formData[e.id];
  //     }
  //   }
  render() {
    console.log('mount')

    return (
      <>
        <div className="container">
          <div className="row justify-content-center">
            <form
              className=" topdist  volprofile col-8"
              onSubmit={e => this.onSubmit(e, this.state.formData)}
            ><div className="container">
            <div className="row" style={{ marginTop: "20px" }}>
              <div className="col">
                <img
                  src={user}
                  className="img-thumbnail shadow p-3 bg-white rounded"
                  style={{ width: "200px", height: "200px" }}
                />
                {/* Profile picture here */}
              </div>
              <div className="col-8 ">
                <div className="container">
                  <div className="row h-100 ">
                    <div className="col-9">
                      <h5 id="AccountName" className=" m-auto display-4">
                        {this.state.formData.FirstName}{" "}
                        {this.state.formData.LastName}{" "}
                      </h5>{" "}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <h5 className=" m-auto " id="AccountEmail">
                        Email ID: {this.state.formData.Email}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row m-2 p-3 shadow  bg-white rounded">
            <div className="col-12">
              <h3 htmlFor="Description">About Me</h3>
              {this.state.formData.Description}
            </div>
          </div>
          <div className="row  d-flex  m-2 p-3 card shadow  bg-white rounded ">
            <div className="col">
              <div className="container">
                <div className="row">
                  {" "}
                  {/* Address Section */}
                  <div className="col">
                    <h3>Address Info</h3>
                  </div>
                </div>

                <div className="row m-1 justify-content-left">
                  {" "}
                  {/* City & State */}
                  {this.state.formData.StreetName},
                  {this.state.formData.City},{this.state.formData.State},
                  {this.state.formData.ZIP}
                </div>
              </div>
            </div>
          </div>
          <div className="row ">
  <div className="col-1 m-auto">
     <button
      type="button"
      onClick={this.toggleEditForm}
      className="btn btn-info visible"
    >
      Edit
    </button>
  </div>
 </div>
              <div className="row m-2 p-3 shadow  bg-white rounded">
                <div className="col-12">
                  <h3>Subscribed Oragnizatons</h3>
                  <ListGroup>
                    {this.state.subscribedOrg.map(subscribedOrg => (
                      <SubscribedOrg
                     
                        history={this.props.history}
                        org={subscribedOrg}
                      />
                    ))}
                  </ListGroup>
                </div>
              </div>
            </form>
          </div>
          <Modal isOpen={this.state.Editing} centered>
            <ModalBody>
              <ProfileEdit
                formData={this.state.formData}
                toggleEditForm={this.toggleEditForm}
               
              />
            </ModalBody>
          </Modal>
        </div>
      </>
    );
  }

  // onSubmit = (e, formData) => {
  //   e.preventDefault();
  //   let submit = document.getElementById("submit");
  //   if (submit.innerHTML === "Save") {
  //     const ID = jwt_decode(Cookies.get("token")).uid;
  //     const p = this.props;
  //     axios
  //       .put("http://localhost:40951/volunteer/" + ID, formData)
  //       .then(function(response, props) {
  //         window.location.reload();
  //       })
  //       .catch(function(error) {
  //         console.log(error);
  //       });
  //   } else {
  //     this.toggleEditMode();
  //   }
  // };
}

class SubscribedOrg extends React.Component {
  constructor(props) {
    super(props);
  }

  orgProfile = e => {
    const id = e.target.id;
    const t = this;
    t.props.history.push({
      pathname: "/vdashboard/profile/organizer/" + id,
      state: { oid: id }
    });
  };

  render() {
    return (
      <ListGroupItem
        onClick={this.orgProfile}
        key={this.props.org.orgId}
        id={this.props.org.orgId}
      >
        <span className="mx-1">{this.props.org.Name}</span>
        <span className="mx-1">({this.props.org.Email})</span>
      </ListGroupItem>
    );
  }
}



class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        AccountName: "",
        pfp: "",
        Email: "",
        Description: this.props.formData.Description,
        StreetName: this.props.formData.StreetName,
        StreetNumber: "",
        City: this.props.formData.City,
        State: this.props.formData.State,
        ZIP:  this.props.formData.ZIP
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
 
  render() {
   
    return (
      <>
        <div>
          Edit Details
          <form
            className="card  "
            onSubmit={e => this.onSubmit(e, this.state.formData)}
          >
            <div className="form-group row pl-4 pr-4 text-center">
              <label htmlFor="description">About Me:</label>
              <textarea
                className="form-control pr-3 "
                onChange={this.handleChange}
                name="Description"
                id="Description"
                value={this.state.formData.Description}
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-group row pl-4 pr-4 text-center">
              <label htmlFor="StreetName">Street Name:</label>
              <input
                type="text"
                onChange={this.handleChange}
                className="form-control "
                name="StreetName"
                id="StreetName"
                value={this.state.formData.StreetName}
                required
              />
            </div>

            <div className="form-group row px-4">
              <label htmlFor="City" className=" pt-2  col-2">
                City:
              </label>
              <input
                type="text"
                onChange={this.handleChange}
                className="form-control col-4"
                name="City"
                id="City"
                value={this.state.formData.City}
                required
              />
              <label htmlFor="State" className=" pt-2 col-2">
                State:
              </label>
              <input
                type="text"
                onChange={this.handleChange}
                className="form-control col-4"
                name="State"
                id="State"
                value={this.state.formData.State}
                required
              />
            </div>
            <div className="form-group row px-4">
              <label htmlFor="ZIP" className=" pt-2 col-2">
                ZIP:
              </label>
              <input
                pattern="[0-9]{5}"
                title="Please Enter Valid Zip"
                type="text"
                onChange={this.handleChange}
                className="form-control col-4"
                name="ZIP"
                value={this.state.formData.ZIP}
                id="ZIP"
                required
              />
            </div>

            <div className=" text-center m-2">
              <span className=" m-2 ">
                <input type="submit" className="btn btn-info " value="Submit" />
              </span>
              <span className=" m-2 ">
                <input
                  type="button"
                  className="btn btn-danger "
                  onClick={this.props.toggleEditForm}
                  value="Close"
                />
              </span>
            </div>
          </form>
        </div>
      </>
    );
  }
  handleChange(event) {
    let formData = this.state.formData;
    formData[event.target.id] = event.target.value;
    this.setState({
      formData
    });
  }

  onSubmit = (e, formData) => {
    e.preventDefault();
    const p = this.props;
    let f = this.props.formData;
    const t = this;
    axios
      .put("/volunteer/" + jwt_decode(Cookies.get("token")).uid, formData)
      .then(function(response, props) {


        // window.location.reload();
        f.Description = formData.Description;
        f.StreetName = formData.StreetName;
        f.City = formData.City;
        f.State = formData.State;
        f.ZIP = formData.ZIP;
        t.setState({
          f
        });
        t.props.toggleEditForm();
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}
export default VolProfile;
