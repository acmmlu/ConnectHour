import React from "react";
import Events from "./Events";
import Cookies from "js-cookie";
import axios from "axios";
import jwt_decode from "jwt-decode";

class OrgProfile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            formDataOld: {
                AccountName: "",
                pfp: "",
                Email: "",
                Description: "",
                Address: "",
                Number: "",
                City: "",
                State: "",
                Zipcode: ""
            },
            formData: {
                AccountName: "",
                pfp: "",
                Email: "",
                Description: "",
                Address: "",
                Number: "",
                City: "",
                State: "",
                Zipcode: ""
            },
            id: "",
            Editing: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount=()=> {
   
        console.log(Cookies.get())

        if (Cookies.get("token")&& Cookies.get("type")==='/odashboard/') {
            const ID = (jwt_decode(Cookies.get("token"))).uid
            const p = this
            axios
            .get("/organization/"+p.props.id)
            .then(function(response) {
                p.setState({formData: response.data})
                console.log(response);
            })
            .catch(function(error) {
                console.log(error);
            });
        }
        else{
           this.props.history.push("/");
        }
       
    }

    handleChange(event) {
        let formDataOld = this.state.formDataOld ;
        formDataOld[event.target.id] = event.target.value;
        this.setState({
            formDataOld
        });
    }

    handleSubmit(event) {
       
        if (this.state.Editing && event.target.name !== "cancel") {
            let formData= this.state.formData
            this.setState({
                formData:this.state.formDataOld
            });
            console.log(this.state.formDataOld,this.state.formData)
            this.populateFields();
        }
        this.toggleEditMode();
    }

    toggleEditMode() {
        if (this.state.Editing) {
            for (let e of document.getElementsByClassName("form-control")) {
                e.readOnly = true;
            }

            let cancel = document.getElementById("cancel");
            cancel.classList.add("invisible");
            cancel.classList.remove("visible");

            let submit = document.getElementById("submit");
            submit.innerHTML = "Edit";

            this.setState({Editing: false});
        } else {
            for (let e of document.getElementsByClassName("form-control")) {
                e.readOnly = false;
            }

            let cancel = document.getElementById("cancel");
            cancel.classList.remove("invisible");
            cancel.classList.add("visible");

            let submit = document.getElementById("submit");
            submit.innerHTML = "Save";

            this.setState({Editing: true});
        }

    }

    populateFields() {
        for (let e of document.getElementsByClassName("form-control")) {
            e.value = this.state.formData[e.id];
            
        }
    }

    render() {
        return(
            <div className="container">
                <div className="row mb-5" style={{"marginTop":"20px"}}>
                    <div className="col-4">
                        <img src="" className="img-thumbnail" style={{width:"200px",height:"200px"}}/>
                        {/* Profile picture here */}
                    </div>
                    <div className="col-8">
                        <div className="row h-100 align-items-center justify-content-start">
                            <div className="col-5">
                                <h5 id="AccountName" className="font-weight-bold">accountName</h5>
                            </div>
                            <div className="col-5">
                                <h5 id="AccountEmail">accountEmail</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row pt-3 pb-3 mb-4 justify-content-start bg-light">
                    <div className="col-12">
                        <h3 htmlFor="Description">Description</h3>
                        <textarea id="Description" placeholder="Description" className="form-control" onChange={this.handleChange} readOnly/>
                    </div>
                </div>
                <div className="row pt-3 mb-2 bg-light d-flex justify-content-center">
                    <div className="col">
                        <div className="row mb-5"> {/* Address Section */}
                            <div className="col">
                                <h3>Address Info</h3>
                            </div>
                        </div>
                        <div className="row mb-5 pr-2"> {/* Building No. & Street Name */}
                            <div className="col-2">
                                <h5 className="text-right">Number</h5>
                            </div>
                            <div className="col-2">
                                <input id="Number" type="number" placeholder="" className="form-control" onChange={this.handleChange} readOnly/>
                            </div>
                            <div className="col-2">
                                <h5 className="text-right">Street</h5>
                            </div>
                            <div className="col-5">
                                <input id="Address" type="text" placeholder="Address" className="form-control" onChange={this.handleChange} readOnly/>
                            </div>
                        </div>
                        <div className="row mb-5 pr-2"> {/* City & State */}
                            <div className="col-2">
                                <h5 className="text-right">City</h5>
                            </div>
                            <div className="col-5">
                                <input id="City" type="text" placeholder="City" className="form-control" onChange={this.handleChange} readOnly/>
                            </div>
                            <div className="col-2">
                                <h5 className="text-right">State</h5>
                            </div>
                            <div className="col-2">
                                <input it="State" type="text" placeholder="State" className="form-control" onChange={this.handleChange} readOnly/>
                            </div>
                        </div>
                        <div className="row mb-5 pr-2"> {/* Zip & Buttons*/}
                            <div className="col-2">
                                <h5 className="text-right">Zip</h5>
                            </div>
                            <div className="col-2">
                                <input id="Zipcode" type="text" placeholder="Zip Code" className="form-control" onChange={this.handleChange} readOnly/>
                            </div>
                            <div className="col-4"></div>
                            <div className="col-2">
                                <button id="cancel" type="submit" className="btn btn-danger invisible" onClick={this.handleSubmit}>Cancel</button>
                            </div>
                            <div className="col-1">
                                <button id="submit" type="submit" className="btn btn-primary visible" onClick={this.handleSubmit}>Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

   
}

export default OrgProfile;