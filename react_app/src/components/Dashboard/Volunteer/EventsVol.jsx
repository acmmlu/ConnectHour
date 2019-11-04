import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Registered from "./Registered";
import Searched from "./Search";

//Component for Events page for Volunteer
class EventsVol extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      EventsList: [],
      RegisteredEvents: [],
      showDetails: false,
      errmsg: "Search Events", // storews the error message
      showFormId: "", //stores the event id
      name: ""
    };
    this.showForm = this.showForm.bind(this);
    this.showFormReset = this.showFormReset.bind(this);
    this.DisplayEvents = this.DisplayEvents.bind(this);
    this.ClearDisplay = this.ClearDisplay.bind(this);
  }
  //function called on mount
  componentDidMount() {
    if (Cookies.get("token") && Cookies.get("type") === "/vdashboard/") {
      const ID = jwt_decode(Cookies.get("token")).uid;
      const p = this;
      let RegisteredEvents = this.state.RegisteredEvents;
      axios
        .get("/event/volunteer/" + ID)
        .then(function(response) {
          p.setState({ RegisteredEvents: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      this.props.history.push("/");
    }
  }

  //shows the event forms
  showForm = e => {
    this.setState({ showFormId: e.target.id });
    this.setState({ name: e.target.name });
  };

  //hides the event form
  showFormReset() {
    this.setState({ showFormId: "" });
  }

  //Shpw search results
  DisplayEvents(Events) {
    this.state.EventsList = Events;
    this.setState({
      EventsList: this.state.EventsList
    });
    if (this.state.EventsList.length < 1) {
      this.setState({ errmsg: "No Results Found" });
    } else {
      this.setState({ errmsg: "" });
    }
  }

  //clear search results
  ClearDisplay() {
    this.setState({
      EventsList: [],
      errmsg: "Search Events"
    });
  }
  render() {
    return (
      <React.Fragment>
        <div className="row EventsVol">
          <div className="row  container text-center">
            <div className=" mt-2 mb-2  container">
              <SearchEvents
                DisplayEvents={this.DisplayEvents}
                ClearDisplay={this.ClearDisplay}
              />
            </div>
          </div>
          <div className="DisplayEvents container  col-6">
            <div className="display-4 text-center">
              <p>{this.state.errmsg}</p>{" "}
            </div>
            {this.state.EventsList.map(event => (
              //calll the searched component
              <Searched
                event={event}
                key={event.id}
                showFormId={this.state.showFormId}
                showForm={this.showForm}
                showFormReset={this.showFormReset}
                name={this.state.name}
                ID={jwt_decode(Cookies.get("token")).uid}
              ></Searched>
            ))}
          </div>

          <div className=" col-3  Registered shadow  p-3 mb-5 bg-white rounded card container text-center float-right">
            <div className="display-4 ">Registered Events </div>
            <div className="RegisteredEvents">
              {this.state.RegisteredEvents.map(event => (
                //call the registered component
                <Registered
                  event={event}
                  key={event.id}
                  showFormId={this.state.showFormId}
                  showForm={this.showForm}
                  showFormReset={this.showFormReset}
                  name={this.state.name}
                />
              ))}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

//compontn for seacrh events form
class SearchEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        SearchString: "",
        city: "",
        date: "",
        time: ""
      }
    };
  }

  handleInputChange = e => {
    let formData = { ...this.state.formData };
    formData[e.target.name] = e.target.value;
    this.setState({
      formData
    });
  };
  filterTime(n, time) {
    let formData = { ...this.state.formData };
    formData["time"] = time;
    this.setState({
      formData
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="ml-5 topdist">
          <form
            className="form-inline my-2 my-lg-0 ml-5"
            onSubmit={e => this.onSubmit(e, this.state.formData)}
          >
            <input
              className="form-control m-2 mr-sm-2 shadow-sm"
              type="search"
              name="SearchString"
              placeholder="Search"
              aria-label="Search"
              onChange={this.handleInputChange}
            />

            <input
              className="form-control m-2 sm-2 shadow-sm"
              type="text"
              name="city"
              placeholder="City"
              onChange={this.handleInputChange} //http://asohafseofj/search?q=searchstring&date=aoehifaowjs&city=aiwuehofoawejidf
            />

            {/* <TimePicker  format='HH:mm' onChange={this.filterTime}  required/>   */}
            <input
              type="date"
              id="date"
              onChange={this.handleInputChange}
              className="form-control m-2 mr-sm-2 shadow-sm"
              name="date"
            />

            <button
              className="btn btn-outline-success ml-4 my-sm-0"
              type="submit"
            >
              Search
            </button>
            <input
              className="form-control btn btn-danger m-2"
              value="cancel"
              type="button"
              onClick={this.props.ClearDisplay}
            />
          </form>
        </div>
      </React.Fragment>
    );
  }

  onSubmit = (e, formData) => {
    e.preventDefault();
    console.log(formData);
    const p = this.props;
    
    let first = true;
    let path = '/search'
    for (let key of Object.keys(formData)) {
      if (formData[key]) {
        if (first) {
          path += '?';
          first = false;
        } else {
          path += '&';
        }
        
        path += key+"="+formData[key];
      }
    }
    axios
      .get(
        // "?q=" +
        //   formData["SearchString"] +
        //   "&city=" +
        //   formData["city"] +
        //   "&date=" +
        //   formData["date"]
        path
      )
      .then(function(response, props) {
        console.log(response);
        let Events = response.data;

        p.DisplayEvents(Events);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}

export default EventsVol;
