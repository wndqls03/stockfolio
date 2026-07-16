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
    <div className="min-h-screen bg-ink-bg text-ink">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="flex justify-between items-center mb-10">
          <span className="font-extrabold text-xl">StockFolio</span>
          <div className="flex gap-6 text-base">
            <Link to="/trade" className="text-ink-accent-strong font-semibold no-underline">Trade</Link>
            <Link to="/history" className="text-ink-accent-strong font-semibold no-underline">History</Link>
            <button onClick={handleLogout} className="text-ink-sell font-semibold bg-transparent border-none p-0 cursor-pointer">Log Out</button>
          </div>
        </div>

        <div className="pt-2 pb-9 border-b border-ink-border mb-8">
          <p className="font-mono text-xs tracking-wider uppercase text-ink-muted mb-2">Total Assets</p>
          <p className="font-mono text-6xl font-extrabold tracking-tight mb-4">
            ${ summary?.totalAssets}
          </p>
          <div className="flex gap-8 text-base">
            <span>Cash <b className="font-mono font-semibold text-ink">${ summary?.cashBalance }</b></span>
            <span className={summary?.totalReturnPercent >= 0 ? 'text-ink-buy' : 'text-ink-sell'}>Return <b className={`font-mono font-semibold ${summary?.totalReturnPercent >= 0 ? 'text-ink-buy' : 'text-ink-sell'}`}>{summary?.totalReturnPercent >= 0 ? '+' : ''}{summary?.totalReturnPercent?.toFixed(2)}%</b></span>
          </div>
        </div>

        <p className="font-mono text-xs tracking-wider uppercase text-ink-muted mb-1.5">Holdings</p>
        <p className="text-sm text-ink-muted mb-5">Prices delayed ~20 min, not real-time</p>

        <div className="border border-ink-border rounded-2xl overflow-hidden">
          { holdings.map((h) => (
            <div key={h.symbol} className="px-6 py-5 border-b border-ink-border last:border-b-0 flex justify-between items-center">
              <div>
                <div className="font-bold text-lg">{h.symbol}</div>
                <div className="font-mono text-sm text-ink-muted mt-1">{h.quantity} sh @ ${h.avgBuyPrice} &rarr; ${h.currentPrice}</div>
              </div>
              <span className={`font-mono text-lg font-semibold ${h.unrealizedPL >= 0 ? 'text-ink-buy' : 'text-ink-sell'}`}>
                {h.unrealizedPL >= 0 ? '+' : ''}${h.unrealizedPL} ({h.unrealizedPLPercent.toFixed(2)}%)
              </span>
            </div>
          )) }
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
