import React from "react";
import { MDBListGroup, MDBListGroupItem, MDBIcon } from "mdbreact";
import "./volunteer.css";
import { NavLink } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import user from "../../user.png";

//navbar and sidebar layout
class VolLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('lay')
    if (Cookies.get("token") && Cookies.get("type") != "/vdashboard/") {
      this.props.history.push("/");
    }
  }
  render() {
    console.log('lay')
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
            {Cookies.get("token") && Cookies.get("type") === "/vdashboard/" && (
              <MDBListGroup className="list-group-flush">
                <NavLink
                  exact={true}
                  to={
                    "/vdashboard/" +
                    jwt_decode(Cookies.get("token")).uid +
                    "/profile"
                  }
                  activeClassName="activeClass"
                >
                  <MDBListGroupItem>
                    {" "}
                    <i className="fas m-1 fa-user-alt"></i>
                    Profile
                  </MDBListGroupItem>
                </NavLink>
                <NavLink
                  exact={true}
                  to={"/vdashboard/" + jwt_decode(Cookies.get("token")).uid}
                  activeClassName="activeClass"
                >
                  <MDBListGroupItem>
                    {" "}
                    <i className="fas m-1 fa-calendar-alt"></i>
                    Events
                  </MDBListGroupItem>
                </NavLink>
                <NavLink
                  to={
                    "/vdashboard/" +
                    jwt_decode(Cookies.get("token")).uid +
                    "/activity"
                  }
                  activeClassName="activeClass"
                >
                  <MDBListGroupItem>
                    <i className="fas m-1 fa-history"></i>Past Events
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

  //handle on logout
  handleLogout = () => {
    Cookies.remove("token");
    console.log('removed')
    Cookies.remove("type");
    if (!Cookies.get("token")) {
      window.location.reload();
    }
  };
}

export default VolLayout;
