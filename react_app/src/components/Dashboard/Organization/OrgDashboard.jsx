import React from "react";
import Events from "./Events";
import OrgLayout from "./OrgLayout";


class OrgDashboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <OrgLayout/>
        <Events />
      </React.Fragment>
    );
  }
}

export default OrgDashboard;
