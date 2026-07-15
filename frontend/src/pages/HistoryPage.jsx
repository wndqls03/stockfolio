import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

function HistoryPage() {
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        api.get('/transactions').then((res)=> setTransactions(res.data));
    }, []);

    return (
        <div className="min-h-screen bg-ink-bg text-ink">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <Link to="/dashboard" className="text-sm text-ink-muted font-semibold no-underline">&larr; Dashboard</Link>
                <h1 className="text-4xl font-extrabold tracking-tight mt-4 mb-7">Transaction History</h1>

                <div className="border border-ink-border rounded-2xl overflow-hidden">
                    {transactions.map((t) => (
                        <div key={t.id} className="px-6 py-5 border-b border-ink-border last:border-b-0 flex justify-between items-start">
                            <div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full font-mono text-xs font-bold tracking-wide ${t.type === 'BUY' ? 'bg-ink-buy-soft text-ink-buy' : 'bg-ink-sell-soft text-ink-sell'}`}>
                                    {t.type}
                                </span>
                                <div className="font-mono text-sm text-ink-muted mt-2">{t.quantity} sh @ ${t.price}</div>
                                <div className="text-sm text-ink-muted mt-1">{new Date(t.createdAt).toLocaleString()}</div>
                            </div>
                            <span className="font-bold text-lg">{t.symbol}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}
export default HistoryPage;
