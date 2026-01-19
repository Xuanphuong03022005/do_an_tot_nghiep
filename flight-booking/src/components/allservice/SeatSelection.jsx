// src/components/AllServices/SeatSelection.jsx

import React, { Component } from "react";
import "./allServices.css";
// Dữ liệu giả lập cho sơ đồ chỗ ngồi Airbus A321
const seatData = {
  aircraft: "AIRBUS A321",
  layout: [
    {
      row: 20,
      config: "XL",
      seats: ["A", "B", "C", "H", "J", "K"],
      types: { "20A": "XL", "20K": "XL" },
      price: 100000,
    },
    {
      row: 21,
      config: "Std",
      seats: ["A", "B", "C", "H", "J", "K"],
      occupied: ["21A", "21C"],
    },
    { row: 22, config: "Std", seats: ["A", "B", "C", "H", "J", "K"] },
    {
      row: 23,
      config: "Std",
      seats: ["A", "B", "C", "H", "J", "K"],
      selectedByOther: ["23H"],
    },
    { row: 24, config: "Std", seats: ["A", "B", "C", "H", "J", "K"] },
    {
      row: 25,
      config: "Exit",
      seats: ["A", "C", "H", "K"],
      special: { "25B": "Loo", "25J": "Loo" },
    },
    {
      row: 26,
      config: "XL",
      seats: ["A", "B", "C", "H", "J", "K"],
      types: { "26A": "XL", "26K": "XL" },
      price: 100000,
    },
    { row: 27, config: "Std", seats: ["A", "B", "C", "H", "J", "K"] },
    { row: 28, config: "Std", seats: ["A", "B", "C", "H", "J", "K"] },
    { row: 29, config: "Std", seats: ["A", "B", "C", "H", "J", "K"] },
    { row: 30, config: "Std", seats: ["A", "B", "C", "H", "J", "K"] },
    { row: 31, config: "Std", seats: ["A", "B", "C", "H", "J", "K"] },
    { row: 32, config: "Std", seats: ["A", "B", "C", "H", "J", "K"] },
  ],
};

class SeatSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSeatId: null,
      selectedSeatPrice: 0,
      previousSeatPrice: 0,
    };
  }

  handleSeatSelect = (seatId, newPrice) => {
    const { selectedSeatId, previousSeatPrice } = this.state;
    const { updateTotal } = this.props;

    if (seatId === selectedSeatId) {
      this.setState({
        selectedSeatId: null,
        selectedSeatPrice: 0,
        previousSeatPrice: 0,
      });
      updateTotal(-previousSeatPrice);
    } else {
      const priceChange = newPrice - previousSeatPrice;

      this.setState({
        selectedSeatId: seatId,
        selectedSeatPrice: newPrice,
        previousSeatPrice: newPrice,
      });
      updateTotal(priceChange);
    }
  };

  renderSeat = (row, seatId, seatType, rowPrice = 55000, rowData) => {
    const isSelected = this.state.selectedSeatId === seatId;
    const isOccupied =
      (rowData.occupied && rowData.occupied.includes(seatId)) ||
      (rowData.selectedByOther && rowData.selectedByOther.includes(seatId));

    const seatPrice = seatType === "XL" ? rowPrice : 55000;

    let className = "sv-seat";
    if (seatType === "XL") className += " sv-seat-xl";
    if (isSelected) className += " sv-seat-selected";
    if (isOccupied) className += " sv-seat-occupied";

    const isClickable = !isOccupied && !rowData.selectedByOther;

    return (
      <div
        key={seatId}
        className={className}
        onClick={() => isClickable && this.handleSeatSelect(seatId, seatPrice)}
        title={
          isClickable
            ? `${seatId} - ${seatPrice.toLocaleString("vi-VN")} VND`
            : isOccupied
            ? "Đã có người"
            : "Không trống"
        }
      >
        {seatType === "XL" ? "XL" : null}
      </div>
    );
  };

  renderRow = (row) => {
    const {
      seats,
      types = {},
      special = {},
      row: rowNumber,
      price: rowPrice,
    } = row;
    const seatElements = [];
    const seatColumns = ["A", "B", "C", "aisle", "H", "J", "K"];

    seatColumns.forEach((col) => {
      const seatId = rowNumber + col;
      const seatType = types[seatId] || (seats.includes(col) ? "Std" : "Empty");

      if (col === "aisle") {
        seatElements.push(
          <div key={`aisle-${rowNumber}`} className="sv-aisle-spacer"></div>
        );
      } else if (special[seatId] === "Loo") {
        seatElements.push(
          <div key={seatId} className="sv-seat sv-seat-restroom">
            🚻
          </div>
        );
      } else if (seats.includes(col)) {
        seatElements.push(
          this.renderSeat(rowNumber, seatId, seatType, rowPrice, row)
        );
      } else {
        seatElements.push(
          <div key={seatId} className="sv-seat sv-seat-empty"></div>
        );
      }
    });

    return (
      <div key={rowNumber} className="sv-seat-row">
        <span className="sv-row-number">{rowNumber}</span>
        {seatElements}
      </div>
    );
  };

  render() {
    const section1 = seatData.layout.slice(0, 5);
    const section2 = seatData.layout.slice(5);

    return (
      <div className="form-section sv-seatmap-section">
        <h3 className="section-sub-title">Chọn chỗ ngồi</h3>
        <p>Lựa chọn ghế ngồi ưu thích của quý khách trên chuyến bay.</p>
        <p className="sv-price-info">TỪ 55.000 VND (Ghế tiêu chuẩn)</p>

        <div className="sv-seat-map-wrapper">
          {/* Chú giải Sơ đồ (Legend) */}
          <div className="sv-seat-map-legend">
            <p>Chú giải Sơ đồ chỗ ngồi</p>
            <div className="sv-legend-item">
              <span className="sv-legend-box sv-seat-xl">XL</span> Ghế ngồi yên
              tĩnh (XL)
            </div>
            <div className="sv-legend-item">
              <span className="sv-legend-box sv-seat-standard"></span> Ghế tiêu
              chuẩn
            </div>
            <div className="sv-legend-item">
              <span className="sv-legend-box sv-seat-occupied"></span> Không còn
              trống
            </div>
            <div className="sv-legend-item">
              <span className="sv-legend-box sv-seat-selected"></span> Ghế đang
              chọn
            </div>
            <div className="sv-legend-item">
              <span className="sv-legend-box sv-seat-restroom">🚻</span> Nhà vệ
              sinh
            </div>
          </div>

          {/* Khu vực Sơ đồ */}
          <div className="sv-map-area">
            <p className="sv-aircraft-info">{seatData.aircraft}</p>

            <div className="sv-aircraft-section">
              <p className="sv-section-label">Đầu máy bay ⬆️</p>
              <div className="sv-seat-columns">
                <span></span>
                <span>A</span>
                <span>B</span>
                <span>C</span>
                <span></span>
                <span>H</span>
                <span>J</span>
                <span>K</span>
              </div>
              {section1.map(this.renderRow)}
            </div>

            <div className="sv-aircraft-section">
              <p className="sv-section-label">Đuôi máy bay ⬇️</p>
              <div className="sv-seat-columns">
                <span></span>
                <span>A</span>
                <span>B</span>
                <span>C</span>
                <span></span>
                <span>H</span>
                <span>J</span>
                <span>K</span>
              </div>
              {section2.map(this.renderRow)}
            </div>

            <p className="sv-selection-status">
              Ghế đã chọn:{" "}
              <strong>{this.state.selectedSeatId || "Chưa chọn"}</strong>
              {this.state.selectedSeatId &&
                ` (${this.state.selectedSeatPrice.toLocaleString(
                  "vi-VN"
                )} VND)`}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default SeatSelection;
