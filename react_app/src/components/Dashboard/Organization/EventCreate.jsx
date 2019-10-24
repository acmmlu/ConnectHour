import React,{Component} from "react";
import axios from "axios";
import { TimePicker } from 'antd';
import moment, { min } from 'moment';
import 'antd/dist/antd.css';
const format = 'HH:mm';




class EventCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        EventName: "",
        Description: "",
        OrganizationName: "Milan",
        OrganizationId: "1",
        StreetNumber: "",
        StreetName: "",
        City: "",
        State: "",
        ZIP: "",
        StartTime: "",
        EndTime: ""
      }
    }
    this.onEndTime=this.onEndTime.bind(this)
    this.onStartTime=this.onStartTime.bind(this)

  }

  onStartTime(n, time) {
    console.log(time)
    let formData = { ...this.state.formData };
    formData['StartTime']=time
    this.setState({
     formData
    })
    console.log(this.state.formData)
  }
    onEndTime(n, time) {
      let formData = { ...this.state.formData };
    formData['EndTime']=time
    this.setState({
     formData
    })
    }

  handleInputChange = e => {
    let formData = { ...this.state.formData };
    formData[e.target.name] = e.target.value;
    this.setState({
      formData
    })
    
    
  };

  render() {
    return (
      <React.Fragment>
        <div >
          <form
            className="card  m-2 shadow p-3 mb-5 bg-white rounded "
            onSubmit={e => this.onSubmit(e, this.state.formData)}
          >
            <div className="form-group row p-4">
              <label htmlFor="EventName" className=" pt-2 col-2">
                Event Name:
              </label>
              <input
                type="text"
                name="EventName"
                onChange={this.handleInputChange}
                className="form-control col-4"
                id="EventName"
                placeholder="Enter Event Name"
                required
              />
              <label htmlFor="description" className=" pt-2 col-2">
                Event Description
              </label>
              <textarea
                className="form-control pr-3 col-4"
                onChange={this.handleInputChange}
                name="Description"
                id="description"
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-group row p-4">
              <label htmlFor="StreetNumber" className=" pt-2 col-2">
                Street Number:
              </label>
              <input
                type="text"
                onChange={this.handleInputChange}
                className="form-control col-4"
                name="StreetNumber"
                id="StreetNumber"
                placeholder="Enter Street Number"
              />

              <label htmlFor="StreetName" className=" pt-2 col-2">
                Street Name:
              </label>
              <input
                type="text"
                onChange={this.handleInputChange}
                className="form-control col-4"
                name="StreetNumber"
                id="StreetName"
                placeholder="Enter Street Name"
                required
              />
            </div>

            <div className="form-group row p-4">
              <label htmlFor="City" className=" pt-2  col-2">
                City:
              </label>
              <input
                type="text"
                onChange={this.handleInputChange}
                className="form-control col-4"
                name="City"
                id="StreetName"
                placeholder="Enter City"
                required
              />
              <label htmlFor="State" className=" pt-2 col-2">
                State:
              </label>
              <input
                type="text"
                onChange={this.handleInputChange}
                className="form-control col-4"
                name="State"
                id="State"
                placeholder="Enter State Name"
                required
              />
            </div>
            <div className="form-group row p-4">
              <label htmlFor="ZIP" className=" pt-2 col-2">
                ZIP:
              </label>
              <input
                pattern="[0-9]{5}"
                title="Please Enter Valid Zip"
                type="text"
                onChange={this.handleInputChange}
                className="form-control col-4"
                name="ZIP"
                id="ZIP"
                placeholder="Enter ZIP"
                required
              />
              <label htmlFor="date" className="  col-2">
              Date:
            </label>
            <input type="date" className='form-control  col-4' name="date" />
            </div>
            
            <div className="form-group row p-4">
              <label htmlFor="StartTime" className=" pt-2 col-2">
                Start Time:

                    </label>
                    <div>
                    <TimePicker  onChange={this.onStartTime} defaultValue={moment('13:30', 'HH:mm')} />   

                    </div>
              <label htmlFor="EndTime" className="col-2">
                End Time:
              </label>
              <div >
              <TimePicker  onChange={this.onEndTime} defaultValue={moment('13:30', 'HH:mm')} />   
              </div>
            </div>

            <div className="p-2 text-center">
              <input type="submit" className="btn btn-info " value="Submit" />
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }


  onSubmit = (e, formData) => {
    e.preventDefault();
;
    const p = this.props;
    console.log(formData);
    axios
      .post(
        "http://localhost:40951/event/" + formData["OrganizationId"] + "/",
        formData
      )
      .then(function(response, props) {
        console.log("success");
        p.addEvent(formData);
        p.toggleCreateForm();
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}

export default EventCreate;
