import React from "react";
import WeatherWidget from "./components/weatherWidget";
import Calendar from "./components/calendar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const App = () => {

  return (
    <>

      <WeatherWidget />

      <div className="row calendar container-fluid px-0 m-0">
        <div className="col-sm-1 col-lg-2"></div>
        <div id="calendar" className="col-xs-12 col-sm-10 col-lg-8 container-fluid p-0">
          <div id="month-year"></div>

          <Calendar />

        </div>
        <div className="col-sm-1 col-lg-2"></div>
      </div>

    </>
  );
}

export default App;
