import { Navigate, Outlet } from "react-router";
import { useNavigate, Link, useLocation } from "react-router";
import LogoImg from "../../assets/Logo_main.png";
import data from "./headsidebarsFolder/sidebar";
import Cookies from "js-cookie";
import { FaUserCircle } from "react-icons/fa";
import { useUser } from "../../context/userContext/userContext";
const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();
    const logout = () => {
        Cookies.remove("sylluIQTokens");
        return navigate("/login");
    };

    const currentPath = data.find(
        (item) => item.path && location.pathname.endsWith(item.path)
    );

    return (
        <div className="h-screen flex bg-gray-100">

            <aside className="w-[240px] bg-white border-r border-gray-200 shadow-md">

                <div className="h-16 border-b border-gray-200 flex items-center justify-center bg-white">
                    <img
                        src={LogoImg}
                        alt="SyllabiQ Logo"
                        className="h-[60px] w-full object-contain p-2"
                    />
                </div>


                <div className="flex flex-col justify-between flex-1 h-[calc(100vh-64px)]">
                    <div className="py-3">
                        {data.map((val, index) => {
                            return (
                                <div key={index}>
                                    {val.ItemName === "Profile" || val.ItemName === "Settings" || (
                                        <div className="px-3 py-2">
                                            <Link to={val.path}>
                                                <div className="flex items-center gap-4 border border-gray-200 px-4 py-3 transition-all duration-300 hover:border-[#1D9E75] hover:bg-[#1D9E75]/10 hover:shadow-md cursor-pointer">

                                                    <img
                                                        className="h-8 w-8 object-contain"
                                                        src={val.IconUrl}
                                                        alt={val.ItemName}
                                                    />

                                                    <h1 className="text-base font-bold text-gray-700">
                                                        {val.ItemName}
                                                    </h1>

                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                    </div>

                    <div>
                        <div className="border-t border-black" />

                        {data.map((val, index) => (
                            <div key={index} className="px-3 p-1">
                                {val.ItemName === "Profile" ? (

                                    <Link to={val.path}>
                                        <div className="border border-gray-200 p-4 hover:border-[#1D9E75] hover:bg-[#1D9E75]/10 transition-all">

                                            <div className="flex items-center gap-4">

                                                {user?.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt=""
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <img src={val.IconUrl} className="text-5xl text-gray-300" />
                                                )}

                                                <div>

                                                    <h2 className="font-bold font-mono text-lg text-gray-800">
                                                        {user?.name.toUpperCase()}
                                                    </h2>

                                                    <p className="text-[10px] text-gray-500 truncate w-40">
                                                        {user?.email}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>
                                    </Link>

                                ) : (
                                    (val.ItemName === "Settings") && (

                                        <Link to={val.path}>
                                            <div className="flex items-center gap-4 border border-gray-200 px-4 py-3 hover:border-[#1D9E75] hover:bg-[#1D9E75]/10 transition">

                                                <img
                                                    src={val.IconUrl}
                                                    className="w-8 h-8"
                                                    alt=""
                                                />

                                                <h1 className="font-bold text-gray-700">
                                                    {val.ItemName}
                                                </h1>

                                            </div>
                                        </Link>

                                    )

                                )}

                            </div>
                        ))}
                    </div>

                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-8">

                    <h1 className="text-2xl font-mono font-bold text-gray-800">
                        {currentPath?.ItemName}
                    </h1>

                    <button
                        onClick={logout}
                        className="rounded-full border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-all duration-300 hover:border-red-500 hover:bg-red-50 hover:text-red-500"
                    >
                        Logout
                    </button>

                </header>
                <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default Home;