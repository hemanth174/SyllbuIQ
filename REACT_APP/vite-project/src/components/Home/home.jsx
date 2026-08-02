import { Navigate } from "react-router";
import { useNavigate } from "react-router";
import Cookies from 'js-cookie'
const Home = () => {
    const navigate = useNavigate();
    const logout = () => {
        const token = Cookies.remove('sylluIQTokens');
        return navigate('/login');
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold">Welcome Home! 👋</h1>
            <button className="border border-2 p-2" onClick={logout}>Logout</button>
        </div>
    )
}

export default Home;