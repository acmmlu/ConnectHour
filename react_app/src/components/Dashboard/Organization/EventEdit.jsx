import React from "react";
import axios from "axios";
import { TimePicker } from 'antd';
import moment, { min } from 'moment';
import 'antd/dist/antd.css';
const format = 'HH:mm';


class EventEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.eventdata
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
    });
  };
  

  render() {
    const formData = this.state.formData;
    const endtime=formData.EndTime
    const starttime=formData.StartTime
    return (
      <React.Fragment>
        <div className=' EditForm' >
          <form
            className=""
            onSubmit={e => this.onSubmit(e, this.state.formData)}
          >
            <div className="form-group row p-4">
              <label htmlFor="EventName" className=" pt-2 col-2">
                Event Name:
              </label>
              <input
                type="text"
                value={formData.EventName}
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
                value={formData.Description}
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
                value={formData.StreetNumber}
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
                value={formData.StreetName}
                type="text"
                onChange={this.handleInputChange}
                className="form-control col-4"
                name="StreetName"
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
                value={formData.City}
                id="StreetName"
                placeholder="Enter City"
                required
              />
              <label htmlFor="State" className=" pt-2 col-2">
                State:
              </label>
              <input
                type="text"
                value={formData.State}
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
                type="text"
                value={formData.ZIP}
                onChange={this.handleInputChange}
                className="form-control col-4"
                name="ZIP"
                id="ZIP"
                placeholder="Enter ZIP"
                required
              /> <label htmlFor="date" className=" pt-2 col-2">
              Date:  
            </label>
             <input
                type="date"
                className="form-control col-5"
                onChange={this.handleInputChange}
                name="date"
                id="date"
                defaultValue={moment(this.state.formData.StartTime).format(
                  "YYYY-MM-DD"
                )}
              />
            </div>
           
           
            <div className="form-group row p-4">
              <label htmlFor="StartTime" className=" pt-2 col-2">
                Start Time:

                    </label>
                    <div>
                    <TimePicker
                  format="HH:mm"
                  defaultValue={moment(
                    moment(this.state.formData.StartTime).format("HH:mm"),
                    "HH:mm"
                  )}
                  onChange={this.onStartTime}
                />
                    </div>
              <label htmlFor="EndTime" className="col-2">
                End Time:
              </label>
              <div >
              <TimePicker
                  format="HH:mm"
                  onChange={this.onEndTime}
                  defaultValue={moment(
                    moment(this.state.formData.EndTime).format("HH:mm"),
                    "HH:mm"
                  )}
                />
              </div>
            </div>

            <div className="p-2 text-center m-2">
              <input
                type="submit"
                className="btn btn-info "
                value="Confirm Changes"
              />
              <input
                className="btn btn-danger m-2"
                value="Cancel"
                type='button'
                onClick={this.props.openEditReset}
              />
            </div>
          </form>
        </div>
      </React.Fragment>
   
   );
  }

  onSubmit = (e, formData) => {
    e.preventDefault();
    console.log(formData);
    const p=this.props       
    const f=this.state.formData
    axios
      .put("http://localhost:40951/event/"+this.props.ID+"/"+f["id"] , f)
      .then(function(response, props) {
        console.log(response)
        p.openEditReset()
        window.location.reload()
      })
      .catch(function(error) {
        console.log("error");
      });
  };
}


export default EventEdit;
