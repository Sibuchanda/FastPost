"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, UserCircle } from "lucide-react";
import { useAppData, user_service } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Loading from "../verify/Loading";

const ProfilePage = () => {
  const { user, isAuth, loading, setUser, logoutUser } = useAppData();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string | undefined>("");
  const navigate = useNavigate();

  const editHandler = () => {
    setIsEdit(!isEdit);
    setName(user?.name);
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const token = Cookies.get("token");
    try {
      const { data } = await axios.post(
        `${user_service}/api/v1/update/user`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });

      toast.success(data.message);
      setUser(data.user);
      setIsEdit(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!isAuth && !loading) {
      navigate("/login");
    }
  }, [isAuth, navigate, loading]);

  // -- Logout Function --
  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  if (loading) return <Loading />;
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm sticky top-0">
        <button
          onClick={() => navigate("/chat")}
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Profile</h1>
        <div className="w-5" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center mt-8 mb-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
              <UserCircle className="w-16 h-16 text-gray-500" />
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-800">
            {user?.name || "User"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">Active now</p>
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-xl shadow-sm mx-4 overflow-hidden border border-gray-200">
          {/* Display Name */}
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-gray-500">Display Name</p>
                {isEdit ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {user?.name || "Not set"}
                  </p>
                )}
              </div>
              {isEdit ? (
                <div className="flex gap-2">
                  <button
                    onClick={submitHandler}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={editHandler}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={editHandler}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800 font-medium">{user?.email || "—"}</p>
          </div>

          {/* About */}
          <div className="p-4">
            <p className="text-sm text-gray-500">About</p>
            <p className="text-gray-800 font-medium">Available</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-4 mt-8 mb-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 text-center text-red-600 border border-red-200 rounded-lg font-semibold hover:bg-red-100 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
