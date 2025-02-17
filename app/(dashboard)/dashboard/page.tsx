import { options } from "@/app/api/auth/[...nextauth]/options";
import Title from "@/components/Title";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await getServerSession(options);

  console.log("Session", session?.user?.company);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="">
      <Title
        title="Dashboard"
        subtitle="Here is where you can manage your settings and view insights."
      />

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
