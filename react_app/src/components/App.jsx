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
import VolProfile from "./Dashboard/Volunteer/VolProfile";

const history = createBrowserHistory();

class Main extends React.Component {
  render() {
    return (
      <div>
        <Router>
        <React.Fragment>
          <Switch>
         
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
                path="/vdashboard/:volunteerID/activity"
                render={props => <ActivityTracking {...props} />}
              />
                <Route
                exact
                path="/odashboard/:organizationID/profile"
                render={props => <OrgProfile {...props} />}
              />
               <Route
                exact
                path="/vdashboard/:volunteerID/profile"
                render={props => <VolProfile {...props} />}
              />
              <Route
                exact
                path="/aboutus"
                render={props => <AboutUs {...props} />}
              />
               <Route  component={NotFound} />  
              </Switch>
            </React.Fragment>
        
        </Router>
      </div>
    );
  }
}

export default Main;
