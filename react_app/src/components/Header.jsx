import React from "react";
import {
    Link
  } from "react-router-dom";
 
class Header extends React.Component {


  render() {
    return (

<nav className="navbar navbar-expand-lg navbar-light bg-info navbar-fixed-top">

<div className='navbar-brand text-weight-bold'>ConnectHour</div>


<Link className="navbar-brand " to='/' >
  Log in
</Link>

</nav>

   

);
}
}

export default Header;
