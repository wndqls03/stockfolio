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
        <div className="min-h-screen bg-ink-bg text-ink">
            <div className="max-w-3xl mx-auto px-6 py-10">
                <Link to="/dashboard" className="text-sm text-ink-muted font-semibold no-underline">&larr; Dashboard</Link>
                <h1 className="text-4xl font-extrabold tracking-tight mt-4 mb-7">Trade</h1>

                <form onSubmit={handleSearch} className="flex items-center gap-2 bg-ink-surface border border-ink-border rounded-full pl-6 pr-2 py-2 mb-6">
                    <input
                        type="text"
                        value={query}
                        onChange={(e)=>setQuery(e.target.value)}
                        placeholder="Search a symbol (e.g., AAPL)"
                        className="flex-1 border-none bg-transparent outline-none text-ink text-base placeholder:text-ink-muted py-2"
                        />
                    <button type="submit" className="bg-ink text-ink-bg rounded-full px-7 py-3 font-bold text-base">
                        Search
                    </button>
                </form>

                {results.length > 0 && (
                    <div className="border border-ink-border rounded-2xl overflow-hidden mb-7">
                        {results.map((result) => (
                            <button
                                key={result.symbol}
                                onClick={()=>handleSelectStock(result.symbol)}
                                className="w-full text-left px-6 py-4 border-b border-ink-border last:border-b-0 flex justify-between items-baseline bg-transparent cursor-pointer"
                            >
                                <span className="font-bold text-base text-ink">{result.symbol}</span>
                                <span className="text-sm text-ink-muted">{result.description}</span>
                            </button>
                        ))}
                    </div>
                )}

                {quote && (
                    <div className="bg-ink-surface border border-ink-border rounded-2xl p-8">
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="font-extrabold text-2xl">{selectedResult}</span>
                            <span className="font-mono text-4xl font-extrabold">${quote.currentPrice}</span>
                        </div>
                        <p className="text-sm text-ink-muted mb-7">Delayed ~20 min</p>

                        <label className="block text-sm font-semibold text-ink-muted mb-2">Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full border border-ink-border rounded-lg px-4 py-3.5 text-base bg-ink-surface-2 text-ink mb-5"
                        />

                        <div className="flex gap-3">
                            <button onClick={() => handleTrade('buy')} className="flex-1 text-center py-4 rounded-xl font-bold text-base border-2 border-ink-buy bg-ink-buy-soft text-ink-buy">
                                Buy
                            </button>
                            <button onClick={() => handleTrade('sell')} className="flex-1 text-center py-4 rounded-xl font-bold text-base border-2 border-ink-sell bg-ink-sell-soft text-ink-sell">
                                Sell
                            </button>
                        </div>
                    </div>
                )}

                {message && <p className="mt-5 text-center text-base text-ink-muted">{message}</p>}
            </div>
        </div>
    );
}

export default TradePage;
