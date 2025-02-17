import { options } from "@/app/api/auth/[...nextauth]/options";
import Title from "@/components/Title";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await getServerSession(options);

  // Redirect if there is no session or if the user's role is not admin
  if (!session || session.user?.role !== "admin") {
    redirect("/signin");
  }

  return (
    <div className="">
      <Title
        title="Dashboard"
        subtitle="Here is where you can manage your settings and view insights."
      />

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
