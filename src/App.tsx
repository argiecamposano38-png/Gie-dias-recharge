import { useState, useEffect } from "react";
import { 
  Gamepad2, 
  Diamond, 
  CreditCard, 
  Wallet, 
  CheckCircle2, 
  User, 
  Server, 
  Info, 
  ChevronRight, 
  ArrowLeft,
  History,
  ShieldCheck,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---
interface DiamondPackage {
  id: number;
  amount: number;
  price: number;
  bonus?: number;
}

interface Transaction {
  id: string;
  userId: string;
  serverId: string;
  diamonds: number;
  price: number;
  paymentMethod: string;
  timestamp: string;
  status: string;
}

// --- Data ---
const DIAMOND_PACKAGES: DiamondPackage[] = [
  { id: 1, amount: 86, price: 50 },
  { id: 2, amount: 172, price: 100, bonus: 5 },
  { id: 3, amount: 257, price: 150, bonus: 10 },
  { id: 4, amount: 344, price: 200, bonus: 15 },
  { id: 5, amount: 514, price: 300, bonus: 25 },
  { id: 6, amount: 706, price: 400, bonus: 40 },
];

const PAYMENT_METHODS = [
  { id: "gcash", name: "GCash", icon: Wallet, color: "bg-blue-500" },
  { id: "maya", name: "Maya", icon: Wallet, color: "bg-green-500" },
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, color: "bg-purple-500" },
];

export default function App() {
  const [view, setView] = useState<"home" | "topup" | "summary" | "confirmation" | "admin">("home");
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<DiamondPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  // Fetch transactions for admin panel
  useEffect(() => {
    if (view === "admin") {
      fetch("/api/transactions")
        .then((res) => res.json())
        .then((data) => setTransactions(data))
        .catch((err) => console.error("Error fetching transactions:", err));
    }
  }, [view]);

  const handleTopUp = async () => {
    if (!userId || !serverId || !selectedPackage || !paymentMethod) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          serverId,
          diamonds: selectedPackage.amount,
          price: selectedPackage.price,
          paymentMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLastTransaction(data);
        setTimeout(() => {
          setIsProcessing(false);
          setView("confirmation");
        }, 1500); // Mock processing delay
      }
    } catch (error) {
      console.error("Top-up failed:", error);
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setUserId("");
    setServerId("");
    setSelectedPackage(null);
    setPaymentMethod("");
    setView("home");
  };

  // --- Components ---

  const Header = () => (
    <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
      <div 
        className="flex items-center gap-2 cursor-pointer group" 
        onClick={() => setView("home")}
      >
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold font-display tracking-tight">MLBB <span className="text-blue-400">TopUp</span></span>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => setView("admin")}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="Admin Panel"
        >
          <LayoutDashboard className="w-5 h-5 text-white/70 hover:text-white" />
        </button>
      </div>
    </nav>
  );

  const HomeView = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center px-6 py-12 md:py-24"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
        <Zap className="w-4 h-4" />
        <span>Instant Diamond Delivery</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6">
        Level Up Your <br />
        <span className="gradient-text">Gaming Experience</span>
      </h1>
      <p className="text-white/60 text-lg max-w-2xl mb-10">
        The most reliable and fastest way to top up your Mobile Legends diamonds. 
        Secure payments, instant processing, and 24/7 support.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => setView("topup")}
          className="btn-primary flex items-center justify-center gap-2 px-10 py-4 text-lg"
        >
          Top Up Now <ChevronRight className="w-5 h-5" />
        </button>
        <button className="px-10 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-bold">
          View Promotions
        </button>
      </div>

      {/* Featured Packages */}
      <div className="mt-24 w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-8 text-left">Popular Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DIAMOND_PACKAGES.slice(0, 3).map((pkg) => (
            <div key={pkg.id} className="glass-card p-6 flex flex-col items-center text-center group hover:border-blue-500/50 transition-all">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Diamond className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{pkg.amount} Diamonds</h3>
              <p className="text-white/50 mb-4">₱{pkg.price.toFixed(2)}</p>
              <button 
                onClick={() => {
                  setSelectedPackage(pkg);
                  setView("topup");
                }}
                className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const TopUpView = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <button 
        onClick={() => setView("home")}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Account Info */}
          <section className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">1</div>
              <h2 className="text-xl font-bold">Account Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-white/50 flex items-center gap-2">
                  <User className="w-4 h-4" /> User ID
                </label>
                <input 
                  type="text" 
                  placeholder="Enter User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/50 flex items-center gap-2">
                  <Server className="w-4 h-4" /> Server ID
                </label>
                <input 
                  type="text" 
                  placeholder="Enter Server ID"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-white/60">
                To find your User ID and Server ID, tap on your avatar in the top-left corner of the main game screen. 
                Your User ID is displayed on the Profile page, e.g., 12345678 (1234). The number in parentheses is your Server ID.
              </p>
            </div>
          </section>

          {/* Step 2: Select Package */}
          <section className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">2</div>
              <h2 className="text-xl font-bold">Select Diamond Package</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {DIAMOND_PACKAGES.map((pkg) => (
                <button 
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative p-4 rounded-xl border transition-all flex flex-col items-center text-center ${
                    selectedPackage?.id === pkg.id 
                      ? "bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/10" 
                      : "bg-white/5 border-white/10 hover:border-white/30"
                  }`}
                >
                  <Diamond className={`w-6 h-6 mb-2 ${selectedPackage?.id === pkg.id ? "text-blue-400" : "text-white/30"}`} />
                  <span className="font-bold">{pkg.amount} Diamonds</span>
                  <span className="text-xs text-white/50">₱{pkg.price.toFixed(2)}</span>
                  {pkg.bonus && (
                    <span className="absolute -top-2 -right-2 bg-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      +{pkg.bonus} Bonus
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Step 3: Payment Method */}
          <section className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">3</div>
              <h2 className="text-xl font-bold">Payment Method</h2>
            </div>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <button 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${
                    paymentMethod === method.id 
                      ? "bg-white/10 border-white/40" 
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${method.color}`}>
                      <method.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">{method.name}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.id ? "border-blue-500 bg-blue-500" : "border-white/20"
                  }`}>
                    {paymentMethod === method.id && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-8 sticky top-8">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">User ID</span>
                <span className="font-medium">{userId || "---"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Server ID</span>
                <span className="font-medium">{serverId || "---"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Item</span>
                <span className="font-medium">{selectedPackage ? `${selectedPackage.amount} Diamonds` : "---"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Payment</span>
                <span className="font-medium capitalize">{paymentMethod || "---"}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-white/50">Total Price</span>
                <span className="text-2xl font-bold text-blue-400">₱{selectedPackage ? selectedPackage.price.toFixed(2) : "0.00"}</span>
              </div>
            </div>
            <button 
              disabled={!userId || !serverId || !selectedPackage || !paymentMethod || isProcessing}
              onClick={handleTopUp}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>Checkout Now</>
              )}
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-white/30 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Secure Transaction
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ConfirmationView = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto px-6 py-24 text-center"
    >
      <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Top-Up Successful!</h1>
      <p className="text-white/60 mb-8">
        Your diamonds have been sent to User ID <span className="text-white font-bold">{lastTransaction?.userId}</span>. 
        Please check your in-game mailbox.
      </p>
      
      <div className="glass-card p-6 text-left mb-8 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Transaction ID</span>
          <span className="font-mono text-xs">{lastTransaction?.id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Diamonds</span>
          <span className="font-bold">{lastTransaction?.diamonds}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Amount Paid</span>
          <span className="text-blue-400 font-bold">₱{lastTransaction?.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Date</span>
          <span>{lastTransaction && new Date(lastTransaction.timestamp).toLocaleString()}</span>
        </div>
      </div>

      <button 
        onClick={resetForm}
        className="btn-primary w-full"
      >
        Done
      </button>
    </motion.div>
  );

  const AdminView = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-6 py-12"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView("home")}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <History className="w-4 h-4" />
          <span>{transactions.length} Total Transactions</span>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">User (Server)</th>
                <th className="px-6 py-4 font-medium">Diamonds</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-white/30">
                    No transactions found yet.
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{txn.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{txn.userId}</div>
                      <div className="text-xs text-white/50">Server: {txn.serverId}</div>
                    </td>
                    <td className="px-6 py-4 font-bold">{txn.diamonds}</td>
                    <td className="px-6 py-4 text-blue-400">₱{txn.price.toFixed(2)}</td>
                    <td className="px-6 py-4 capitalize">{txn.paymentMethod}</td>
                    <td className="px-6 py-4 text-xs text-white/50">
                      {new Date(txn.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === "home" && <HomeView key="home" />}
          {view === "topup" && <TopUpView key="topup" />}
          {view === "confirmation" && <ConfirmationView key="confirmation" />}
          {view === "admin" && <AdminView key="admin" />}
        </AnimatePresence>
      </main>

      <footer className="p-12 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="font-bold font-display">MLBB TopUp</span>
          </div>
          <p className="text-white/30 text-sm mb-6">
            © 2026 MLBB TopUp. All rights reserved. <br />
            This is a mock application for demonstration purposes.
          </p>
          <div className="flex justify-center gap-6 text-white/50 text-xs">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
