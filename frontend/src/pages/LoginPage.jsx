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
        <h1 className="text-xl font-bold mb-4">로그인</h1>

        {/* error가 빈 문자열이면 false 취급되어 아무것도 안 그림 — JS의 && 단축 렌더링 */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <label className="block mb-3">
          <span className="text-sm text-gray-600">이메일</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 border rounded px-3 py-2 bg-white text-gray-900"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-gray-600">비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 border rounded px-3 py-2 bg-white text-gray-900"
          />
        </label>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          로그인
        </button>

        <p className="text-sm text-center mt-4">
          계정이 없으신가요? <Link to="/register" className="text-blue-600">회원가입</Link>
        </p>
      </form>
    </div>
    );
}

export default LoginPage;