import React from "react";
import Banner from "../flightInfo/Banner";
import FormInfo from "./FormInfo";
import LoyaltyForm from "./LoyaltyForm";
import ContactInfoForm from "./ContactInfoForm";
import Agree from "./Agree";

export default function Form(props) {
  const { flightData } = props;
  return (
    <div>
      <Banner flightData={flightData} pageType="passenger" />
      <div className="main-booking-form">
        <FormInfo />
        <LoyaltyForm />
        <ContactInfoForm />
        <Agree />
      </div>
    </div>
  );
}
