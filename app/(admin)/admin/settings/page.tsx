import { FC } from "react";
import SettingsSidebar from "../../_components/SettingSideBar";
import SettingsForm from "../../_components/SettingsForm";
import SettingsTop from "../../_components/SettingsTop";

const SettingsPage: FC = () => {
  return (
    <div className="">
      <SettingsTop />
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-2">
        <SettingsSidebar />
        <div className="col-span-2">
          <SettingsForm />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
