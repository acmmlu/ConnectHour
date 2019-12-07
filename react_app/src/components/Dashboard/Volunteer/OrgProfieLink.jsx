import React from "react";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import moment from "moment";
import StripeCheckout from 'react-stripe-checkout'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

import user from "../../user.png";
import {
  Modal,

  ModalHeader,
  
} from "reactstrap";

class OrgProfileLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      activityData: [],
      scheduled: [],
      Subscribed: false,
      regeventid:[],
      donateShow:false
    };
    this.toggleSubscribeMode = this.toggleSubscribeMode.bind(this);
    this.getPFP = this.getPFP.bind(this);
        this.toggleDonateModal = this.toggleDonateModal.bind(this);

  }
toggleDonateModal(){
  this.setState({donateShow:!this.state.donateShow})
}
  getPFP() {
    let p = this;
    axios
      .get("/pfp/org/" + this.props.location.state.oid)
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
      });
  }

  componentDidMount = () => {
    if (Cookies.get("token") && Cookies.get("type") === "/vdashboard/") {
      //PrfileData

      const p = this;
      axios
        .get(
          "/organizer/" + this.props.location.state.oid
        )
        .then(function(response) {
          p.setState({ formData: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });

      //PastEvents
      axios
        .get(
          "/event/activityOrg/" +
            this.props.location.state.oid
        )
        .then(function(response) {
          p.setState({ activityData: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });

        const regeventid = this.state.regeventid;
        axios
          .get(
            "/event/volunteer/" +jwt_decode(Cookies.get("token")).uid
          )
          .then(function(response) {
            if (response.data.length > 0) {
              response.data.map(event => regeventid.push((event.id)));
            }
            console.log(p.state.regeventid)
          })
          .catch(function(error) {
            console.log(error);
          });

      //scheduled events
      axios
        .get(
          "/event/organizer/" +
            this.props.location.state.oid
        )
        .then(function(response) {
          p.setState({ scheduled: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });

      //check if subscribed
      axios
        .get(
          "/event/issubscribed/" +
            jwt_decode(Cookies.get("token")).uid +
            "/" +
            this.props.location.state.oid
        )
        .then(function(response) {
          p.setState({ Subscribed: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });

      p.getPFP();
    } else {
      this.props.history.push("/");
    }
  };

  toggleSubscribeMode() {
    let t = this;
    if (this.state.Subscribed) {
      //if already subscribed, unsubscribe

      axios
        .post(
          "/event/unsubscribe/" +
            jwt_decode(Cookies.get("token")).uid +
            "/" +
            this.props.location.state.oid
        )
        .then(function(response, props) {
          // window.location.reload();
          t.setState({ Subscribed: false });
        })
        .catch(function(error) {
          console.log(error);
        });
    } //subscribe
    else {
      axios
        .post(
          "/event/subscribe/" +
            jwt_decode(Cookies.get("token")).uid +
            "/" +
            this.props.location.state.oid
        )
        .then(function(response, props) {
          // window.location.reload();
          t.setState({ Subscribed: true });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  render() {
    return (
      <>
      <div className="container-fluid">
        <div className='row ml-2  justify-content-left'>
          <div className='col ' style={{fontSize:'50px'}}>
            My Profile
          </div>
        </div>
        <hr/>
        <div className="row justify-content-center">
          <form
            className=" topdist volprofile"
            onSubmit={e => this.onSubmit(e, this.state.formData)}
          >
            <div className="container">
              <div className="row " style={{ marginTop: "20px" }}>
                <div className="col-3 ">
                  <div className="container-fluid  ">
                    <div className="row ">
                      <div className="col ">
                        <img
                        alt=''
                          id="pfp"
                          src={this.state.formData.pfp ? this.state.formData.pfp : user}
                          className="img-thumbnail shadow p-3 bg-white rounded"
                          style={{ width: "200px", height: "200px" }}
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


                    <div className="row">	                    
                     <div className="col-2">	                   
                       <input	
                         className="btn btn-info"	
                         type="button"	
                         name="Donate"	
                         value="Donate?"	
                         onClick={this.toggleDonateModal}
                       />	
                     </div>	


                     <div className="col-3 ml-5 ">	                   
                       {!this.state.Subscribed && (	                      
                         <button	                       
                           onClick={e => {	                          
                             e.preventDefault();	
                             this.toggleSubscribeMode();	                       
                           }}	
                           id="subscribe"	
                           className="btn btn-success visible"	
                         >	
                           Subscribe	
                         </button>	
                       )}	
                       {this.state.Subscribed && (	
                         <button	
                           onClick={e => {	
                             e.preventDefault();	
                             this.toggleSubscribeMode();	
                           }}	
                           id="subscribe"	
                           className="btn btn-success visible"	
                         >	
                           UnSubscribe	
                         </button>	
                       )}	
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
                  <div className="row" style={{maxHeight:'90px', overflow:'scroll'}}>
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
                      {this.state.formData.StreetName},
                      {this.state.formData.City},{this.state.formData.State},
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
                  <h3>Scheduled Events({this.state.scheduled.length})</h3>
                  <div className='container-fluid'>
                    <div className='row flex-row flex-nowrap'style={{overflow:'scroll'}}>

                   
                    {this.state.scheduled.map(scheduled => (
  //call the registered component
  <ScheduledEvents
    activityData={scheduled}
    key={scheduled.EventId}
    showForm={this.props.location.state.showForm}
    event={scheduled}
    showFormReset={this.props.location.state.showFormReset}
    id={scheduled.id}
    regEventId={this.state.regeventid}
  />
))}
                   
                  </div>
                  </div>
                  </div>
                  </div> </div>
                  <div className=" ml-2 mt-4
            p-2 shadow container bg-white rounded" style={{}}>

              <div className="row ">
                <div className="col">
                <h3>Past Events({this.state.activityData.length})</h3>

                  <div className='container-fluid'>
                    <div className='row flex-row flex-nowrap'style={{overflow:'scroll'}}>

                   
                
  
  {this.state.activityData.map(activityData => (
    //call the registered component
    <PastEvents
      activityData={activityData}
      key={activityData.EventId}
    />
  ))}
  

                   
                  </div>
                  </div>
                </div>
              </div>
            </div>
            
          </form>
        </div>
        <Modal isOpen={this.state.donateShow} centered>
        <ModalHeader>
                <input
                  className="btn btn-sm btn-danger mr-2"
                  type="button"
                  value="<"
                  onClick={this.toggleDonateModal}
                />

                <span className="fontType">
                  Please enter amount that you want to donate.
                </span>
              </ModalHeader>
              <PaymentComponent
              formData={this.state.formData}
                toggleDonateModal={this.toggleDonateModal}
              />
            </Modal>
      </div>
    </>
    );
  }
}


class PastEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eid: "",
      registered_vol: ""
      // showreg: false,
      // regId: ""
    };
    this.toggleeid = this.toggleeid.bind(this);
    // this.togglereg = this.togglereg.bind(this);
  }
  // componentDidMount() {
  //   let thisstate = this;

  //   axios
  //     .get(
  //       "/event/organizer/registered/" +
  //         this.props.activityData.id
  //     )
  //     .then(function(response) {
  //       thisstate.setState({ registered_vol: response.data });
  //       console.log(thisstate.state.registered_vol,thisstate.props.activityData.EventName)

  //     })

  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // }
  toggleeid(e) {
    if (e.target.id) {
      this.setState({ eid: e.target.id });
    } else {
      this.setState({ eid: "" });
    }
  }
  // togglereg() {
  //   this.setState({
  //     showreg: !this.state.showreg
  //   });
  // }

  render() {
    return (
      <>
        {" "}
        <div className="p-3 col-xl-4 col-lg-6 col-md-12">
          <div className="card text-center  event-card shadow bg-white rounded ">
            <h5 className="card-title">
              {this.props.activityData.EventName}
              <span className="badge badge-pill badge-primary">
                {this.props.activityData.Tag}
              </span>
            </h5>
            <span>{this.props.activityData.date}</span>
            <hr />
            <p className="card-text">
              {this.props.activityData.Description.length > 58
                ? this.props.activityData.Description.substring(1, 58) + "..."
                : this.props.activityData.Description}
            </p>
            <div className="text-center">
              {" "}
              <span className="text-weight-bold">Address: </span>
              {this.props.activityData.StreetNumber},{" "}
              {this.props.activityData.StreetName},{" "}
              {this.props.activityData.City}, {this.props.activityData.State},{" "}
              {this.props.activityData.Zip}
            </div>
            <div className="form-group col-9  text-center m-auto ">
              <p>
                {" "}
                Date:{" "}
                {moment(this.props.activityData.StartTime).format("MM-DD-YYYY")}
              </p>{" "}
              <p>
                Starting At:{" "}
                {moment(this.props.activityData.StartTime).format("HH:mm")}
              </p>
            </div>
            <div className="m-auto row text-center">
              <input
                className="m-auto btn btn-info col"
                id={this.props.activityData.EventId}
                onClick={this.toggleeid}
                value="Details"
                type="button"
              />
            </div>
            {/*             
            <Dropdown  isOpen={showreg}  toggle={this.togglereg} >
      <DropdownToggle className='bg-info' caret>
        Show Registered Volunteers
        </DropdownToggle>
      <DropdownMenu >
        <DropdownItem header>Registered Volunteers [ {this.state.registered_vol.length} ]</DropdownItem>
        
        {this.state.registered_vol.map(vol => (
          <DropdownItem key={this.props.event.id}>
                      <div  className="text-center m-auto">
                        <div className=''>
                          <span >Name: </span>
                          {vol.FirstName} {vol.LastName}
                        </div>
                        <div className=''>
                          <span >Email: </span>
                          {vol.Email}
                        </div>
                      </div>
                      </DropdownItem>
                        ))}
       
      </DropdownMenu>
    </Dropdown>
 */}

            <Modal
              centered
              isOpen={String(this.state.eid) === String(this.props.activityData.EventId)}
            >
              <ShowDetails
                eventdata={this.props.activityData}
                toggleeid={this.toggleeid}
              />
            </Modal>
          </div>
        </div>
      </>
    );
  }
}

class ScheduledEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eid: "",
      registered_vol: "",
      regeventid:this.props.regEventId
      // showreg: false,
      // regId: ""
     
      // regeventid: []
    };
    this.toggleeid = this.toggleeid.bind(this);
    // this.togglereg = this.togglereg.bind(this);
  }
  // componentDidMount() {
  //   let thisstate = this;
  //   const regeventid = this.state.regeventid;
  //   axios
  //     .get(
  //       "/event/volunteer/" +jwt_decode(Cookies.get("token")).uid
  //     )
  //     .then(function(response) {
  //       if (response.data.length > 0) {
  //         response.data.map(event => regeventid.push((event.id)));
  //       }
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // }
  toggleeid=e=> {
    if (e.target.id) {
      this.setState({ eid: e.target.id });
    } else {
      this.setState({ eid: "" });
    }
    console.log(e.target.id,this.state.eid)

  }
  // togglereg() {
  //   this.setState({
  //     showreg: !this.state.showreg
  //   });
  // }

  render() {
    
   
    return (
      <>
        <div className="p-3 col-xl-4 col-lg-6 col-md-12">
          <div className="card event-card text-center shadow bg-white rounded">
            <h5 className="card-title">
              {this.props.event.EventName}
              <span className="badge badge-pill badge-primary">
                {this.props.event.Tag}
              </span>
            </h5>

            <hr />
            <p className="card-text">
              {this.props.event.Description.length > 58
                ? this.props.event.Description.substring(1, 58) + "..."
                : this.props.event.Description}
            </p>
            <div className="text-center">
              {" "}
              <span className="text-weight-bold">Address: </span>
              {this.props.event.StreetNumber}, {this.props.event.StreetName},{" "}
              {this.props.event.City}, {this.props.event.State},{" "}
              {this.props.event.Zip}
            </div>
            <div className="form-group col-9  text-center m-auto ">
              <p>
                {" "}
                Date: {moment(this.props.event.StartTime).format("MM-DD-YYYY")}
              </p>{" "}
              <p>
                Starting At:{" "}
                {moment(this.props.event.StartTime).format("HH:mm")}
              </p>
            </div>

            <div className="m-auto   justify-content-center row text-center">
             { !this.state.regeventid.includes(this.props.event.id) && <button
                className=" m-auto btn btn-success text-nowrap col "
                type="submit"
                onClick={e => this.onSubmit(e)}
              >
                Register
              </button>
             }
              {/* <button
              className="m-auto btn btn-info text-nowrap col-lg-5 col-md-5 "
              id={this.props.event.id}
              onClick={this.props.showForm}
              name="Searched"
              type="button"
            >
              Details
            </button> */}
            <input
                className="m-auto btn btn-info col"
                id={this.props.event.id}
                onClick={this.toggleeid}
                value="Details"
                type="button"
              />
            </div>
            <Modal
              centered
              isOpen={String(this.state.eid) ===String(this.props.event.id)}
            >
              {/*call the child component for showing event details*/}

              <ShowDetails
                eventdata={this.props.event}
                toggleeid={this.toggleeid}

            />
            </Modal>
          </div>
        </div>
      </>
    );
  }
  onSubmit = e => {
    e.preventDefault();
    const formData = this.props.event;
    axios
      .post(
        "/event/register/" +
          jwt_decode(Cookies.get("token")).uid +
          "/" +
          formData["id"],
        formData
      )
      .then(function(response, props) {
        window.location.reload();
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}
class PaymentComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      amount: this.props.amount
    }
    this.handleToken = this.handleToken.bind(this);
    this.handleAmount = this.handleAmount.bind(this);
  }
  handleToken(token, addresses) {
  this.props.toggleDonateModal()
  console.log("test");
  console.log({ token, addresses });
let formData=this.props.formData
let amount=this.state.amount
    axios
      .post(
        "/donate/" +
        jwt_decode(Cookies.get("token")).uid +'/'+formData['id'],amount
      )
      .then(function(response) {
        console.log(response)

      })

      .catch(function(error) {
        console.log(error);
      });
      
  
}

handleAmount(event){
this.setState({amount: event.target.value});

}

render(){
  return (
    <div className='container p-2'>
      <div className='row mt-1'>
        <div className='col'>
      <input
        label="Donation Amount"
        type="text"
        name="amount"
        className='form-control '
        value={this.state.amount}
        onChange={this.handleAmount}
      /></div></div>
      <div className='row text-right mt-1'>
        <div className='col'>
      <StripeCheckout
        stripeKey="pk_test_nWEYHY1YKt8OyJ1qukWgVXJJ00ctw76Cvm"
        token={this.handleToken}
        billingAddress
        shippingAddress
        amount={this.state.amount * 100} //need to convert to cents while working with stripe
        name="Donate to ConnectHour"
      />
</div>
</div>
    </div>
  );
}

}
class ShowDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.eventdata,
      lat: "",
      lon: "",
      renderMap: false,
      gmap: ""
    };
  }
  componentDidMount() {
    const p = this;
    const data = this.props.eventdata;
    const key = "3579bae5570c63";

    axios.get(`https://us1.locationiq.com/v1/search.php?key=${key}&q=` +
              `${encodeURIComponent(`${data.StreetNumber} ${data.StreetName}, ` +
              `${data.City}, ${data.State} ${data.Zip}`)}&format=json`).then(
      (response) => {
        // console.log(response);

        let lat = parseFloat(response.data[0].lat);
        let lon = parseFloat(response.data[0].lon);

        let GMap = <GMapComponent
          lat={lat}
          lon={lon}
          resetBoundsOnResize
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAHzQhl-yrdyXYJvq0kpbkXpaR1KfREfqA"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `300px` }} />}
          mapElement={<div style={{ height: `100%`}} />}
        />

        p.setState({lat: parseFloat(lat), lon: parseFloat(lon), renderMap: true, gmap: GMap});

        console.log(lat, lon);

        
      }).catch( (error) => {
        console.log(error);
      });
    // Geocode.setApiKey("AIzaSyAHzQhl-yrdyXYJvq0kpbkXpaR1KfREfqA");
    // Geocode.fromAddress(`${data.StreetNumber} ${data.StreetName}, ${data.City}, ${data.State} ${data.Zip}`).then(
    //   response => {
    //     const {lat, long} = response.results[0].geometry.location;
    //     p.setState({lat: lat, long: long, renderMap: true});
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // )
    
  }

  render() {
    const data = this.props.eventdata;
    return (
      <React.Fragment>
        <div className="showDetails ">
          <form className="  text-center">
            <div className="form-group  bg-info card  p-4">
              <span className=" pt-2 display-4 text-center ">
                {" "}
                {data.EventName}
              </span>
            </div>

            <div className="form-group   text-center  ">{data.Description}</div>
            <hr />

            <div className="text-center">
              {" "}
              <span className="text-weight-bold">Address: </span>
              {data.StreetNumber}, {data.StreetName}, {data.City}, {data.State},{" "}
              {data.Zip}
              {this.state.renderMap && this.state.gmap}
            </div>

            <hr />
            <div className="form-group col-9  text-center m-auto ">
              <p>
                {" "}
                Date:{" "}
                {moment(this.state.formData.StartTime).format("YYYY-MM-DD")}
              </p>{" "}
              <p>
                Starting At-{" "}
                {moment(this.state.formData.StartTime).format("HH:mm")}
              </p>
            </div>
            <div className="m-auto text-center">
              {this.props.reg && (
                <input
                  className=" btn btn-success m-2"
                  value="Register"
                  type="submit"
                />
              )}
              <input
                className="btn btn-danger m-2"
                value="Cancel"
                type="button"
                onClick={this.props.toggleeid}
              />
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}
const GMapComponent = withScriptjs(withGoogleMap( (props) => 
          <GoogleMap defaultCenter={{lat: props.lat, lng: props.lon}} defaultZoom={15}>
            <Marker position={{lat: props.lat, lng: props.lon}} />
          </GoogleMap>
        ));


export default OrgProfileLink;
