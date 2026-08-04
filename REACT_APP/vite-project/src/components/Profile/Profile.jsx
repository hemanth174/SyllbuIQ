import { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import axios from "axios";
import { FaUserCircle, FaGithub, FaCheckCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiShieldUserFill } from "react-icons/ri";


const Profile = () => {
    const [user, setUser] = useState({});
    useEffect(() => {
        const fetchProfile = async () => {

    const token = Cookies.get("sylluIQTokens");

    const res = await axios.get(
        "http://localhost:7000/api/user/profile",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    setUser(res.data);

};
    fetchProfile();
    
}, []);
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-8">

        <div className="flex items-center gap-6">

          {user.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="h-28 w-28 rounded-full object-cover border-4 border-[#1D9E75]"
            />
          ) : (
            <FaUserCircle className="text-[110px] text-gray-300" />
          )}

          <div>

            <h1 className="text-3xl font-bold">
              {user.name}
            </h1>

            <p className="text-gray-500 mt-1">
              {user.role}
            </p>

            <div className="flex gap-3 mt-4">

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {user.isVerified ? "Verified" : "Not Verified"}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.isActive
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Personal Information */}

      <div className="mt-8 bg-white rounded-2xl shadow-md">

        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-bold">
            Personal Information
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">

          <InfoCard
            icon={<FaUserCircle />}
            label="Name"
            value={user.name}
          />

          <InfoCard
            icon={<MdEmail />}
            label="Email"
            value={user.email}
          />

          <InfoCard
            icon={<RiShieldUserFill />}
            label="Role"
            value={user.role}
          />

          <InfoCard
            icon={<FaCheckCircle />}
            label="Joined"
            value={user.createdAt}
          />

        </div>

      </div>

      {/* Github */}

      <div className="mt-8 bg-white rounded-2xl shadow-md">

        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-bold">
            Github Account
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">

          <InfoCard
            icon={<FaGithub />}
            label="Github ID"
            value={user.githubId || "Not Connected"}
          />

          <InfoCard
            icon={<FaGithub />}
            label="Connection"
            value={user.githubId ? "Connected" : "Not Connected"}
          />

        </div>

      </div>

      {/* Buttons */}

      <div className="flex gap-4 justify-end mt-8">

        <button className="bg-[#1D9E75] hover:bg-[#178663] text-white px-6 py-3 rounded-xl font-semibold transition">
          Edit Profile
        </button>

        <button className="border border-gray-300 hover:border-red-500 hover:text-red-500 px-6 py-3 rounded-xl font-semibold transition">
          Change Password
        </button>

      </div>

    </div>
  );
};

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="border rounded-xl p-5">

      <div className="flex items-center gap-3 text-[#1D9E75] text-xl">
        {icon}

        <span className="font-semibold">
          {label}
        </span>
      </div>

      <p className="mt-3 text-lg text-gray-700">
        {value}
      </p>

    </div>
  );
};

export default Profile;