import EventsVol from "./EventsVol";
import Cookies from "js-cookie";

import React from "react";
import ActivityTracking from "./ActivityTracking";

import VolLayout from "./VolLayout";
import VolProfile from "./VolProfile";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import LoginPage from "../../Homepage/LoginPage";
import OrgProfileLink from "./OrgProfieLink";
//Dashboard for volunteer
class VolDashboard extends React.Component {
  componentDidMount() {
    console.log('dash')
    if (Cookies.get("token") && Cookies.get("type") != "/vdashboard/") {
      this.props.history.push("/");
    }
  }
  render() {
    console.log('dash')
    return (
      <React.Fragment>
        {/* <VolLayout history={this.props.history}>
          <EventsVol history={this.props.history} />
          <VolProfile history={this.props.history}/>
        </VolLayout> */}
        <div className="volDashBack">
          <VolLayout history={this.props.history}>
            <Route
              exact
              path="/vdashboard/:volunteerID/profile"
              render={props => <VolProfile {...props} />}
            />
            <Route
              exact
              path="/vdashboard/:volunteerID/activity"
              render={props => <ActivityTracking {...props} />}
            />
            <Route
              exact
              path="/vdashboard/profile/organizer/:id"
              render={props => <OrgProfileLink {...props} />}
            />
            <Route
              exact
              path="/vdashboard/:volunteerID"
              render={props => <EventsVol {...props} />}
            />
          </VolLayout>
        </div>
      </React.Fragment>
    );
  }
}

export default VolDashboard;
