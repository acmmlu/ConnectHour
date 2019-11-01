import React from "react";
import LoginPage from "./Homepage/LoginPage";
import NotFound from "./Homepage/NotFound";
import ResetPassword from "./Homepage/ResetPassword";
import OrgDashboard from "./Dashboard/Organization/OrgDashboard";
import VolDashboard from "./Dashboard/Volunteer/VolDashboard";
import ActivityTracking from './Dashboard/Volunteer/ActivityTracking'
import { createBrowserHistory } from "history";
import AboutUs from "./Homepage/AboutUs";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import OrgProfile from "./Dashboard/Organization/OrgProfile";
const history = createBrowserHistory();

class Main extends React.Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <React.Fragment>
              <Route
                exact
                path="/"
                render={props => <LoginPage {...props} />}
              />
              <Route
                exact
                path="/volunteer/reset"
                render={props => <ResetPassword {...props} />}
              />
              <Route
                exact
                path="/organization/reset"
                render={props => <ResetPassword {...props} />}
              />
              <Route
                exact
                path="/odashboard/:organizationID"
                render={props => <OrgDashboard {...props} />}
              />
              <Route
                exact
                path="/vdashboard/:volunteerID"
                render={props => <VolDashboard {...props} />}
              />
              <Route
                exact
                path="/vdashboard/activity/:volunteerID"
                render={props => <ActivityTracking {...props} />}
              />
                <Route
                exact
                path="/odashboard/profile/:organizationID"
                render={props => <OrgProfile {...props} />}
              />
              <Route
                exact
                path="/aboutus"
                render={props => <AboutUs {...props} />}
              />
              {/* <Route  component={NotFound} />  */}
            </React.Fragment>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default Main;
