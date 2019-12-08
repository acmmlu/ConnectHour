import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import moment from "moment";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

//Show event details child component
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

    axios
      .get(
        `https://us1.locationiq.com/v1/search.php?key=${key}&q=` +
          `${encodeURIComponent(
            `${data.StreetNumber} ${data.StreetName}, ` +
              `${data.City}, ${data.State} ${data.Zip}`
          )}&format=json`
      )
      .then(response => {
        // console.log(response);

        let lat = parseFloat(response.data[0].lat);
        let lon = parseFloat(response.data[0].lon);

        let GMap = (
          <GMapComponent
            lat={lat}
            lon={lon}
            resetBoundsOnResize
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAHzQhl-yrdyXYJvq0kpbkXpaR1KfREfqA"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `300px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        );

        p.setState({
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          renderMap: true,
          gmap: GMap
        });

        console.log(lat, lon);
      })
      .catch(error => {
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
        <div className="showDetails  ">
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
                
                  {this.state.formData.StreetName}, {this.state.formData.City},{" "}
                  {this.state.formData.State}, {this.state.formData.Zip}
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
              {this.props.reg && (
                <div className="col">
                  <input
                    className=" btn btn-success m-2"
                    value="Register"
                    type="submit"
                  />
                </div>
              )}

              <div className="col">
                <input
                  className="btn btn-danger m-2"
                  value="Cancel"
                  type="button"
                  onClick={this.props.showFormReset}
                />
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }

  //Onsubmit function handler
  onSubmit = e => {
    e.preventDefault();
    const formData = this.state.formData;
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

const GMapComponent = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultCenter={{ lat: props.lat, lng: props.lon }}
      defaultZoom={15}
    >
      <Marker position={{ lat: props.lat, lng: props.lon }} />
    </GoogleMap>
  ))
);

export default ShowEventDetails;
