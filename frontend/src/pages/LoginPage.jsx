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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4">Log In</h1>

        {/* Nothing renders when error is an empty string — JS short-circuit rendering with && */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <label className="block mb-3">
          <span className="text-sm text-gray-600">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 border rounded px-3 py-2 bg-white text-gray-900"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-gray-600">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 border rounded px-3 py-2 bg-white text-gray-900"
          />
        </label>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Log In
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600">Sign Up</Link>
        </p>
      </form>
    </div>
    );
}

export default LoginPage;