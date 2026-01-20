import { Outlet } from "react-router-dom";
import Header from "../header/Header";

function UserLayout({ currentUser, onLogout, onSelectFlight }) {
  return (
    <>
      <Header
        user={currentUser}
        onLogout={onLogout}
        onSelectFlight={onSelectFlight}
      />
      <Outlet />
    </>
  );
}

export default UserLayout;
