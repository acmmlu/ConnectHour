import React from "react";
import "./OrgLayout.css";
import Cookies from "js-cookie";
import { NavLink } from 'react-router-dom';

import { MDBListGroup, MDBListGroupItem, MDBIcon } from 'mdbreact';
import  user from '../../user.png' 
import jwt_decode from "jwt-decode";
class OrgLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <nav className="navbar  flex-nav navbar-expand-lg navbar-light bg-info navtop">   
          <span className="navbar-brand ml-5 font-weight-bold" href="#">
            ConnectHour
          </span>
        </nav>
         

        <div className="sidebar-fixed position-fixed">
       
            <div className="logo-wrapper waves-effect">
                <img src={user} className="img-fluid" alt='image'/>
            </div>
            { (Cookies.get("token") && Cookies.get("type")==='/odashboard/') &&
            <MDBListGroup className="list-group-flush">
                <NavLink exact={true} to={"/odashboard/"+(jwt_decode(Cookies.get("token"))).uid+"/profile"} activeClassName="activeClass">
                    <MDBListGroupItem>
                        Profile
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to={"/odashboard/"+(jwt_decode(Cookies.get("token"))).uid} activeClassName="activeClass">
                    <MDBListGroupItem>
                        Events
                    </MDBListGroupItem>
                </NavLink>
                {/* <NavLink to={"/odashboard/"+(jwt_decode(Cookies.get("token"))).uid+"/activity"} activeClassName="activeClass">
                    <MDBListGroupItem>
                        Past Events
                    </MDBListGroupItem>
                </NavLink> */}
                <MDBListGroupItem>
            
            <input
              type="button"
              className=" btn form-control btn-danger"
              onClick={this.handleLogout}
              value="Log Out"
            />
   
          </MDBListGroupItem>
              

            </MDBListGroup>
          }
        </div> 

</>
    );
  }
  handleLogout = () => {
    console.log(Cookies.get());
    Cookies.remove("token");
    Cookies.remove("type");
    console.log(Cookies.get());
    if (!Cookies.get("token")) {
      window.location.reload();
    }
  };
}

export default OrgLayout;
