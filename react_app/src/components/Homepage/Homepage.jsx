import React from "react";
import { Jumbotron } from "reactstrap";
import bgimage from "../../Volunteer.png";
import logo from "../../logo.png";
import Header from '../Header'


class Homepage extends React.Component {
 
  render() {
    return (<>
    <Header/>
      <div className="container ">
      <Jumbotron
          className="text-center   mb-5 shadow     "
          style={{
            backgroundImage: `url(${bgimage})`,
            backgroundSize: "cover"
          }}
        >
          {" "}
          <h1 className="my-2 font-weight-bold  ">
            {" "}
            A Volunteer Management System
          </h1>
          <span className="display-1 font-weight-bold font-italic">
            <img src={logo} alt="Connect Hour" />
          </span>
        </Jumbotron>
      </div>
     
        
       

        
      </>
    );
  }
}

export default Homepage;
 