import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Cookies from "js-cookie";

const GithubSuccess = () => {

    const [params] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {

        const token = params.get("token");

        if (token) {

            Cookies.set("sylluIQTokens", token, {
                expires: 7,
            });

            navigate("/home");

        } else {
            navigate("/login");
        }

    }, []);

    return <h2>Logging in...</h2>;
};

export default GithubSuccess;