"use client";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
      <p className="text-gray-600">
        Here is where you can manage your settings and view insights.
      </p>

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
