import React from "react";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import user from "../../user.png";
import { Modal ,Card,CardBody,CardImg,CardTitle,Button} from "reactstrap";


class OrgProfile extends React.Component {
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
      subscribedVol: [],
      id: "",
      Editing: false,
      photomodal: false,
      photo: "",
    };
    this.toggleEditForm = this.toggleEditForm.bind(this);
    this.submitPhoto = this.submitPhoto.bind(this);
    this.getPFP = this.getPFP.bind(this);
    this.getVolPFPs = this.getVolPFPs.bind(this);
    this.togglePhotoModal = this.togglePhotoModal.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);

    // this.handleChange = this.handleChange.bind(this);
  }
  toggleEditForm() {
    this.setState({ Editing: !this.state.Editing });
    console.log(this.state.Editing);
  }

  getPFP() {
    let p = this;
    axios
      .get("/pfp/org/" + p.state.id)
      .then(function(res) {
        let buf = Buffer.from(res.data, 'binary');

        var reader = new FileReader();
        reader.onload = (function(self) {
          return function(e) {
            let fd = {...p.state.formData};
            fd.pfp = reader.result;
            p.setState({formData: fd});
            document.getElementById("pfp").src = reader.result;
          }
        })(this);
        reader.readAsDataURL(new Blob([buf], {type: 'image/png'}));
      })
      .catch(function(error) {
        console.log(error);
        // Display default photo
        p.setState({photo: user});
      });
  }

  getVolPFPs() {
    let p = this;
    for (let vol of p.state.subscribedVol) {
      axios
        .get("/pfp/vol/" + vol.volId)
        .then(function(res) {
          let buf = Buffer.from(res.data, 'binary');

          var reader = new FileReader();
          reader.onload = (function(self) {
            return function(e) {
              vol.pfp = reader.result;
              document.getElementById("pfp" + vol.volId).src = reader.result;
            }
          })(this);
          reader.readAsDataURL(new Blob([buf], {type: 'image/png'}));
        })
        .catch(function(error) {
          console.log(error);
          // Display default photo
          p.setState({photo: user});
        });
    }
  }

  componentDidMount = () => {
    if (Cookies.get("token") && Cookies.get("type") === "/odashboard/") {
      const ID = jwt_decode(Cookies.get("token")).uid;
      const p = this;
      p.state.id=ID
      axios
        .get("/organizer/" + ID)
        .then(function(response) {
          p.setState({ formData: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });

      axios
        .get("/event/get_subscribed/" + ID)
        .then(function(response) {
          p.setState({ subscribedVol: response.data });
          p.getVolPFPs();
        })
        .catch(function(error) {
          console.log(error);
        });
        
        p.getPFP();
  
    } else {
      this.props.history.push("/");
    }
  };

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
  fileChangedHandler = (event) => {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    this.setState({"photo": file});
  }

  togglePhotoModal() {
    this.setState({ photomodal: !this.state.photomodal });
  }

  submitPhoto() {
    let p = this;
    let data = new FormData();
    data.append("photo", this.state.photo);

    axios
      .put("/pfp/org/" + p.state.id, data)
      .then(function(d) {
        console.log(d);
        p.getPFP();
        p.togglePhotoModal();
      })
      .catch(function(error) {
        console.log(error);
      });
  }


  render() {
    return (
      <>
        <div className="container-fluid">
          <div className='row ml-2  justify-content-left'>
            <div className='col ' style={{fontSize:'30px'}}>
              My Profile
            </div>
          </div>
          <hr/>
          <div className="row justify-content-center">
            <form
              className=" topdist volprofile container"
              style={{width:'1200px'}}
              onSubmit={e => this.onSubmit(e, this.state.formData)}
            >
              <div className="container-fluid">
                <div className="row " style={{ marginTop: "20px" }}>
                  <div className="col-3 ">
                    <div className="container-fluid  ">
                      <div className="row ">
                        <div className="col ">
                        <img
                        alt=''
                        title='Click to change profile picture'
                      id="pfp"
                      src={this.state.formData.pfp ? this.state.formData.pfp : user}
                      className="img-thumbnail shadow p-3 bg-white rounded"
                      style={{ width: "200px", height: "200px" }}
                      onClick={this.togglePhotoModal}
                    />
                        </div>
                      </div>
                      {/* Profile picture here */}

                      <div className="row mt-2">
                        <div className="col ">
                          <h5 id="AccountName" className=" m-auto" style={{fontSize:'30px'}}>
                            {this.state.formData.Name}{" "}
                            
                          </h5>{" "}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col">
                          <h5 className=" m-auto " id="AccountEmail">
                            {this.state.formData.Email}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="container-fluid col-9 p-3 shadow  bg-white rounded">
                    <div className="row ">
                      <div className="col">
                        <h3 htmlFor="Description ">About Me</h3>
                      </div>
                      <div className="col ">
                        <button
                          type="button"
                          onClick={this.toggleEditForm}
                          className="btn text-info visible float-right"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                      </div>
                    </div>
                    <div className="row" style={{maxHeight:'90px', 'overflow-y':'scroll', 'overflow-x':'hidden'}}>
                      <div className="col">
                        {this.state.formData.Description}
                      </div>
                    </div>

                    {/* </div>
          <div className="row  d-flex  m-2 p-3 card shadow  bg-white rounded "> */}

                    <div className="row mt-2">
                      {" "}
                      {/* Address Section */}
                      <div className="col">
                        <h3>Address Info</h3>
                      </div>
                    </div>

                    <div className="row justify-content-left">
                      {" "}
                      <div className="col">
                        {/* City & State */}
                        {this.state.formData.StreetName&&this.state.formData.StreetName+', '}
                        {this.state.formData.City+', '}{this.state.formData.State}{this.state.formData.ZIP&&', '}
                        {this.state.formData.ZIP}
                      </div>
                    </div>
                  </div>


                </div>
              </div>

              <div className=" ml-2 mt-4
              p-2 shadow container bg-white rounded" style={{}}>
                
                <div className="row ">
                  <div className="col">
                    <h3>Subscribed Volunteers({this.state.subscribedVol.length})</h3>
                    <div className='container-fluid'>
                      <div className='row flex-row flex-nowrap'style={{'overflow-y':'hidden', 'overflow-x':'scroll'}}>

                     
                      {this.state.subscribedVol.map(subscribedVol => (
                        <SubscribedVolunteers
                          history={this.props.history}
                          Vol={subscribedVol}
                        />
                      ))}
                     
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </form>
          </div>
          <Modal isOpen={this.state.Editing} centered>
    
              <ProfileEdit
                formData={this.state.formData}
                toggleEditForm={this.toggleEditForm}
              />

          </Modal>
        <Modal isOpen={this.state.photomodal} centered >
            
            <div className="card bg-info container " style={{ fontSize: "30px" }}>
           
                  <div className='text-center'>
              Upload new Profile Picture
              </div>
           
            </div>
            <div className="container p-4">
              <div className="row">
                <div className="col-6">
                  {" "}
                  <input
                    type="file"
                    name="pic"
                    accept="image/*"
                    onChange={this.fileChangedHandler}
                  />
                </div>
                <div className="col float-left">
                  <button
                    id="submitPhoto"
                    className="btn float-left btn-sm btn-info visible"
                    onClick={this.submitPhoto}
                  >
                    {" "}
                    Submit
                  </button>
                  <button
                    id="PhotoClose"
                    className="btn float-left btn-sm btn-danger ml-2 visible"
                    style={{width:'60px'}}
                    onClick={this.togglePhotoModal}
                  >
                    {" "}
                    Close
                  </button>
                </div>
               
              </div>
            </div>
          </Modal>
        </div>

      </>
    );
  }

  // onSubmit = (e, formData) => {
  //   e.preventDefault();
  //   // let submit = document.getElementById("submit");

  //   // if (submit.innerHTML === "Save") {
  //     // this.toggleEditMode();
  //     const ID = jwt_decode(Cookies.get("token")).uid;
  //     console.log(formData);
  //     const p = this.props;
  //     axios
  //       .put("/organizer/" + ID, formData)
  //       .then(function(response, props) {
  //         console.log(response);
  //         window.location.reload();
  //       })
  //       .catch(function(error) {
  //         console.log(error);
  //       });
  //   // } else {
  //   //   this.toggleEditMode();
  //   // }
  // };
}

class SubscribedVolunteers extends React.Component {
 
  volProfile = e => {
    const id = e.target.id;
    const t = this;
    t.props.history.push({
      pathname: "/odashboard/profile/volunteer/" + id,
      state: { vid: id }
    });
  };
  render() {
    return (
     
      <Card className='m-1 shadow  bg-white rounded border-info'>
      <CardImg top width="100%" src={this.props.Vol.pfp ? this.props.Vol.pfp : user} id={"pfp" + this.props.Vol.volId} alt="Card image cap" style={{ width: "150px", height: "150px" }}/>
      <CardBody>
        <CardTitle style={{fontSize:'20px', maxWidth:'150px'}}>{this.props.Vol.FirstName +' '}{this.props.Vol.LastName}</CardTitle>
        
        {/* <CardText>{this.props.org.Description}</CardText> */}
        <Button
        className='btn-info'
        onClick={this.volProfile}
        key={this.props.Vol.volId}
        id={this.props.Vol.volId}>Go to Profile</Button>
      </CardBody>
      </Card>
      
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
          <form
            className=""
            onSubmit={e => this.onSubmit(e, this.state.formData)}
          >
            <div className="form-group  bg-info card  p-4">
              <span className=" pt-2 text-center " style={{ fontSize: "30px" }}>
                {" "}
                Edit Details
              </span>
            </div>
            <div className="form-group row text-center px-3 pr-4 ml-1">
              <label htmlFor="description" style={{ fontSize: "20px" }}>
                About Me:
              </label>
              <textarea
                className="form-control pr-3 form-control-lg "
                onChange={this.handleChange}
                name="Description"
                id="Description"
                maxLength="300"
                value={this.state.formData.Description}
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-group row px-3 pr-4 ml-1 ">
              <label htmlFor="StreetName " style={{ fontSize: "20px" }}>
                Street Name:
              </label>
              <input
                type="text"
                onChange={this.handleChange}
                className="form-control form-control-lg "
                name="StreetName"
                id="StreetName"
                value={this.state.formData.StreetName}
                required
              />
            </div>

            <div className="form-group row px-4">
              <label
                htmlFor="City"
                className=" pt-2  col-2"
                style={{ fontSize: "20px" }}
              >
                City:
              </label>
              <input
                type="text"
                onChange={this.handleChange}
                className="form-control col-4 form-control-lg "
                name="City"
                id="City"
                value={this.state.formData.City}
                required
              />
              <label
                htmlFor="State"
                className=" pt-2 col-2 "
                style={{ fontSize: "20px" }}
              >
                State:
              </label>
              <input
                type="text"
                onChange={this.handleChange}
                className="form-control col-4 form-control-lg "
                name="State"
                id="State"
                value={this.state.formData.State}
                required
              />
            </div>
            <div className="form-group row px-4">
              <label
                htmlFor="ZIP"
                className=" pt-2 col-2"
                style={{ fontSize: "20px" }}
              >
                ZIP:
              </label>
              <input
                pattern="[0-9]{5}"
                title="Please Enter Valid Zip"
                type="text"
                onChange={this.handleChange}
                className="form-control col-4 form-control-lg "
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
    let f = this.props.formData;
    const t = this;
    axios
      .put("/organizer/" + jwt_decode(Cookies.get("token")).uid, formData)
      .then(function(response, props) {
        console.log(response);
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
export default OrgProfile;
// <div className="container">
// <div className="row" style={{ marginTop: "20px" }}>
//   <div className="col">
//     <img
//       src={user}
//       className="img-thumbnail shadow p-3 bg-white rounded"
//       style={{ width: "200px", height: "200px" }}
//     />
//     {/* Profile picture here */}
//   </div>
//   <div className="col-8 ">
//     <div className="container">
//       <div className="row h-100 ">
//         <div className="col-9">
//           <h5 id="AccountName" className=" m-auto display-4">
//             {this.state.formData.Name}{" "}
//           </h5>{" "}
//         </div>
//       </div>
//       <div className="row">
//         <div className="col">
//           <h5 className=" m-auto " id="AccountEmail">
//             Email ID: {this.state.formData.Email}
//           </h5>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// </div>

// <div className="row m-2 p-3 shadow  bg-white rounded">
// <div className="col-12">
//   <h3 htmlFor="Description">About Me</h3>
//   <textarea
//     id="Description"
//     className="form-control toggleedit"
//     onChange={this.handleChange}
//     defaultValue={this.state.formData.Description}
//     readOnly
//   />
// </div>
// </div>
// <div className="row m-2 pt-3 pb-3 card shadow  bg-white rounded ">
// <div className="col ">
//   <div className="container ">
//     <div className="row">
//       {" "}
//       {/* Address Section */}
//       <div className="col">
//         <h3>Address Info</h3>
//       </div>
//     </div>
//     <div className="row m-1 ">
//       {" "}
//       {/* Building No. & Street Name */}
//       {/* <div className="col-2">
//     <h5 className="text-right"> Street Number</h5>
//   </div>
//   <div className="col-2">
//     <input
//       id="StreetNumber"
//       type="text"
//       className="form-control toggleedit"
//       onChange={this.handleChange}
//       defaultValue={this.state.formData.StreetNumber}
//       readOnly
//     />
//   </div> */}
//       <div className="col-2">
//         <h5 className="">Street</h5>
//       </div>
//       <div className="col-10">
//         <input
//           id="StreetName"
//           type="text"
//           className="form-control toggleedit"
//           onChange={this.handleChange}
//           defaultValue={this.state.formData.StreetName}
//           readOnly
//         />
//       </div>
//     </div>
//     <div className="row m-1 justify-content-left">
//       {" "}
//       {/* City & State */}
//       <div className="col-2">
//         <h5 className="">City</h5>
//       </div>
//       <div className="col-4">
//         <input
//           id="City"
//           type="text"
//           className="form-control toggleedit"
//           onChange={this.handleChange}
//           defaultValue={this.state.formData.City}
//           readOnly
//         />
//       </div>
//       <div className="col-2">
//         <h5 className="">State</h5>
//       </div>
//       <div className="col-4">
//         <input
//           id="State"
//           type="text"
//           className="form-control toggleedit"
//           defaultValue={this.state.formData.State}
//           onChange={this.handleChange}
//           readOnly
//         />
//       </div>
//     </div>
//     <div className="row m-1">
//       {" "}
//       {/* Zip & Buttons*/}
//       <div className="col-2">
//         <h5 className="">Zip</h5>
//       </div>
//       <div className="col-3">
//         <input
//           id="ZIP"
//           type="text"
//           className="form-control toggleedit"
//           onChange={this.handleChange}
//           defaultValue={this.state.formData.ZIP}
//           readOnly
//         />
//       </div>
//     </div>
//     <div className="row ">
//       <div className="col-1 m-auto">
//         <button
//           type="button"
//           onClick={this.toggleEditForm}
//           className="btn btn-info visible"
//         >
//           Edit
//         </button>
//       </div>
//     </div>
//   </div>
// </div>
// </div>
