import React from "react";
import Events from "./Events";
import OrgLayout from "./OrgLayout";
import Cookies from "js-cookie";

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
  render() {
    return (
      <React.Fragment>
        <div className='orgdash'>
        <OrgLayout history={this.props.history} />
        <Events history={this.props.history} />
        </div>
      </React.Fragment>
    );
  }
}

export default OrgDashboard;
