import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SettingsForm: FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Profile Settings</h3>
      <form className="space-y-4">
        <div>
          <Label>Email Address</Label>
          <Input type="email" placeholder="Email Address" />
        </div>
        <div>
          <Label>Username</Label>
          <Input type="text" placeholder="Username" />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" placeholder="New Password" />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};

export default SettingsForm;
