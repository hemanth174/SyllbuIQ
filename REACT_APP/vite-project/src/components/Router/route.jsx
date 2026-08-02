import { BrowserRouter, Route, Routes } from 'react-router'
import LadingPage from '../Landing_page/landing'
import Login from '../Login_page/login'
import SignUp from '../Login_page/signUp'
import Home from '../Home/home'
import SecurityRoute from '../SecurityRoute/index'
import PublicRoute from '../SecurityRoute/PublicRoute'
import VerifyEmail from '../userServices/verifyByEmailPage'
import Verified from '../Login_page/verifypages/Verified'
import Unverifired from '../Login_page/verifypages/UnVerified'
import GithubSuccess from '../Login_page/GithubSuccess'
const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Pages everyone can see */}
                <Route path="/" element={<LadingPage />} />

                {/* Pages ONLY Guest (logged-out) users can see */}
                <Route element={<PublicRoute />}>
                    <Route path="/api/auth/verify/:id/:token" element={<VerifyEmail />} />
                    <Route path="/signUp/un-verify" element={<Unverifired />} />
                    <Route path="/signUp/verify" element={<Verified />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signUp' element={<SignUp />} />
                    <Route
                        path="/github-success"
                        element={<GithubSuccess />}
                    />
                </Route>

                {/* Pages ONLY Logged-in users can see */}
                <Route element={<SecurityRoute />}>
                    <Route path='/home' element={<Home />} />
                </Route>

                <Route path='*' element={<>not found</>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router