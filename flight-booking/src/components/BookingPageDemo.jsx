// // src/pages/BookingPageDemo.jsx (Đúng)

// import React, { Component } from "react";
// import AllServices from "../components/allservice/AllService";
// // ⬅️ Cần import lại các component Form
// import FormInfo from "../components/form/FormInfo"; // (Giả sử đường dẫn đúng)
// import LoyaltyForm from "../components/form/LoyaltyForm";
// import ContactInfoForm from "../components/form/ContactInfoForm";
// // ⬅️ Đảm bảo CSS được import

// class BookingPageDemo extends Component {
//   // ... (logic handleSubmit) ...

//   render() {
//     return (
//       // Thêm class .main-booking-form vào thẻ form
//       <form className="main-booking-form" onSubmit={this.handleSubmit}>
//         {/* 1. THÔNG TIN HÀNH KHÁCH */}
//         <div className="form-section form-myinfo">
//           {/* ... (Tiêu đề, chú thích) ... */}
//           <FormInfo />
//         </div>

//         {/* 2. KHÁCH HÀNG THÂN THIẾT */}
//         <LoyaltyForm />

//         {/* 3. THÔNG TIN LIÊN LẠC */}
//         <ContactInfoForm />

//         {/* 4. DỊCH VỤ BỔ SUNG */}
//         <AllServices />
//       </form>
//     );
//   }
// }
// export default BookingPageDemo;
