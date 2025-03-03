import { FC } from "react";
import { Settings, Bell, User } from "lucide-react";

const SettingsSidebar: FC = () => {
  const menuItems = [
    { name: "Profile", icon: <User />, href: "/settings" },
    { name: "Notifications", icon: <Bell />, href: "/settings/notifications" },
    { name: "Account", icon: <Settings />, href: "/settings/account" },
  ];

  return (
    <aside className="bg-white w-full p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Settings</h3>
      <nav>
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            {item.icon}
            {item.name}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default SettingsSidebar;
