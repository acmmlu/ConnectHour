import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { Modal } from "reactstrap";
import moment from "moment";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";


class ActivityOrg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityData: []
    };
  }
  componentDidMount() {
    if (Cookies.get("token") && Cookies.get("type") === "/odashboard/") {
      const ID = jwt_decode(Cookies.get("token")).uid;
      const p = this;
      axios
        .get("/event/activityOrg/" + ID)
        .then(function(response) {
          p.setState({ activityData: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      this.props.history.push("/");
    }
  }
  render() {
    return (
      <>
        <div className="container-fluid">
        <div className='row ml-2  justify-content-left'>
            <div className='col ' style={{fontSize:'50px'}}>
              Past Events
            </div>
          </div>
          <hr/>
          <div className="row">
            <div className="col">
              <div className="DisplayRecommended container justify-content-left">
                
                <div className="row">
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

        {/* <VolLayout />
        
        <div className="row EventsVol">
          <div className="  col-8 activity">
            {this.state.activityData.map(activityData => (
              //call the registered component
              <PastEvents
                activityData={activityData}
                key={activityData.EventId}
              />
            ))}
          </div>
        </div>*/}
      </>
    );
  }
}

class PastEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eid: "",
      registered_vol: [],
      showreg: false,
      regId: ""
    };
    this.toggleeid = this.toggleeid.bind(this);
    this.togglereg = this.togglereg.bind(this);
  }
  componentDidMount() {
    let thisstate = this;

    axios
      .get(
        "/event/organizer/registered/" +
          this.props.activityData.id
      )
      .then(function(response) {
        thisstate.setState({ registered_vol: response.data });
        console.log(
          thisstate.state.registered_vol,
          thisstate.props.activityData.EventName
        );
      })

      .catch(function(error) {
        console.log(error);
      });
  }
  toggleeid(e) {
    if (e.target.id) {
      this.setState({ eid: e.target.id });
    } else {
      this.setState({ eid: "" });
    }
  }
  togglereg() {
    this.setState({
      showreg: !this.state.showreg
    });
  }

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
export default ActivityOrg;
