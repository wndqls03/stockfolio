import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';

function HistoryPage() {
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        api.get('/transactions').then((res)=> setTransactions(res.data));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h1>
                <Link to="/dashboard" className="text-blue-600">Back</Link>
                <ul className="bg-white rounded shadow">
                    {transactions.map((t) => (
                        <li key={t.id} className="p-4 border-b text-gray-900">
                            <div className="flex justify-between">
                                <span className={t.type === 'BUY' ? 'text-green-600' : 'text-red-600'}>
                                    {t.type}
                                </span>
                                <span>{t.symbol}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                {t.quantity} shares @ ${t.price}
                            </div>
                            <div className="text-xs text-gray-500">
                                {new Date(t.createdAt).toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

}
export default HistoryPage;