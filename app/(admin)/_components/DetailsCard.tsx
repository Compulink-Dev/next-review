import { FC } from "react";

interface DetailsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const DetailsCard: FC<DetailsCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 text-color">
      <div className="flex items-center mb-2">
        {icon}
        <h4 className="ml-2">{title}</h4>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default DetailsCard;
