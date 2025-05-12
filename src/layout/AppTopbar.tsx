import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { AppTopbarRef } from "../../types";
import AppBreadcrumb from "./AppBreadCrumb";
import useStore from "./useStore";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { onMenuToggle, currentUser, setCurrentUser, setAccessToken } =
    useStore().data;
  const menubuttonRef = useRef(null);
  const navigate = useNavigate();
  const menuRef = useRef<Menu>(null);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
  }));

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setAccessToken("");
    setCurrentUser(null);
    navigate("/signin");
  };

  const profileMenuItems = [
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => navigate("/profile"),
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: handleLogout,
    },
  ];

  return (
    <div className="layout-topbar">
      <div className="topbar-start">
        <button
          ref={menubuttonRef}
          type="button"
          className="topbar-menubutton p-link p-trigger"
          onClick={onMenuToggle}
        >
          <i className="pi pi-bars"></i>
        </button>
        <AppBreadcrumb className="topbar-breadcrumb"></AppBreadcrumb>
      </div>

      <div className="topbar-end flex align-items-center gap-2">
        {!currentUser ? (
          <>
            <Button
              label="Sign In"
              className="p-button-text"
              onClick={() => navigate("/signin")}
            />
            <Button
              label="Sign Up"
              severity="info"
              onClick={() => navigate("/signup")}
            />
          </>
        ) : (
          <div className="flex align-items-center">
            <div
              className="cursor-pointer"
              onClick={(e) => menuRef.current?.toggle(e)}
            >
              <Avatar
                icon="pi pi-user"
                size="normal"
                shape="circle"
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "#ffffff",
                }}
              />
            </div>
            <Menu
              ref={menuRef}
              model={profileMenuItems}
              popup
              style={{ width: "200px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
