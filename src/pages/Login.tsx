import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LayoutGrid } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16">
        {/* Logo Section */}
        <div className="flex items-center gap-2 mb-20 lg:mb-32">
          <div className="bg-[#6d4f9b] p-1.5 rounded-lg">
            <LayoutGrid className="w-6 h-6 text-white" fill="white" />
          </div>
          <span className="text-xl font-serif font-bold text-slate-800 tracking-tight">TheCubeFactory</span>
        </div>

        {/* Login Form Section */}
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-500 font-medium">Please enter your details</p>
          </div>

          {error && <div className="mb-6 text-red-500 text-sm bg-red-50 p-4 rounded-xl border border-red-100 flex items-center shadow-sm">
            <span className="mr-2">⚠️</span>{error}
          </div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6d4f9b] focus:border-transparent transition-all shadow-sm"
                placeholder="olivia@untitledui.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6d4f9b] focus:border-transparent transition-all shadow-sm"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#6d4f9b] border-slate-300 rounded focus:ring-[#6d4f9b]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-700">
                  Remember for 30 days
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-[#6d4f9b] hover:text-[#5a3f7f] border-b border-[#6d4f9b]">
                  Forgot password
                </a>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#6d4f9b] text-white font-bold rounded-xl hover:bg-[#5a3f7f] shadow-lg shadow-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6d4f9b] transition-all disabled:opacity-50"
              >
                {loading ? 'Sign in...' : 'Sign in'}
              </button>

              <button
                type="button"
                className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 flex items-center justify-center transition-all shadow-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-3" alt="Google" />
                Sign in with Google
              </button>
            </div>

            <div className="text-center pt-6">
              <p className="text-sm text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-[#6d4f9b] hover:text-[#5a3f7f]">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side: Illustration Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#9d89e2] items-center justify-center relative overflow-hidden">
        {/* Background Doodle Icons Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Row 1 */}
            <circle cx="100" cy="100" r="15" stroke="white" strokeWidth="1.5" />
            <path d="M250 80 L270 100 M270 80 L250 100" stroke="white" strokeWidth="1.5" />
            <rect x="400" y="70" width="30" height="30" rx="4" stroke="white" strokeWidth="1.5" transform="rotate(15 415 85)" />
            <path d="M550 90 Q570 70 590 90 T630 90" stroke="white" strokeWidth="1.5" />
            <circle cx="700" cy="120" r="10" stroke="white" strokeWidth="1.5" />
            
            {/* Row 2 */}
            <rect x="80" y="250" width="40" height="25" rx="2" stroke="white" strokeWidth="1.5" />
            <circle cx="220" cy="230" r="12" stroke="white" strokeWidth="1.5" />
            <path d="M380 260 L420 260 M400 240 L400 280" stroke="white" strokeWidth="1.5" />
            <path d="M580 250 A20 20 0 1 1 620 250" stroke="white" strokeWidth="1.5" />
            <rect x="720" y="270" width="20" height="20" stroke="white" strokeWidth="1.5" transform="rotate(45 730 280)" />
            
            {/* Row 3 */}
            <path d="M120 450 L150 480" stroke="white" strokeWidth="1.5" />
            <circle cx="280" cy="500" r="25" stroke="white" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="450" y="480" width="50" height="10" rx="5" stroke="white" strokeWidth="1.5" />
            <path d="M620 460 Q640 490 660 460" stroke="white" strokeWidth="1.5" />
            
            {/* Row 4 */}
            <circle cx="150" cy="650" r="8" stroke="white" strokeWidth="1.5" />
            <path d="M320 680 H360" stroke="white" strokeWidth="1.5" />
            <rect x="520" y="660" width="25" height="25" rx="12" stroke="white" strokeWidth="1.5" />
            <circle cx="680" cy="640" r="18" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-lg px-8 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[480px]">
             {/* Character Illustration SVG */}
             <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
               {/* Decorative Halo */}
               <circle cx="250" cy="250" r="180" stroke="white" strokeOpacity="0.2" strokeWidth="2" strokeDasharray="10 10" />
               <circle cx="250" cy="250" r="210" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
               
               {/* Main Monitor/Container Shape */}
               <rect x="110" y="140" width="280" height="200" rx="20" fill="black" fillOpacity="0.8" />
               <rect x="220" y="340" width="60" height="40" fill="black" fillOpacity="0.8" />
               <rect x="180" y="380" width="140" height="10" rx="5" fill="black" fillOpacity="0.8" />

               {/* Character Body (Overlapping from Monitor) */}
               <path d="M180 340C180 340 200 240 250 240C300 240 320 340 320 340V420H180V340Z" fill="#5843a0" />
               
               {/* Character Head */}
               <circle cx="250" cy="210" r="40" fill="white" />
               {/* Hair */}
               <path d="M210 210C210 170 240 150 250 150C260 150 290 170 290 210V230C290 230 270 250 250 250C230 250 210 230 210 230V210Z" fill="#0f172a" />
               <circle cx="220" cy="220" r="15" fill="#0f172a" />
               <circle cx="280" cy="220" r="15" fill="#0f172a" />
               
               {/* Face */}
               <circle cx="250" cy="215" r="32" fill="white" />
               
               {/* Headset */}
               <path d="M285 210C285 210 295 210 295 225C295 240 280 245 270 245" stroke="#0f172a" strokeWidth="3" fill="none" />
               <circle cx="282" cy="215" r="5" fill="#0f172a" />

               {/* Hand gesture */}
               <path d="M130 350C130 350 135 280 150 280C165 280 170 350 170 350" stroke="white" strokeWidth="12" strokeLinecap="round" opacity="0.9" />
               <circle cx="150" cy="285" r="12" fill="white" opacity="0.9" />
               <path d="M140 275L130 240M150 270L150 230M160 275L175 245" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
             </svg>
          </div>
          
          <div className="mt-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Streamline Your Research</h2>
            <p className="text-violet-100 text-lg opacity-80 max-w-sm">Manage equipment, log usage, and collaborate with your lab team in one powerful platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
