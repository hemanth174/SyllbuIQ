import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';

const VerifyEmail = () => {
    const { id, token } = useParams();
    const [status, setStatus] = useState('verifying');
    const navigate = useNavigate();

    useEffect(() => {
        let isSubscribed = true;
        const verify = async () => {
            try {
                const response = await axios.get(`http://localhost:7000/api/auth/verify/${id}/${token}`);
                
                if (isSubscribed) {
                    setStatus('success');
                    setTimeout(() => {
                        navigate('/signUp/verify', { state: { fromVerification: true } });
                    }, 1500);
                }
            } catch (error) { 
                if (isSubscribed) {
                    setStatus('error');
                    // We removed the redirect to `/signUp/un-verify` here so the user
                    // can actually see the "Verification Failed" message.
                }
            }
        };

        if (id && token) {
            verify();
        }

        return () => { isSubscribed = false; };
    }, [id, token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white p-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl text-center max-w-md w-full shadow-2xl">
                {status === 'verifying' && (
                    <div className="w-16 h-16 border-4 border-white/10 border-t-green-500 rounded-full animate-spin mx-auto mb-6" />
                )}
                {status === 'error' && (
                    <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                        !
                    </div>
                )}
                <h2 className="text-2xl font-bold mb-4">
                    {status === 'verifying' ? 'Verifying Account...' : 
                     status === 'success' ? 'Verified Successfully!' : 'Verification Failed'}
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    {status === 'verifying' ? "Please wait while we secure your account..." : 
                     status === 'success' ? "Redirecting you shortly..." : 
                     "This verification link is invalid or has expired."}
                </p>
                {status === 'error' && (
                    <button 
                        onClick={() => navigate('/login')}
                        className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all duration-300"
                    >
                        Back to Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
