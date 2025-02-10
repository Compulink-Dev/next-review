import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

const Dashboard = async () => {
  const session = await getServerSession(options);

  console.log("Session", session?.user?.role);

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
      <p className="text-gray-600">
        Here is where you can manage your settings and view insights.
      </p>

      {session?.user?.role === "employee" && (
        <div className="mt-4 space-y-6">
          <div className="p-4 bg-white shadow-md rounded-lg">
            Employee Content Block 1 {session?.user?.name}
          </div>
        </div>
      )}

      {session?.user?.role === "client" && (
        <div className="mt-4 space-y-6">
          <div className="p-4 bg-white shadow-md rounded-lg">
            Client Content Block 1
          </div>
        </div>
      )}

      {/* Example Long Content for Scrolling */}
      <div className="mt-4 space-y-6">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="p-4 bg-white shadow-md rounded-lg">
            Content Block {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
