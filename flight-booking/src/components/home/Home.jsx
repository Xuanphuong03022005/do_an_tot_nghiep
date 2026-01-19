import React, { Component } from "react";
import BannerBooking from "./BannerBooking";
import Utilities from "./Utilities";
import Service from "./Service";
import ServiceSupport from "./ServiceSupport";
import About from "./About";
class Home extends Component {
  render() {
    const handleSelectFlight = (flightData) => {
      console.log("Dữ liệu chuyến bay:", flightData);
      // 👉 Điều hướng sang trang kết quả
      window.location.href = "/flight-info";
    };
    return (
      <div>
        <BannerBooking onSelectFlight={handleSelectFlight} />
        <Utilities />
        <Service />
        <ServiceSupport />
        <About />
      </div>
    );
  }
}

export default Home;
