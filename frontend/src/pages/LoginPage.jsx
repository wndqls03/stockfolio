import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(event) => {
        event.preventDefault();
        setError('');
        try{
            await login(email, password);
            navigate('/');
        } catch(err){
            setError('Login failed. Please check your email and password.');
        }
    };
    return (
        <div className="min-h-screen bg-ink-bg text-ink flex items-center">
            <div className="w-full max-w-md mx-auto px-6">
                <span className="block text-center font-extrabold text-xl mb-9">StockFolio</span>
                <form onSubmit={handleSubmit} className="bg-ink-surface border border-ink-border rounded-2xl px-8 py-10">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-7">Log In</h1>

                    {/* Nothing renders when error is an empty string — JS short-circuit rendering with && */}
                    {error && <p className="text-ink-sell text-sm mb-4">{error}</p>}

                    <label className="block mb-5">
                        <span className="block text-sm font-semibold text-ink-muted mb-2">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-ink-border rounded-lg px-4 py-3.5 text-base bg-ink-surface-2 text-ink"
                        />
                    </label>

                    <label className="block mb-7">
                        <span className="block text-sm font-semibold text-ink-muted mb-2">Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-ink-border rounded-lg px-4 py-3.5 text-base bg-ink-surface-2 text-ink"
                        />
                    </label>

                    <button type="submit" className="w-full bg-ink text-ink-bg py-4 rounded-xl font-bold text-base mb-5">
                        Log In
                    </button>

                    <p className="text-sm text-center text-ink-muted">
                        Don't have an account? <Link to="/register" className="text-ink-accent-strong font-bold no-underline">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
