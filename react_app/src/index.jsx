import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/App";
import Pay from './components/trial'
import './components/App.css'


const App = () => <Main />;
const C=()=><Pay/>



ReactDOM.render(<App/>, document.getElementById("root"));
