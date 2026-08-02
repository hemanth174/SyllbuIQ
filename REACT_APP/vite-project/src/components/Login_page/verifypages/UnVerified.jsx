import { AlertTriangle, Mail } from "lucide-react"
import ThemeButton from "../../../context/Themecontext/Themebutton"
import { useTheme } from "../../../context/Themecontext/ThemeContext"
import { useLocation, Navigate } from "react-router"

const UnVerified = () => {
    const { darkMode } = useTheme();
    const location = useLocation();

    // Protect route: Redirect to signup if accessed directly without state
    if (!location.state?.fromSignup) {
        return <Navigate to="/signUp" replace />;
    }

    const { name, email } = location.state;

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-[#09090b]' : 'bg-gray-50'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
            <div className="absolute top-10 right-0 p-10">
                <ThemeButton />
            </div>
            <div className={`relative w-full max-w-lg p-8 md:p-10 rounded-[2rem] shadow-2xl overflow-hidden ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-100'}`}>
                
                {/* Background ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none"></div>

                <div className="relative flex flex-col items-center text-center">
                    
                    {/* Pulsing Warning Icon Container */}
                    <div className="relative flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.15)] group">
                        <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping opacity-20"></div>
                        <AlertTriangle className="w-12 h-12 text-amber-500 transition-transform duration-500 ease-out group-hover:scale-110" strokeWidth={1.5} />
                    </div>

                    <h2 className={`text-3xl font-extrabold tracking-tight mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Account Unverified
                    </h2>
                    
                    <p className={`text-base md:text-lg mb-8 leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                        Hi <strong className={darkMode ? 'text-zinc-200' : 'text-gray-900'}>{name || 'User'}</strong>, your email address hasn't been verified yet. Please verify your email to unlock full access to your account.
                    </p>

                    <div className={`w-full p-4 mb-8 rounded-2xl flex items-center gap-4 text-left border ${darkMode ? 'bg-zinc-800/50 border-zinc-700/50' : 'bg-gray-50 border-gray-200'}`}>
                        <div className={`p-3 rounded-xl flex-shrink-0 ${darkMode ? 'bg-zinc-700' : 'bg-white shadow-sm'}`}>
                            <Mail className="w-6 h-6 text-amber-500" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Link sent to</p>
                            <p className={`text-base font-bold truncate ${darkMode ? 'text-zinc-200' : 'text-gray-900'}`}>{email || 'your-email@example.com'}</p>
                        </div>
                    </div>

                    <p className={`text-sm mb-2 ${darkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                        Didn't receive the email? Check your spam folder.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UnVerified