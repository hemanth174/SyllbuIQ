import { Outlet, Link, useLocation, useNavigate } from "react-router";
import LogoImg from "../../assets/Logo_main.png";
import data from "./headsidebarsFolder/sidebar";
import Cookies from "js-cookie";
import { useUser } from "../../context/userContext/userContext";
import ThemeButton from "../../context/Themecontext/Themebutton";
import { useTheme } from "../../context/Themecontext/ThemeContext";
import { useState } from "react";
import SearchModal from "@/components/ui/search-modal";
import { Search } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();
    const { darkMode } = useTheme();
    const [searchOpen, setSearchOpen] = useState(false);
    const textTheme = darkMode ? "text-white" : "text-black";
    const bgTheme = darkMode ? "bg-black" : "bg-white";
    const borderTheme = darkMode ? "border-gray-700" : "border-gray-200";
    const hoverTheme = darkMode
        ? "hover:bg-[#1D9E75]/20 hover:border-[#1D9E75]"
        : "hover:bg-[#1D9E75]/10 hover:border-[#1D9E75]";

    const logout = () => {
        Cookies.remove("sylluIQTokens");
        navigate("/login");
    };

    const currentPath = data.find(
        (item) => item.path && location.pathname.endsWith(item.path)
    );

    return (
        <div className={`h-screen flex ${darkMode ? "bg-gray-950" : "bg-gray-100"}`}>
            <aside className={`w-[240px] ${bgTheme} border-r ${borderTheme} shadow-md`}>
                <div className={`h-16 border-b ${borderTheme} flex items-center justify-center ${bgTheme}`}>
                    <img src={LogoImg} alt="Logo" className="h-[60px] w-full object-contain p-2" />
                </div>

                <div className="flex flex-col justify-between h-[calc(100vh-64px)]">
                    <div className="py-3">
                        {data.map((val, index) => {
                            const isActive = location.pathname.endsWith(val.path);

                            return (
                                val.ItemName !== "Profile" &&
                                val.ItemName !== "Settings" && (
                                    <div key={index} className="px-3 py-2">
                                        <Link to={val.path}>
                                            <div
                                                className={`
                                                            relative rounded-l-2xl
                                                            border border-[#2E3844]
                                                            px-4 py-4
                                                            flex items-center gap-4
                                                            transition-all duration-300
                                                            ${isActive
                                                        ? "bg-[#12181F] shadow-[0_0_20px_rgba(36,211,155,0.15)]"
                                                        : "hover:bg-[#12181F]"
                                                    }
                                                            `}
                                            >
                                                {isActive && (
                                                    <div
                                                        className="absolute
                                                                right-0
                                                                    top-1/2
                                                                    -translate-y-1/2
                                                                    h-[95%]
                                                                    w-[5px]
                                                                    rounded-l-full
                                                                    bg-[#22E5A1]
                                                                    shadow-[0_0_18px_#22E5A1]
                                                                    z-50
                                                                "
                                                    />
                                                )}

                                                <img
                                                    className="h-8 w-8 object-contain"
                                                    src={val.IconUrl}
                                                    alt={val.ItemName}
                                                />

                                                <h1
                                                    className={`text-base font-bold ${isActive ? "text-white" : textTheme
                                                        }`}
                                                >
                                                    {val.ItemName}
                                                </h1>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            );
                        })}
                    </div>

                    <div>
                        <div className={`border-t ${borderTheme}`} />

                        {data.map((val, index) => (
                            <div key={index} className="px-3 py-1">
                                {val.ItemName === "Profile" ? (
                                    <Link to={val.path}>
                                        <div className={`border ${borderTheme} p-4 transition-all ${hoverTheme}`}>
                                            <div className="flex items-center gap-4">
                                                {user?.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt=""
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <img src={val.IconUrl} className="w-10 h-10" alt="" />
                                                )}

                                                <div>
                                                    <h2 className={`font-bold font-mono text-lg ${textTheme}`}>
                                                        {user?.name?.toUpperCase()}
                                                    </h2>

                                                    <p className="text-[10px] text-gray-500 truncate w-40">
                                                        {user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ) : val.ItemName === "Settings" ? (
                                    <Link to={val.path}>
                                        <div className={`flex items-center gap-4 border ${borderTheme} px-4 py-3 transition-all ${hoverTheme}`}>
                                            <img src={val.IconUrl} className="w-8 h-8" alt="" />
                                            <h1 className={`font-bold ${textTheme}`}>
                                                {val.ItemName}
                                            </h1>
                                        </div>
                                    </Link>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className={`h-16 ${bgTheme} border-b ${borderTheme} shadow-sm flex justify-between items-center px-8`}>
                    <h1 className={`text-2xl font-mono font-bold ${textTheme}`}>
                        {currentPath?.ItemName}
                    </h1>

                    <div className="flex items-center gap-3">

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    className="group flex items-center justify-center
               h-11 w-11 rounded-full
               border border-gray-300
               hover:border-[#1D9E75]
               hover:bg-[#1D9E75]/10
               transition-all duration-300"
                                    onClick={() => setSearchOpen(true)}
                                >
                                    <Search
                                        size={19}
                                        className="group-hover:text-[#1D9E75]"
                                    />
                                </TooltipTrigger>

                                <TooltipContent>
                                    <p>Search (Ctrl + K)</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <ThemeButton />

                        <button
                            onClick={logout}
                            className="rounded-full border-2 border-gray-300 px-6 py-2"
                        >
                            Logout
                        </button>

                    </div>
                </header>

                <main className={`flex-1 overflow-y-auto ${darkMode ? "bg-gray-900" : "bg-gray-50"} p-8`}>
                    <SearchModal
                        modal
                        open={searchOpen}
                        onOpenChange={setSearchOpen}
                    />
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Home;