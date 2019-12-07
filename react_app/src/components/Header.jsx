import React from "react";

 import logo from '../favicon.png'
class Header extends React.Component {


  render() {
    return (


 <div className='navbardiv'>
<nav className="navbar navbar-light bg-info "> 

<div className = 'font-weight-bold '>
<img alt='' className='Navimg' src={logo} />
 
</div>


 </nav>  

 </div>


   

);
}
}

export default Header;
