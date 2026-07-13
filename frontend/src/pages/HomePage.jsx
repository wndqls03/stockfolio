import {useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';

function HomePage() {
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);
    return (
        <div className="main">
            <h1>StockFolio</h1>
            <p>A mock stock trading portfolio app</p>
            <div className="Login">
                <Link to="/login" className="auth-link">Log In</Link>
            </div>
            <div className="Register">
                <Link to="/register" className="auth-link">Sign Up</Link>
            </div>
        </div>
    );
}
export default HomePage