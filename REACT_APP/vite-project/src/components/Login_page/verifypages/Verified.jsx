import { CheckCircle2, ArrowRight } from "lucide-react"
import { Link, useLocation, Navigate } from "react-router"
import ThemeButton from "../../../context/Themecontext/Themebutton"
import { useTheme } from "../../../context/Themecontext/ThemeContext"

const Verified = () => {
    const { darkMode } = useTheme();
    const location = useLocation();

    // Protect route: Redirect to login if accessed directly without successful verification state
    if (!location.state?.fromVerification) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-[#09090b]' : 'bg-gray-50'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
            <div className="absolute top-10 right-0 p-10">
                <ThemeButton />
            </div>
            <div className={`relative w-full max-w-lg p-8 md:p-10 rounded-[2rem] shadow-2xl overflow-hidden ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-100'}`}>
                
                {/* Background ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none"></div>

                <div className="relative flex flex-col items-center text-center">
                    
                    {/* Glowing Success Icon Container */}
                    <div className="relative flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)] group">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse opacity-30"></div>
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 transition-transform duration-500 ease-out group-hover:scale-110" strokeWidth={1.5} />
                    </div>

                    <h2 className={`text-3xl font-extrabold tracking-tight mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Account Verified!
                    </h2>
                    
                    <p className={`text-base md:text-lg mb-8 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                        Great news! Your SyllabiQ account has been successfully verified. You can now access all features and explore the platform.
                    </p>

                    <Link 
                        to="/login"
                        className="group flex w-full items-center justify-center gap-3 px-6 py-4 font-semibold text-white transition-all bg-emerald-500 rounded-2xl hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Proceed to Login
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Verified