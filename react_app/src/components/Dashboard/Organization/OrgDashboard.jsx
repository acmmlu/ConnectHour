import React from "react";
import Events from "./Events";
import OrgLayout from "./OrgLayout";
import Cookies from "js-cookie";
import OrgProfile from "./OrgProfile";
import OrgBase from '../../cometchat/OrgBase'

import {

  Route
} from "react-router-dom";
import ActivityOrg from "./ActivityOrg";
import VolProfileLink from "./VolProfileLink";
class OrgDashboard extends React.Component {
  // componentDidMount=()=> {
  //   console.log(Cookies.get())
  //   if (Cookies.get("token")) {
  //     console.log(Cookies.get("token"))
  //   }
  //   else{
  //     this.props.history.push("/");
  //   }
  // }
  componentDidMount() {
    if (Cookies.get("token") && Cookies.get("type") !== "/odashboard/") {
      console.log("removed");
      this.props.history.push("/");
    }
  }
  render() {
    return (
      <React.Fragment>
        <div id="orgbase" className="orgdash">
          <OrgLayout history={this.props.history}>
            <Route
              exact
              path="/odashboard/:organizationID/profile"
              render={props => <OrgProfile {...props} />}
            />
            <Route
              exact
              path="/odashboard/:organizationID/activity"
              render={props => <ActivityOrg {...props} />}
            />
            <Route
              exact
              path="/odashboard/:organizationID"
              render={props => <Events {...props} />}
            /> <Route
            exact
            path="/odashboard/:organizationID/messages"
            render={props => <OrgBase {...props} />}
          />
             <Route
              exact
              path="/odashboard/profile/volunteer/:id"
              render={props => <VolProfileLink {...props} />}
            />


          </OrgLayout>
        </div>
        {/* <div className="orgdash">
          <OrgLayout history={this.props.history}>
            
            <Route
              exact
              path="/odashboard/:organizationID/profile"
              render={props => <OrgProfile {...props} />}
            />

            <Route
              exact
              path="/odashboard/:organizationID"
              render={props => <Events {...props} />}
            />
          </OrgLayout>
        </div> */}
      </React.Fragment>
    );
  }
}

export default OrgDashboard;
