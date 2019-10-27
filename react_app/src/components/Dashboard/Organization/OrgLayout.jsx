import React from "react";
import "./OrgLayout.css";
import Cookies from "js-cookie";

class OrgLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
    
      <>
        <nav className="navbar navbar-expand-lg navbar-light bg-info navbar-fixed-top">
          <span className="navbar-brand ml-5 font-weight-bold" href="#">
            ConnectHour
          </span>
          <div>
            <input
              type="button"
              className="  btn  form-control btn-danger"
              onClick={this.handleLogout}
              value="Log Out"
            />
          </div>
        </nav>
      </>
    );
  }
  handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("type");
    console.log(Cookies.get());
    if (!Cookies.get("token")) {
      window.location.reload();
    }
  };
}

export default OrgLayout;
