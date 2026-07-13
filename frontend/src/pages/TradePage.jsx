import { useState} from "react";
import { Link } from "react-router-dom";

import api from "../lib/api";

function TradePage() {
    const [query, setQuery] = useState('');
    const [ results, setResults] = useState([]);

    const [selectedResult, setSelectedResult] = useState('');
    const [quote, setQuote] = useState(null);

    const [quantity, setQuantity] = useState(0);
    const [message, setMessage] = useState('');

    const handleSearch = async (event) => {
        event.preventDefault();
        const response = await api.get(`stocks/search?q=${query}`);
        setResults(response.data.result);
    };
    
    const handleSelectStock = async (symbol) => {
        setSelectedResult(symbol);
        const response = await api.get(`stocks/quote?symbol=${symbol}`);
        setQuote(response.data);
    };
    
    const handleTrade = async (type) => {
        setMessage('');
        try {
            await api.post(`transactions/${type}`, {
                symbol: selectedResult,
                quantity: Number(quantity),
            });
            setMessage(`${type === 'buy' ? 'Buy' : 'Sell'} order completed`);
        } catch (err) {
            // 백엔드가 { message: "..." } 형태로 에러를 주니까, 그걸 꺼내서 보여줌
            setMessage(err.response?.data?.message || 'Trade failed');
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-xl font-bold mb-4">Stock Trading</h1>
                <Link to="/dashboard" className="text-blue-600">Back to Dashboard</Link>

                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e)=>setQuery(e.target.value)}
                        placeholder="Search a symbol (e.g., AAPL)"
                        className = "flex-1 border rounded px-3 py-2 bg-white text-gray-900"
                        />
                    <button type="submit" className="bg-blue-600 text-white px-4 rounded">
                        Search
                    </button>
                </form>

                <ul className="mb-4">
                    {results.map((result) => (
                        <li key={result.symbol}>
                            <button
                                onClick={()=>handleSelectStock(result.symbol)}
                                className = "w-full text-left p-2 border-b hover:bg-gray-100 text-gray-900"
                            >
                            {result.symbol} - {result.description}
                            </button>
                        </li>
                    ))}
                </ul>
                {quote && (
          <div className="bg-white p-4 rounded shadow text-gray-900">
            <p className="font-bold text-gray-900">{selectedResult}</p>
            <p className="text-gray-900">Current price: ${quote.currentPrice}</p>
            <p className="text-xs text-gray-500">Delayed ~20 min</p>


            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              className="w-full border rounded px-3 py-2 mt-2 bg-white text-gray-900"
            />

            <div className="flex gap-2 mt-2">
              <button onClick={() => handleTrade('buy')} className="flex-1 bg-green-600 text-white py-2 rounded">
                Buy
              </button>
              <button onClick={() => handleTrade('sell')} className="flex-1 bg-red-600 text-white py-2 rounded">
                Sell
              </button>
            </div>
          </div>
        )}

        {message && <p className="mt-4 text-center text-gray-900">{message}</p>}
            </div>
        </div>
    )}

export default TradePage;