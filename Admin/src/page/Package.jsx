import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPackages, deletePackage } from "../reducer/slice/packageSlice";
import { Trash2 } from "lucide-react";
import AddPackageModal from "../Component/AddPackageModal"; 

const Package = () => {
    const dispatch = useDispatch();
    const { packages = [], loading } = useSelector((state) => state.package || {});
    const [open, setOpen] = useState(false);

    useEffect(() => {
        dispatch(getPackages());
    }, [dispatch]);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Packages</h1>

                <button
                    onClick={() => setOpen(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                    + Add Package
                </button>
            </div>

            {loading && <p>Loading...</p>}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div key={pkg._id} className="bg-white rounded-2xl shadow p-4">
                        <img
                            src={pkg.images?.[0]}
                            className="h-40 w-full object-cover rounded-lg"
                        />

                        <h2 className="font-semibold mt-2">{pkg.name}</h2>
                        <p className="text-sm text-gray-500">{pkg.description}</p>

                        <div className="flex justify-between mt-2">
                            <span>₹{pkg.price}</span>
                            <span>{pkg.duration}</span>
                        </div>

                        <button
                            onClick={() => dispatch(deletePackage(pkg._id))}
                            className="mt-3 text-red-500"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {open && <AddPackageModal close={() => setOpen(false)} />}
        </div>
    );
};

export default Package;