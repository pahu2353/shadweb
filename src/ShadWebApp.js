
import React from 'react';
import './ShadWebApp.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./Components/RegisterPage.js";
import LeafletMap from "./Components/LeafletMap.js";
import HomePage from "./Components/HomePage.js";

export class ShadWebApp extends React.Component{
  constructor(props){
    super(props);
    this.state= {

    }
}
  render() {

    return (
      <div>  
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/register/*" element={<RegisterPage />} />
          <Route path="/map/*" element={<LeafletMap />} />

        </Routes>
      </BrowserRouter>
        
      </div>
      
    )
  }
}

export default ShadWebApp;
