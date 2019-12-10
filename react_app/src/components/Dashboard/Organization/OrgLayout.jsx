import React from "react";
import "./OrgLayout.css";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import logo from "../../../favicon.png";
import { MDBListGroup, MDBListGroupItem } from "mdbreact";
import user from "../../user.png";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { CometChat } from "@cometchat-pro/chat";


class OrgLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: ""
    };

  }
  componentDidMount() {
    if (Cookies.get("token") && Cookies.get("type") === "/odashboard/") {
      
      const ID = jwt_decode(Cookies.get("token")).uid;
      let p = this;
  
      axios
        .get("/pfp/org/" + ID)
        .then(function(res) {
          let buf = Buffer.from(res.data, 'binary');
  
          var reader = new FileReader();
          reader.onload = (function(self) {
            return function(e) {
              p.setState({photo: reader.result});
              document.getElementById("sidebarpfp").src = reader.result;
            }
          })(this);
          
          reader.readAsDataURL(new Blob([buf], {type: 'image/png'}));
        })
        .catch(function(error) {
          console.log(error);
          p.setState({photo: user});
        });
    }else{this.props.history.push("/");}
  }
  render() {
    return (
      <>
        <nav className="navbar  flex-nav navbar-expand-lg navbar-light bg-info navtop">
        <div className="ml-2 font-weight-bold ">
            <img className="Navimg" src={logo} alt=''/>
          </div>
        </nav>
        <div className="wrapper">
          <div className="sidebar-fixed position-fixed">
            <div className="logo-wrapper waves-effect">
            <img
                id="sidebarpfp"
                alt=''
                src={this.state.photo ? this.state.photo : user}
                style={{ width: "200px", height: "200px" }}
              />            </div>
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
                <NavLink
                  exact={true}
                  to={
                    "/odashboard/" +
                    jwt_decode(Cookies.get("token")).uid +
                    "/messages"
                  }
                  activeClassName="activeClass"
                >
                  <MDBListGroupItem>
                    {" "}
                    <i className="fas m-1 fa-envelope"></i>
                    Messages
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
   
      CometChat.logout().then(
        () => {
          window.location.reload(true);
        },
        error => {
          window.location.reload(true);
        }
      );
  
    Cookies.remove("token");
    Cookies.remove("type");
    if (!Cookies.get("token")) {
      window.location.reload();
    }
  };
}

export default OrgLayout;
