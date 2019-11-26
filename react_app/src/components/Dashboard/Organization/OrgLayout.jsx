import React from "react";
import "./OrgLayout.css";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";

import { MDBListGroup, MDBListGroupItem, MDBIcon } from "mdbreact";
import user from "../../user.png";
import jwt_decode from "jwt-decode";
class OrgLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (Cookies.get("token") && Cookies.get("type") != "/odashboard/") {
      this.props.history.push("/");
    }
  }
  render() {
    return (
      <>
        <nav className="navbar  flex-nav navbar-expand-lg navbar-light bg-info navtop">
          <span className="navbar-brand ml-5 font-weight-bold" href="#">
            ConnectHour
          </span>
        </nav>
        <div className="wrapper">
          <div className="sidebar-fixed position-fixed">
            <div className="logo-wrapper waves-effect">
              <img src={user} className="img-fluid" alt="image" />
            </div>
            {Cookies.get("token") && Cookies.get("type") === "/odashboard/" && (
              <MDBListGroup className="list-group-flush">
                <NavLink
                  exact={true}
                  to={
                    "/odashboard/" +
                    jwt_decode(Cookies.get("token")).uid +
                    "/profile"
                  }
                  activeClassName="activeClass"
                >
                  <MDBListGroupItem>
                    <i className="fas m-1 fa-user-alt"></i>
                    Profile
                  </MDBListGroupItem>
                </NavLink>
                <NavLink
                  exact={true}
                  to={"/odashboard/" + jwt_decode(Cookies.get("token")).uid}
                  activeClassName="activeClass"
                >
                  <MDBListGroupItem>
                    <i className="fas m-1 fa-calendar-alt"></i>
                    Events
                  </MDBListGroupItem>
                </NavLink>
                <NavLink
                  to={
                    "/odashboard/" +
                    jwt_decode(Cookies.get("token")).uid +
                    "/activity"
                  }
                  activeClassName="activeClass"
                >
                  <MDBListGroupItem>
                    <i className="fas m-1 fa-history"></i>
                    Past Events
                  </MDBListGroupItem>
                </NavLink>
                <MDBListGroupItem>
                  <input
                    type="button"
                    className=" btn form-control btn-danger"
                    onClick={this.handleLogout}
                    value="Log Out"
                  />
                </MDBListGroupItem>
              </MDBListGroup>
            )}
          </div>
          <div id="content">{this.props.children}</div>
        </div>
      </>
    );
  }
  handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("type");
    if (!Cookies.get("token")) {
      window.location.reload();
    }
  };
}

export default OrgLayout;
