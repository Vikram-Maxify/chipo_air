import React from "react";
import {
    Plane,
    Ticket,
    Users,
    IndianRupee
} from "lucide-react";

const stats = [
    {
        title: "Total Flights",
        value: "128",
        icon: Plane,
    },
    {
        title: "Bookings",
        value: "1,024",
        icon: Ticket,
    },
    {
        title: "Users",
        value: "540",
        icon: Users,
    },
    {
        title: "Revenue",
        value: "₹2.4L",
        icon: IndianRupee,
    },
];

const bookings = [
    {
        id: "#B001",
        user: "Rahul Sharma",
        flight: "Delhi → Mumbai",
        status: "Confirmed",
    },
    {
        id: "#B002",
        user: "Amit Verma",
        flight: "Delhi → Dubai",
        status: "Pending",
    },
    {
        id: "#B003",
        user: "Sneha Gupta",
        flight: "Delhi → Goa",
        status: "Cancelled",
    },
];

const Dashboard = () => {
    return (
        <div className="space-y-6">

            {/* Heading */}
            <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-2xl shadow flex items-center justify-between"
                        >
                            <div>
                                <p className="text-sm text-gray-500">{item.title}</p>
                                <h2 className="text-xl font-bold">{item.value}</h2>
                            </div>
                            <Icon className="text-gray-600" />
                        </div>
                    );
                })}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 text-sm border-b">
                                <th className="py-2">Booking ID</th>
                                <th>User</th>
                                <th>Flight</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookings.map((b, i) => (
                                <tr key={i} className="border-b text-sm">
                                    <td className="py-2">{b.id}</td>
                                    <td>{b.user}</td>
                                    <td>{b.flight}</td>
                                    <td>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${b.status === "Confirmed"
                                                    ? "bg-green-100 text-green-600"
                                                    : b.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {b.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;