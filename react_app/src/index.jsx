import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/App";
import EventsVol from './components/Dashboard/Volunteer/EventsVol'
import Events from './components/Dashboard/Organization/Events'
import './components/App.css'


const App = () => <Main />;
const App2=()=> <EventsVol/>
const App3=()=><Events/>



ReactDOM.render(<App />, document.getElementById("root"));
