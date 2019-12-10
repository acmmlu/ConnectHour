import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import moment from "moment";
import user from "../../user.png";
import {
  Modal,
  
} from "reactstrap";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";


class VolProfileLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      activityData: []
    };
    
    this.getPFP = this.getPFP.bind(this);
  }

  getPFP() {
    let p = this;
    axios
      .get("/pfp/vol/" + this.props.location.state.vid)
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
    if (Cookies.get("token") && Cookies.get("type") === "/odashboard/") {
      const p = this;
      axios
        .get(
          "/volunteer/" + this.props.location.state.vid
        )
        .then(function(response) {
          p.setState({ formData: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
      axios
        .get(
          "/event/activity/" +
            this.props.location.state.vid
        )
        .then(function(response) {
          p.setState({ activityData: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });

      p.getPFP();
    } else {
      this.props.history.push("/");
    }
  };

  render() {
    return (
      <>
        <div className="container-fluid">
          <div className='row ml-2  justify-content-left'>
            <div className='col ' style={{fontSize:'30px'}}>
            {this.state.formData.FirstName+' '+ this.state.formData.LastName+"'s" + ' Profile'}
            </div>
          </div>
          <hr/>
          <div className="row justify-content-center">
            <form
              className=" topdist volprofile"
              style={{minWidth: 1100}}
              onSubmit={e => this.onSubmit(e, this.state.formData)}
            >
              <div className="container">
                <div className="row " style={{ marginTop: "20px" }}>
                  <div className="col-3 ">
                    <div className="container-fluid  ">
                      <div className="row ">
                        <div className="col ">
                          <img
                            id="pfp"
                            src={this.state.formData.pfp ? this.state.formData.pfp : user}
                            className="img-thumbnail shadow p-3 bg-white rounded"
                            style={{ width: "200px", height: "200px" }}
                            alt=''
                          />
                        </div>
                      </div>
                      {/* Profile picture here */}

                      <div className="row mt-2">
                        <div className="col ">
                          <h5 id="AccountName" className=" m-auto" style={{fontSize:'30px'}}>
                            {this.state.formData.FirstName}{" "}
                            {this.state.formData.LastName}{" "}
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
                    <h3>Past Events({this.state.activityData.length})</h3>
                    <div className='container-fluid'>
                      <div className='row flex-row flex-nowrap'style={{overflow:'scroll'}}>

                     
                      {this.state.activityData.map(activityData => (
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
        
        </div>
      </>
    );
  }
}
/* <div className="row">
{this.state.activityData.map(activityData => (
  //call the registered component
  <PastEvents
    activityData={activityData}
    key={activityData.EventId}
  />
))}
</div> */
class PastEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eid: "",
      registered_vol: ""
    };
    this.toggleeid = this.toggleeid.bind(this);
  }

  toggleeid(e) {
    if (e.target.id) {
      this.setState({ eid: e.target.id });
    } else {
      this.setState({ eid: "" });
    }
  }

  render() {
    console.log(this.props.activityData);
    return (
      <>
        {" "}
        <div className="col-xl-4 col-lg-6 col-md-12 ">
        <div className="card event-card  shadow bg-white rounded border-info">
          <div className="card-title p-2 text-center  pb-3 bg-info" style={{fontWeight:'bold',fontSize:'18px'}}>
            {this.props.activityData.EventName}
        
           
          </div>
          <div className="container  px-3" style={{minHeight:'240px'}}>

           

            
          <div className="row ">
            <div className=" badge badge-pill  mx-auto float-right badge-dark">
            {this.props.activityData.Tag}
          </div>{" "}
            </div>
           
            <div className="row py-1 text-center" style={{minHeight:'50px'}}>
              <div className="col">
                {this.props.activityData.Description.length > 58
                  ? this.props.activityData.Description.substring(0, 58) + "..."
                  : this.props.activityData.Description}
              </div>
            </div>
            <div className="row text-left py-1" style={{minHeight:'45px'}}>
              <div className="col text-center">
                <span className="text-info" style={{ fontWeight: "bold" }}>
                  Address:{" "}
                </span>
                <span>
                  {this.props.activityData.StreetName}
                  , {this.props.activityData.City}, {this.props.activityData.State},{" "}
                  {this.props.activityData.ZIP}
                </span>
              </div>
            </div>
            <div className="row pt-1">
              <div className="col text-center m-auto ">
                <span className="text-info" style={{ fontWeight: "bold" }}>
                  On {moment(this.props.activityData.StartTime).format("MM-DD-YYYY")}
                </span>
              </div>
            </div>
            <div className="row ">
              <div className="col text-center m-auto ">
                <span className="text-info" style={{ fontWeight: "bold" }}>
                  At {moment(this.props.activityData.StartTime).format("HH:mm")}{" "}
                  
                </span>
              </div>
            </div>
            <div className="justify-content-center row text-center mt-5">
            
              <div className="col ">
              <button
                className="btn btn-info text-nowrap "
                id={this.props.activityData.EventId}
                onClick={this.toggleeid}
                value="Details"
                
                type="button"
              >
                Details<i className="fas ml-1 fa-info-circle"></i>
         </button>
              </div>
              
            </div>
            <div className="m-auto row text-center">
             
            </div>
           
</div>
            <Modal
              centered
              isOpen={String(this.state.eid) === String(this.props.activityData.EventId)}
            >
              <ShowEventDetails
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

class ShowEventDetails extends React.Component {
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
              `${encodeURIComponent(`${data.StreetName}, ` +
              `${data.City}, ${data.State} ${data.ZIP}`)}&format=json`).then(
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
              <span className=" pt-2 text-center " style={{ fontSize: "30px" }}>
                {" "}
                {this.state.formData.EventName}
              </span>
            </div>
            <div className="container">
              <div className="row my-2">
                <div className=" badge badge-pill  mx-auto float-right badge-dark">
                  {this.state.formData.Tag}
                </div>{" "}
              </div>
              <div className="row my-2">
                <div className="col">{this.state.formData.Description}</div>
              </div>
              <div className="row my-2">
                <div className="col">
                  <span className="font-weight-bold text-info">Address: </span>
                  {" "}
                  {this.state.formData.StreetName}, {this.state.formData.City},{" "}
                  {this.state.formData.State}, {this.state.formData.ZIP}
                </div>
              </div>
              <div className="row my-2">
                <div className="col">
                  {this.state.renderMap && this.state.gmap}
                </div>
              </div>
              <div className="row my-2 font-weight-bold text-info">
                <div className="col">
                  On{" "}
                  {moment(this.state.formData.StartTime).format("MM-DD-YYYY")}
                </div>
              </div>
              <div className="row my-2 font-weight-bold text-info">
                <div className="col">
                  At {moment(this.state.formData.StartTime).format("HH:mm")}
                </div>
              </div>
            </div>

            <div className="row my-2">
           
              <div className="col">
                <input
                  className="btn btn-danger m-2"
                  value="Cancel"
                  type="button"
                  onClick={this.props.toggleeid}
                />
              </div>
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

export default VolProfileLink;
