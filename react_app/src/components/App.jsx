import React from "react";
import LoginPage from './Homepage/LoginPage'
import NotFound from './Homepage/NotFound'
import Homepage from './Homepage/Homepage'
import ResetPassword from'./Homepage/ResetPassword'
import OrgDashboard from './Dashboard/Organization/OrgDashboard'
import VolDashboard from './Dashboard/Volunteer/VolDashboard'
import { createBrowserHistory } from "history";
import AboutUs from "./Homepage/AboutUs"
import EventEdit from './Dashboard/Organization/EventEdit'



import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
const history = createBrowserHistory();


class Main extends React.Component {
 
  render() {
    return (
      <div >
       
        <Router >
          <Switch>
              <React.Fragment>
            <Route exact path="/" render={props=> <LoginPage {...props}/> }/>
            <Route exact path="/volunteer/reset" render={props=><ResetPassword {...props}/>}/>
            <Route exact path="/organization/reset" render={props=> <ResetPassword {...props}/>}/>
            <Route exact path="/odashboard/:organizationID" render={props=><OrgDashboard {...props}/>}/>
            <Route exact path="/vdashboard/:volunteerID" render={props=><VolDashboard {...props}/>}/>
            <Route exact path="/aboutus" render={props=><AboutUs {...props}/>}/>
            <Route exact path="/404" component={NotFound} />
            </React.Fragment>
            <Redirect to="/404" />

          </Switch>
        </Router>
      </div>
    );
  }
}

export default Main;
