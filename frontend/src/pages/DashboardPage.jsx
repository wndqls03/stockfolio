import { useEffect, useState} from "react"
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';


function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/portfolio/summary').then((res)=> setSummary(res.data));
    api.get('/portfolio').then((res)=> setHoldings(res.data));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  }

  return(
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex gap-4">
            <Link to="/trade" className="text-blue-600">Trade</Link>
            <button onClick={handleLogout} className="text-red-600">Logout</button>
          </div>
        </div>

        <div>
          <p className="text-gray-600 text-sm">Total Assets</p>
          <p className="text-2xl font-bold text-gray-900">
            ${ summary?.totalAssets}
          </p>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Cash: ${ summary?.cashBalance }</span>
            <span>Return: {summary?.totalReturnPercent}%</span>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 p-4 border-b">Holdings</h2>
          <p className="text-xs text-gray-500 px-4 pt-2">Prices delayed ~20 min, not real-time</p>

          <ul>
            { holdings.map((h) => (
              <li key={h.symbol} className="p-4 border-b text-gray-900">
                <div className="flex justify-between">
                  <span>{h.symbol}</span>
                  <span className={h.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {h.unrealizedPL >= 0 ? '+' : ''}${h.unrealizedPL} ({h.unrealizedPLPercent}%)
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {h.quantity} shares @ ${h.avgBuyPrice} (now ${h.currentPrice})
                </div>
              </li>
            )) }
          </ul>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
