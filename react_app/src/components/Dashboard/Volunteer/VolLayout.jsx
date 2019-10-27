import React from "react";
import Cookies from "js-cookie";
import { MDBListGroup, MDBListGroupItem, MDBIcon } from 'mdbreact';
import './volunteer.css'
import { NavLink } from 'react-router-dom';


//navbar and sidebar layout
class VolLayout extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <nav className="navbar  flex-nav navbar-expand-lg navbar-light bg-info navbar-fixed-top">
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
         
{/* 
        <div className="sidebar-fixed position-fixed">
            <a href="#!" className="logo-wrapper waves-effect">
                <img alt="MDB React Logo" className="img-fluid" alt='image'/>
            </a>
            <MDBListGroup className="list-group-flush">
                <NavLink exact={true} to="/" activeClassName="activeClass">
                    <MDBListGroupItem>
                        Profile
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/profile" activeClassName="activeClass">
                    <MDBListGroupItem>
                        Events
                    </MDBListGroupItem>
                </NavLink>
                <NavLink to="/tables" activeClassName="activeClass">
                    <MDBListGroupItem>
                        Log Out
                    </MDBListGroupItem>
                </NavLink>

            </MDBListGroup>
        </div> */}




      </>
    );
  }

  //handle on logout
  handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("type");

    console.log(Cookies.get());
    if (!Cookies.get("token")) {
      window.location.reload();
    }
  };
}

export default VolLayout;
