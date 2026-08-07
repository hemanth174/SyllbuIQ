import { useState } from "react";
import { Eye, EyeClosed, AlertCircle, MoveLeft } from "lucide-react";
import { FadeLoader } from "react-spinners";
import { useTheme } from "../../context/Themecontext/ThemeContext"
import { Link, useNavigate } from "react-router";
import ThemeButton from "../../context/Themecontext/Themebutton"
import LogoImg from '../../assets/Logo_main.png';
import axios from "axios";


const SignUp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [conformpass, setConFormPass] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")
    const { darkMode } = useTheme()
    let textTheme = darkMode ? 'text-white' : "text-black";
    let bgTheme = darkMode ? 'bg-black' : 'bg-gray-100';
    const navigate = useNavigate();
const finalEMail = `${email}@gmail.com`
    const oNSignInUser = async (event) => {
        event.preventDefault();
        let apiURl = "https://syllbuiq-production.up.railway.app/api/auth/add-user";

        try {
            const res = await axios.post(apiURl, { name, email:finalEMail, password, conformpass })
            setSuccess(res.data.message)
            
            // Save to local variables before resetting state
            const signedUpName = name;
            const signedUpEmail = email;

            setName('')
            setEmail('')
            setPassword('')
            setConFormPass('')

            // Wait 3 seconds to let the user read the success message, then navigate
            setTimeout(() => {
                navigate('/signUp/un-verify', { state: { name: signedUpName, email: signedUpEmail, fromSignup: true } })
            }, 3000);

        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Something went wrong";
            setError(msg);
        }

        setTimeout(() => {
            setSuccess('')
            setError('');
        }, 6000);

    }
    return (
        <>
            <div className={`${textTheme} ${bgTheme} flex min-h-screen w-full flex-col overflow-x-hidden`}>
                <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between px-4 py-4 transition-all duration-300 sm:px-6">
                    <button
                        className={`flex items-center gap-2 ${textTheme} border-2 px-4 p-2 rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 bg-transparent backdrop-blur-sm [&>span:first-of-type]:hidden`}
                        onClick={() => navigate('/')}
                    >
                        <span>👈</span>
                        <MoveLeft />
                        <span className="hidden sm:inline relative bottom-0.3">Back</span>
                    </button>
                    <ThemeButton />
                </nav>
                <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-10 px-4 pb-10 pt-28 sm:px-6 lg:flex-row lg:gap-16 lg:pt-24">
                    <div className="flex w-full max-w-xl flex-col items-center gap-4 text-center lg:items-start lg:text-left">
                        <img src={LogoImg} alt="SyllabiQ Logo" className="h-auto w-52 rounded-3xl sm:w-64" />
                        <h1 className="text-3xl font-extrabold sm:text-4xl">Master Your Learning Journey</h1>
                        <p className="max-w-xl text-sm leading-6 text-gray-800/90 dark:text-gray-500/90 sm:text-base">A refined educational tracker designed for students and educators who value progress, clarity, and academic rigor.</p>
                    </div>
                    <div className={`flex w-full max-w-md flex-col items-center overflow-hidden rounded-2xl shadow-xl ${darkMode ? 'border border-gray-700 bg-gray-900' : 'border border-gray-200 bg-white'}`}>
                    

                        <div className="flex flex-col w-full px-8 pb-8 pt-4">

                            <>
                                <h2 className={`text-2xl font-bold text-center mb-6 ${textTheme}`}>Create your Account</h2>
                                <form onSubmit={oNSignInUser} >
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className={`${textTheme} text-sm font-medium mb-1.5 block`}>Name</label>
                                            <input
                                                onChange={(e) => setName(e.target.value)}
                                                value={name}
                                                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${darkMode ? 'bg-gray-800 border-gray-600 focus:border-green-500' : 'bg-white border-gray-300'}`}
                                                type="name"
                                                placeholder="Enter your Name"
                                            />
                                        </div>
                                        <div>
                                            <label className={`${textTheme} text-sm font-medium mb-1.5 block`}>Email address</label>
                                            <div className="flex flex-col rounded-lg border sm:flex-row">
                                            <input
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                                className={`w-full rounded-lg px-4 py-2.5 focus:outline-none transition-all ${darkMode ? 'bg-gray-800 border-gray-600 focus:border-green-500' : 'bg-white border-gray-300'}`}

                                                placeholder="Enter your email"
                                            />
                                            <span className="rounded-b-lg bg-gray-100 px-4 py-2 text-gray-600 sm:rounded-b-none sm:rounded-r-lg">
                                                @gmail.com
                                            </span>
                                        </div>
                                        </div>
                                        <div className="mb-2">
                                            <label className={`${textTheme} text-sm font-medium mb-1.5 block`}>Password</label>
                                            <div className={`flex items-center border rounded-lg px-4 py-2.5 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all`}>
                                                <input
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    value={password}
                                                    className={`w-full outline-none bg-transparent ${textTheme}`}
                                                    type={showPass ? "text" : "password"}
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
                                        <div className="mb-2">
                                            <label className={`${textTheme} text-sm font-medium mb-1.5 block`}>Confirm Password</label>
                                            <div className={`flex items-center border rounded-lg px-4 py-2.5 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all`}>
                                                <input
                                                    onChange={(e) => setConFormPass(e.target.value)}
                                                    value={conformpass}
                                                    className={`w-full outline-none bg-transparent ${textTheme}`}
                                                    type={showConfirmPass ? "text" : "password"}
                                                    placeholder="••••••••"
                                                />
                                                <div className={`w-px h-8 mx-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                    className="text-gray-400 hover:text-green-500 transition"
                                                >
                                                    {showConfirmPass ? <Eye size={18} /> : <EyeClosed size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        {success && (
                                             <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/50 text-white-500 p-3 rounded-lg text-sm">
                                                <FadeLoader className="w-10" color="#ffffff" height={20} width={3} />
                                                <span className="font-bold">{success}</span>
                                            </div>
                                        )}
                                        {error && (
                                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm animate-pulse">
                                                <AlertCircle size={16} />
                                                <span className="font-bold">{error}</span>
                                            </div>
                                        )}

                                        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors duration-300 mt-2 shadow-lg shadow-green-500/20">
                                            Sign Up
                                        </button>

                                        <p className={`text-xs text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Already have an account? <Link to='/login' className="text-green-500 font-bold cursor-pointer hover:underline">Login</Link>
                                        </p>
                                    </div>
                                </form>
                            </>

                        </div>
                    </div>

                </div>
                <div className="w-full">
                    <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                    <div className={`flex flex-col items-center gap-3 px-4 py-5 text-center sm:px-8 md:flex-row md:justify-between md:text-left ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        <h3 className="text-green-500 font-bold text-sm">Syllabi Q</h3>
                        <div className="flex flex-wrap justify-center gap-4 text-sm sm:gap-8">
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

export default SignUp
