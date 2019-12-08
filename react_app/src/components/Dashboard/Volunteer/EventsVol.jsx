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
      RecommendedList: [],
      RegisteredEvents: [],
      showDetails: false,
      errmsg: "", // stores the error message
      showFormId: "", //stores the event id
      name: "",
      showRecommended: "True",
      regeventid: []
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
      const regeventid = this.state.regeventid;
      axios
        .get("/event/volunteer/" + ID)
        .then(function(response) {
          if (response.data.length > 0) {
            response.data.map(event => regeventid.push(event.id));
          }

          p.setState({ RegisteredEvents: response.data });
        })
        .catch(function(error) {
          console.log(error);
        });
      axios
        .get("/recommended/" + ID)
        .then(function(response) {
          if (response.data.length > 0 && regeventid.length > 0) {
            response.data = response.data.filter(function(row) {
              return !String(row["id"]).includes(
                regeventid.map(id => String(id))
              );
            });
          }

          p.setState({ RecommendedList: response.data });
        })
        .catch(error => console.log(error));
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
    this.setState({ EventsList : Events})
    this.setState({ EventsList: this.state.EventsList});
    if (this.state.EventsList.length < 1) {
      this.setState({ errmsg: "No Results Found" });
      this.setState({ showRecommended: "False" });
    } else {
      this.setState({ errmsg: "Search Results" });
      this.setState({ showRecommended: "False" });
    }
  }

  //clear search results
  ClearDisplay() {
    this.setState({
      EventsList: [],
      errmsg: ""
    });
    this.setState({ showRecommended: "True" });
  }
  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
        <div className="row  ml-2 justify-content-left">
          <div className='col ' style={{fontSize:'30px'}}>
             Events
             <hr/>
            </div>
            </div>
           
            <div className='row'>

          <SearchEvents
            DisplayEvents={this.DisplayEvents}
            ClearDisplay={this.ClearDisplay}
            regeventid={this.state.regeventid}
          />
        </div></div>
        
        <div className="container-fluid mt-2">
          

            
            <div className="row">
            <div className="col">

              <div className="container-fluid">
                <div className="row">
                  <div className="col-9">
                    <div className="container-fluid">
                      <div className="row">
                        {/* Begin Recommended Events */}
                        {this.state.showRecommended === "True" && (
                          <div className="col">
                            <div className="DisplayRecommended container justify-content-left">
                              <div className="row">
                                <h4 className="float-left">
                                  Recommended Events
                                </h4>
                              </div>
                              <div className="row">
                                {this.state.RecommendedList.map(event => (
                                 

                                  <Searched
                                    history={this.props.history}
                                    event={event}
                                    key={event.id}
                                    showFormId={this.state.showFormId}
                                    showForm={this.showForm}
                                    showFormReset={this.showFormReset}
                                    name={this.state.name}
                                    ID={jwt_decode(Cookies.get("token")).uid}
                                  />
                                 
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        {/* End Recommended Events */}
                      </div>
                      <div className="row">
                        {/* Begin Search Results */}
                        {this.state.showRecommended === "False" && (
                          <div className="col">
                            <div className="DisplayRecommended container justify-content-left">
                              <div className="row">
                                <h4 className="float-left">
                                  {this.state.errmsg}{" "}
                                </h4>
                              </div>

                              <div className="row">
                                {this.state.EventsList.map(event => (
                                  <Searched
                                    event={event}
                                    history={this.props.history}
                                    key={event.id}
                                    showFormId={this.state.showFormId}
                                    showForm={this.showForm}
                                    showFormReset={this.showFormReset}
                                    name={this.state.name}
                                    ID={jwt_decode(Cookies.get("token")).uid}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        {/* End Search Results */}
                      </div>
                    </div>
                  </div>
                  {/* Registered Events */}
                  
                  
                  <div className=" col-3 p-4 mt-5 Registered shadow  bg-white rounded card container text-center" >
                    <h4>Registered Events ({this.state.RegisteredEvents.length })</h4>
                    <div className="RegisteredEvents " style={{"overflow-x": "hidden"}}>
                      {this.state.RegisteredEvents.map(event => (
                        //call the registered component
                        <Registered
                          event={event}
                          key={event.id}
                          showFormId={this.state.showFormId}
                          showForm={this.showForm}
                          history={this.props.history}
                          showFormReset={this.showFormReset}
                          name={this.state.name}
                        />
                      ))}
                    </div>
                  </div>
                  {/* End Registered Events */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*
        <div className="row EventsVol">
          <div className="row  container text-center">
            <div className=" mt-2 mb-2  container">
              <SearchEvents
                DisplayEvents={this.DisplayEvents}
                ClearDisplay={this.ClearDisplay}
              />
            </div>
          </div>
          <div className="DisplayRecommended row container justify-content-center">
            <div className="row">
              <h4 className="float-left">Recommended</h4>
            </div>
            <div className="row">
              {this.state.RecommendedList.map(event => (
                <Searched
                  event={event}
                  key={event.id}
                  showFormId={this.state.showFormId}
                  showForm={this.showForm}
                  showFormReset={this.showFormReset}
                  name={this.state.name}
                  ID={jwt_decode(Cookies.get("token")).uid}
                />
              ))}
            </div>
          </div>
          <div className="DisplayEvents row container  col-6">
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
        </div>*/}
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
   handleChange = (item, value) => {
    this.setState({...this.state, [item]: value});
  };

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
        <div className="ml-5 ">
          <form
            className="form-inline  ml-5"
            onSubmit={e => this.onSubmit(e, this.state.formData)}
          >
            
            <input
              className="form-control mx-2 mr-sm-2 mt-2 shadow-sm form-control-lg "
              type="search"
              name="SearchString"
              placeholder="Search"
              aria-label="Search"
              onChange={this.handleInputChange}
            />

            <input
              className="form-control mx-2 sm-2 mt-2 shadow-sm form-control-lg "
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
              className="form-control mx-2 mr-sm-2 mt-2 shadow-sm form-control-lg "
              name="date"
            />


            <button
              className="btn form-control btn-outline-success ml-2 mt-2 "
              type="submit"
            >
              <i className="fas fa-search"></i>
            </button>
              <input
          type='button'
          value='X'
              className="form-control btn btn-danger mt-2 px-3 mx-1"
              onClick={this.props.ClearDisplay}
            />
          </form>
       
             
        </div>
      </React.Fragment>
    );
  }

  onSubmit = (e, formData) => {
    e.preventDefault();

    const p = this.props;
    let regeventid = this.props.regeventid;
    axios
      .get(
        "/search?q=" +
          formData["SearchString"] +
          "&city=" +
          formData["city"] +
          "&date=" +
          formData["date"] +
          "&id=" +
          jwt_decode(Cookies.get("token")).uid
      )
      .then(function(response, props) {
        let Events = response.data;

        if (Events.length > 0 && regeventid.length > 0) {
          Events = Events.filter(function(row) {
            return !String(row["id"]).includes(
              regeventid.map(id => String(id))
            );
          });
        }

        p.DisplayEvents(Events);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}

export default EventsVol;
