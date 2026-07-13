import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function HomePage() {
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">StockFolio</h1>
                <p className="text-gray-600 mb-8">
                    Practice trading with a virtual $100,000 — real market prices, zero real risk.
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        to="/login"
                        className="w-full bg-blue-600 text-white py-3 rounded font-medium"
                    >
                        Log In
                    </Link>
                    <Link
                        to="/register"
                        className="w-full border border-blue-600 text-blue-600 py-3 rounded font-medium"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
