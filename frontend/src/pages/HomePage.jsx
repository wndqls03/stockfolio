import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function HomePage() {
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-ink-bg text-ink">
            <nav className="flex justify-between items-center max-w-3xl mx-auto px-6 py-8">
                <span className="font-extrabold text-xl tracking-tight">StockFolio</span>
                <div className="flex gap-6 text-base">
                    <Link to="/login" className="text-ink font-semibold no-underline">Log In</Link>
                    <Link to="/register" className="text-ink font-semibold no-underline">Sign Up</Link>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-6 pb-20">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-ink-accent-strong bg-blue-500/10 border border-blue-500/25 px-4 py-2 rounded-full">
                    Mock trading, real data
                </span>

                <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight mt-6 mb-5 text-balance">
                    Practice trading.<br />Zero real risk.
                </h1>
                <p className="text-ink text-lg leading-relaxed mb-10 max-w-xl">
                    Search real stocks, trade with a virtual $100,000, and track every position as prices move — no real money, ever.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-16">
                    <Link
                        to="/register"
                        className="block text-center py-4 px-8 rounded-xl font-bold text-base no-underline bg-ink text-ink-bg"
                    >
                        Sign Up — it's free
                    </Link>
                    <Link
                        to="/login"
                        className="block text-center py-4 px-8 rounded-xl font-bold text-base no-underline bg-transparent text-ink border-2 border-ink-border"
                    >
                        Log In
                    </Link>
                </div>

                <div className="bg-ink-surface border border-ink-border rounded-2xl p-8 mb-16 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]">
                    <p className="font-mono text-xs tracking-wider uppercase text-ink-muted mb-4">Your portfolio</p>
                    <p className="font-mono text-4xl font-extrabold mb-2">$100,231.84</p>
                    <p className="font-mono text-sm text-ink-buy mb-6">+0.23% today</p>
                    <div className="flex justify-between items-center py-4 border-t border-ink-border">
                        <span className="font-bold text-base">AAPL</span>
                        <span className="font-mono text-base text-ink-buy">+$46.20</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-t border-ink-border">
                        <span className="font-bold text-base">TSLA</span>
                        <span className="font-mono text-base text-ink-sell">-$12.40</span>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-16">
                    <div className="bg-ink-surface border border-ink-border rounded-2xl p-8">
                        <p className="font-mono text-xs tracking-wider uppercase text-ink-muted mb-4">Search a ticker</p>
                        <div className="flex items-center bg-ink-surface-2 border border-ink-border rounded-full px-5 py-3 mb-4">
                            <span className="font-mono text-base flex items-center">
                                <span className="demo-caret-text">AAPL</span>
                                <span className="demo-caret-bar inline-block w-[2px] h-5 bg-ink-accent-strong ml-0.5"></span>
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="demo-result flex justify-between items-baseline px-4 py-3 bg-ink-surface-2 rounded-lg">
                                <span className="font-bold text-sm">AAPL</span>
                                <span className="text-sm text-ink-muted">Apple Inc</span>
                            </div>
                            <div className="demo-result flex justify-between items-baseline px-4 py-3 bg-ink-surface-2 rounded-lg">
                                <span className="font-bold text-sm">AAPL.TO</span>
                                <span className="text-sm text-ink-muted">Apple Inc-CDR</span>
                            </div>
                            <div className="demo-result flex justify-between items-baseline px-4 py-3 bg-ink-surface-2 rounded-lg">
                                <span className="font-bold text-sm">AAPL.MX</span>
                                <span className="text-sm text-ink-muted">Apple Inc</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-ink-surface border border-ink-border rounded-2xl p-8">
                        <p className="font-mono text-xs tracking-wider uppercase text-ink-muted mb-4">Transaction history</p>
                        <div className="flex justify-between items-center py-4 border-t border-ink-border">
                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-ink-buy-soft text-ink-buy">BUY</span>
                                <div className="font-mono text-sm text-ink-muted mt-2">3 sh @ $315.32</div>
                            </div>
                            <span className="font-bold text-base">AAPL</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-t border-ink-border">
                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-ink-sell-soft text-ink-sell">SELL</span>
                                <div className="font-mono text-sm text-ink-muted mt-2">2 sh @ $407.76</div>
                            </div>
                            <span className="font-bold text-base">TSLA</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-t border-ink-border">
                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-ink-buy-soft text-ink-buy">BUY</span>
                                <div className="font-mono text-sm text-ink-muted mt-2">2 sh @ $407.76</div>
                            </div>
                            <span className="font-bold text-base">TSLA</span>
                        </div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-ink-surface border border-ink-border rounded-xl p-6">
                        <p className="font-mono text-xs text-ink-accent-strong font-bold mb-3">01</p>
                        <h3 className="text-lg font-bold mb-2">Search real stocks</h3>
                        <p className="text-sm text-ink-muted leading-relaxed">Look up any symbol and see current market prices, powered by live market data.</p>
                    </div>
                    <div className="bg-ink-surface border border-ink-border rounded-xl p-6">
                        <p className="font-mono text-xs text-ink-accent-strong font-bold mb-3">02</p>
                        <h3 className="text-lg font-bold mb-2">Trade with virtual cash</h3>
                        <p className="text-sm text-ink-muted leading-relaxed">Every account starts with $100,000 in play money. Buy and sell without risking a cent.</p>
                    </div>
                    <div className="bg-ink-surface border border-ink-border rounded-xl p-6">
                        <p className="font-mono text-xs text-ink-accent-strong font-bold mb-3">03</p>
                        <h3 className="text-lg font-bold mb-2">Track your portfolio</h3>
                        <p className="text-sm text-ink-muted leading-relaxed">Watch your holdings, gains, and losses update as the market moves.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
