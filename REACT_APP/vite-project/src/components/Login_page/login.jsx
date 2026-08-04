import {
    useState, useEffect

} from "react";
import { Eye, EyeClosed, AlertCircle, CheckCircle, MoveLeft } from "lucide-react";
import { SyncLoader } from 'react-spinners';
import { useTheme } from "../../context/Themecontext/ThemeContext"
import { Link } from "react-router";
import { useNavigate } from "react-router";
import ThemeButton from "../../context/Themecontext/Themebutton"
import LogoImg from '../../assets/Logo_main.png';
import axios from 'axios'
import Cookies from 'js-cookie'
const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [error, showError] = useState("")
    const [success, setSuccess] = useState("")
    const { darkMode } = useTheme()
    let textTheme = darkMode ? 'text-white' : "text-black";
    let bgTheme = darkMode ? 'bg-black' : 'bg-gray-100';
    const navigate = useNavigate()

    const handleEmailChange = (e) => {
        const value = e.target.value;

        if (value.includes("@")) {
            showError("Don't include @gmail.com. It's added automatically.");
            return;
        }

        showError("");
        setEmail(value);
    };
    const finalEMail = `${email}@gmail.com`
    const oNLoginUser = async (event) => {
        event.preventDefault();
        let apiURl = "http://localhost:7000/api/auth/login-user";

        try {
            const res = await axios.post(apiURl, { email: finalEMail, password })

            Cookies.set('sylluIQTokens', res.data.token, { expires: 7 })
            setSuccess("Login Successful! Redirecting...")
            setTimeout(() => {
                navigate('/home', { replace: true })
            }, 2000)

        } catch (err) {
            if (err.response) {
                showError(err.response.data.message)
            } else {
                console.log("Error:", err.message)
            }
        }
    }
    return (
        <>
            <div className={`${textTheme} ${bgTheme} flex flex-col justify-center min-h-screen  w-full relative `}>
                <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300">
                    <button
                        className={`flex items-center gap-2 ${textTheme} border-2 px-4 p-2 rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 bg-transparent backdrop-blur-sm`}
                        onClick={() => navigate('/')}
                    >
                       <MoveLeft />
                        <span className="hidden sm:inline relative bottom-0.3">Back</span>
                    </button>
                    <ThemeButton />
                </nav>
                <div className="flex items-center justify-around p-4">
                     <div className="flex flex-col items-center gap-5">
                          <img src={LogoImg} alt="SyllabiQ Logo" className="h-160 w-full rounded-[3.5rem]" />
                          <h1 className="text-3xl text-center font-extrabold text-mono">Master Your Learning Journey</h1>
                          <p className="w-[600px] text-center text-gray-800/90 dark:text-gray-500/90">A refined educational tracker designed for students and educators who value progress, clarity, and academic rigor.</p>
                     </div>
                    <div className={`flex flex-col items-center ${darkMode ? 'border border-gray-700 bg-gray-900' : 'border border-gray-200 bg-white'} rounded-2xl shadow-xl w-full max-w-md  overflow-hidden`}>
                     

                        <div className="flex flex-col w-full p-8">
                            <h2 className={`text-2xl font-bold text-center mb-6 ${textTheme}`}>Welcome Back! 👋</h2>


                            <button
                                type="button"
                                onClick={() => {
                                    window.location.href = "http://localhost:7000/api/auth/github";
                                }}
                                className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg border transition-all duration-300
    ${darkMode
                                        ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                                        : "bg-white border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                <img
                                    src="https://img.icons8.com/ios-glyphs/90/github.png"
                                    alt="GitHub"
                                    className="w-6 h-6 rounded-full dark:bg-white p-0.5"
                                />

                                <span className="font-semibold">
                                    Continue with GitHub
                                </span>
                            </button>
                            <div className="flex items-center my-6">
                                <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>

                                <span className="mx-4 text-sm text-gray-500">
                                    OR
                                </span>

                                <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
                            </div>
                            <form onSubmit={oNLoginUser} >
                                <div className="flex flex-col gap-4">
                                    <div >
                                        <label className={`${textTheme} text-sm font-medium mb-1.5 block`}>Email address</label>
                                        <div className="flex border rounded-lg">
                                            <input
                                                onChange={handleEmailChange}
                                                value={email}
                                                className={`w-full rounded-lg px-4 py-2.5 focus:outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-600 focus:border-green-500' : 'bg-white border-gray-300'}`}

                                                placeholder="Enter your email"
                                            />
                                            <span className="bg-gray-100 px-4 py-2 rounded-r-lg text-gray-600">
                                                @gmail.com
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <label className={`${textTheme} text-sm font-medium mb-1.5 block`}>Password</label>
                                        <div className={`flex items-center border rounded-lg px-4 py-2.5 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all`}>
                                            <input
                                                type={showPass ? "text" : "password"}
                                                onChange={(e) => setPassword(e.target.value)}
                                                value={password}
                                                className={`w-full outline-none bg-transparent ${textTheme}`}

                                                placeholder="••••••••"
                                            />
                                            <div className={`w-px h-8 mx-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                                            <button
                                                type="button"
                                                onClick={() => setShowPass(!showPass)}
                                                className="text-gray-400 hover:text-green-500 transition"
                                            >
                                                {showPass ? <Eye size={18} /> : <EyeClosed size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm animate-pulse">
                                            <AlertCircle size={16} />
                                            <span className="font-bold">{error}</span>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="flex flex-col items-center justify-center gap-3 bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-lg text-sm transition-all duration-500">
                                            <SyncLoader color="#22c55e" size={8} />
                                            <span className="font-bold text-center">{success}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={success}
                                        className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${success
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/30"
                                            }`}
                                    >
                                        {success ? "Success!" : "Login"}
                                    </button>
                                    <p className={`text-xs text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Don't have an account? <Link to='/signUp' className="text-green-500 font-bold cursor-pointer hover:underline">Sign up</Link>
                                    </p>
                                </div>
                            </form>

                        </div>

                    </div>

                </div>
               
                  <div className="mt-30 relative top-20">
                     <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                     <div className={`flex items-center justify-between px-8 py-5 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        <h3 className="text-green-500 font-bold text-sm">Syllabi Q</h3>
                        <div className="flex items-center gap-8 text-sm">
                            <span>Privacy Policy</span>
                            <span>Terms of Service</span>
                            <span>Help Center</span>
                        </div>
                        <p className="text-sm">© 2024 Syllabi Q. All rights reserved.</p>
                     </div>
                  </div>
           
            </div>
            
        </>
    )
}

export default Login
