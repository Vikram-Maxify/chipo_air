import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../reducer/slice/adminSlice"
import { Pencil, Trash2, Check, X } from "lucide-react";

const Users = () => {
  const dispatch = useDispatch();
  const { users = [], loading } = useSelector((state) => state.admin);

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleEdit = (user) => {
    setEditId(user._id);
    setForm({ name: user.name || "", email: user.email });
  };

  const handleUpdate = () => {
    dispatch(updateUser({ id: editId, data: form }));
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users Management</h1>
      </div>

      {/* Loading */}
      {loading && <p>Loading users...</p>}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (
              <tr key={user._id} className="border-t text-sm">

                {/* NAME */}
                <td className="p-4">
                  {editId === user._id ? (
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    user.firstname || user.lastname|| "-"
                  )}
                </td>

                {/* EMAIL */}
                <td>
                  {editId === user._id ? (
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    user.email
                  )}
                </td>

                {/* ROLE */}
                <td>{user.role}</td>

                {/* ACTIONS */}
                <td className="text-right pr-6">

                  {editId === user._id ? (
                    <div className="flex justify-end gap-2">

                      <button
                        onClick={handleUpdate}
                        className="p-2 bg-green-100 text-green-600 rounded"
                      >
                        <Check size={16} />
                      </button>

                      <button
                        onClick={() => setEditId(null)}
                        className="p-2 bg-gray-100 rounded"
                      >
                        <X size={16} />
                      </button>

                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  )}

                </td>
              </tr>
            ))}

          </tbody>
        </table>

      </div>

    </div>
  );
};

export default Users;