import React from "react";
import Header from "../header/Header";
import { Outlet } from "react-router-dom";

function MainLayout({ user, onSelectFlight }) {
  return (
    <>
      <Header value={user} onSelectFlight={onSelectFlight} />{" "}
      {/* ✅ truyền xuống */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
