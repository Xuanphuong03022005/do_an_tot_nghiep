// FlightInfo.js (Component cha của Banner Info)
import React, { Component } from "react";

import Info from "./Info";

class FlightInfo extends Component {
  render() {
    // Giả định flightData được truyền từ Router/State cao hơn
    const { flightData } = this.props;

    return (
      <div>
                {/* Truyền flightData: Banner sẽ lưu nó vào localStorage */}
                      <Info flightData={flightData} />     {" "}
      </div>
    );
  }
}

export default FlightInfo;
