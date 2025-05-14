import type { MenuModel } from "../../types";
import { useAuth } from "../GlobalProvider/useData/AuthContext";
import AppSubMenu from "./AppSubMenu";

const AppMenu = () => {
  const { isAdmin } = useAuth();
  const model: MenuModel[] = [
    {
      label: "Dashboards",
      icon: "pi pi-home",
      items: [
        {
          label: "Home",
          icon: "pi pi-fw pi-home",
          to: "/",
        },
        ...(isAdmin()
          ? [
              {
                label: "Task Management",
                icon: "pi pi-fw pi-list",
                to: "/tasks",
              },
            ]
          : []),
      ],
    },
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenu;
