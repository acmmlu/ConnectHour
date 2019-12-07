import React from "react";
import LoginPage from "./Homepage/LoginPage";
import NotFound from "./Homepage/NotFound";
import ResetPassword from "./Homepage/ResetPassword";
import OrgDashboard from "./Dashboard/Organization/OrgDashboard";
import VolDashboard from "./Dashboard/Volunteer/VolDashboard";
// import AboutUs from "./Homepage/AboutUs";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  
} from "react-router-dom";


class Main extends React.Component {
  render() {
    return (
      <>
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
                path="/odashboard/:organizationID/profile"
                render={props => <OrgDashboard {...props} />}
              />
              <Route
              exact
              path="/vdashboard/:volunteerid/messages"
              render={props => <VolDashboard {...props} />}
            /><Route
            exact
            path="/odashboard/:organizationID/messages"
            render={props => <OrgDashboard {...props} />}
          />
                 <Route
                exact
                path="/odashboard/:organizationID/activity"
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
                render={props => <VolDashboard {...props} />}
              />
            
               <Route
                exact
                path="/vdashboard/:volunteerID/profile"
                render={props => <VolDashboard {...props} />}
              />
              <Route
              exact
              path="/vdashboard/profile/organizer/:id"
              render={props => <VolDashboard {...props} />}
            />
             <Route
              exact
              path="/odashboard/profile/volunteer/:id"
              render={props => <OrgDashboard {...props} />}
            />
          
              {/* <Route
                exact
                path="/aboutus"
                render={props => <AboutUs {...props} />}
              /> */}
              {/* <Route  component={NotFound} />  */}
            </React.Fragment>
          </Switch>
        </Router>
      </>
    );
  }
}

export default Main;
