import React from "react";
import { Menu } from "lucide-react";

const Topbar = ({ toggleSidebar }) => {
    return (
        <div className="h-16 bg-white shadow flex items-center justify-between px-4">
            <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-100">
                <Menu />
            </button>
            <div className="font-semibold">Admin Dashboard</div>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300" />
            </div>
        </div>
    );
};

export default Topbar;
