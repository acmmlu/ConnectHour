import React from "react";

class NotFound extends React.Component {
  render() {
    return (
      <>
        <div className="backgrounddiv">
        <div className="container my-auto" style={{width:'100%',height:'100%'}}>
          <div className='row m-auto text-center'>
            <div className='col text-white ' style={{fontSize:'50px'}}>Page Not Found.. <i className="fas fa-blind"></i> </div>
          </div>
        </div>
        </div>
      </>
    );
  }
}

export default NotFound;
