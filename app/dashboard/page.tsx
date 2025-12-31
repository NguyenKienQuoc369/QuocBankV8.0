'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { formatVND } from '@/lib/utils';
import { CreditCard, TrendingUp, Wallet, Send, Activity, Database, BarChart3, ArrowDownRight, ArrowUpRight, Eye, EyeOff, Clock, Zap, Shield, Settings, QrCode } from 'lucide-react';
import Link from 'next/link';
import { getDashboardData } from '@/actions/dashboard';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [activeChart, setActiveChart] = useState('trend');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardData();
        setData(result);
        setLoading(false);
        setTimeout(() => setAnimateStats(true), 200);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate stats - these must be calculated unconditionally
  const recentIncome = useMemo(() => {
    if (!data || !data.transactions) return 0;
    return data.transactions
      .filter((t: any) => t.toAccountId === data.account.id)
      .slice(0, 10)
      .reduce((sum: number, t: any) => sum + t.amount, 0);
  }, [data]);
  
  const recentExpense = useMemo(() => {
    if (!data || !data.transactions) return 0;
    return data.transactions
      .filter((t: any) => t.fromAccountId === data.account.id)
      .slice(0, 10)
      .reduce((sum: number, t: any) => sum + t.amount, 0);
  }, [data]);

  // Tính toán xu hướng cho chart - unconditional
  const trendData = useMemo(() => {
    if (!data || !data.transactions) return [];
    const grouped: any = {};
    data.transactions.forEach((t: any) => {
      const date = new Date(t.createdAt).toLocaleDateString('vi-VN', { month: '2-digit', day: '2-digit' });
      if (!grouped[date]) grouped[date] = { date, income: 0, expense: 0 };
      if (t.toAccountId === data.account.id) grouped[date].income += t.amount;
      else grouped[date].expense += t.amount;
    });
    return Object.values(grouped).slice(-7).reverse() as any[];
  }, [data]);

  // Phân loại giao dịch - unconditional
  const transactionStats = useMemo(() => {
    if (!data || !data.transactions) return [];
    const stats: any = {};
    data.transactions.slice(0, 20).forEach((t: any) => {
      const type = t.description || (t.toAccountId === data.account.id ? 'DEPOSIT' : 'WITHDRAWAL');
      stats[type] = (stats[type] || 0) + 1;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [data]);

  const totalTransactions = data?.transactions?.length || 0;
  const avgTransaction = totalTransactions > 0 ? Math.round((recentIncome + recentExpense) / totalTransactions) : 0;

  if (loading || !data) {
    return (
      <div className="space-y-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-2xl animate-pulse" />
          <div className="h-48 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-2xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if ('error' in data) return <div className="p-10 text-red-400 font-mono">{'>'} ERROR: {data.error}</div>;
  
  const { user, account, transactions } = data;

  return (
    <div className="space-y-8 pb-20">
      {/* === PREMIUM HEADER SECTION === */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
        
        <div className="relative border border-cyan-500/30 rounded-3xl p-8 bg-gradient-to-br from-black/60 via-black/50 to-cyan-500/5 backdrop-blur-xl overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Left: Welcome Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-7 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full animate-pulse" />
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 leading-tight" style={{
                    textShadow: '0 0 30px rgba(34, 211, 238, 0.3)'
                  }}>
                    COMMAND CENTER
                  </h1>
                  <p className="text-cyan-400/70 font-mono text-sm tracking-widest mt-2">NEURAL FINANCIAL NEXUS v8.0</p>
                </div>
              </div>
              <p className="text-gray-400 font-mono text-sm">Welcome Commander {user.fullName.split(' ').pop()?.toUpperCase() || 'OPERATOR'}</p>
            </div>

            {/* Right: Balance Display */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] group/eye"
              >
                {showBalance ? <Eye className="w-5 h-5 text-cyan-400 group-hover/eye:text-cyan-300" /> : <EyeOff className="w-5 h-5 text-cyan-400 group-hover/eye:text-cyan-300" />}
              </button>
              
              <div className="text-right">
                <div className="text-xs text-cyan-400/60 font-mono uppercase tracking-wider mb-1">Available Balance</div>
                <div className="text-3xl md:text-4xl font-black text-cyan-300 font-mono tracking-tight">
                  {showBalance ? formatVND(account.balance) : '●●●●●●●●'}
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent rounded-full mt-2 group-hover:from-cyan-300 transition-colors" />
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="relative mt-6 pt-6 border-t border-cyan-500/20 z-10 flex flex-wrap items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400">SYSTEMS OPERATIONAL</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-cyan-400">{totalTransactions} TRANSACTIONS</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-400">SECURITY: {account.card ? 'ACTIVE' : 'INACTIVE'}</span>
            </div>
            <div className="ml-auto hidden md:flex items-center gap-1.5">
              <span className="text-cyan-400/60 text-xs font-mono">SIGNAL:</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`w-1 h-2 rounded-full transition-all ${i <= 4 ? 'bg-cyan-400' : 'bg-cyan-400/30'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === FINANCIAL OVERVIEW GRID === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Income */}
        <div className={`stat-card group relative border border-cyan-500/20 rounded-2xl p-6 bg-gradient-to-br from-black/40 via-black/30 to-cyan-500/5 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer overflow-hidden ${animateStats ? 'animate-in fade-in slide-in-from-bottom-4 duration-500' : 'opacity-0'}`}>
          <div className="absolute top-0 left-0 w-1 h-10 bg-gradient-to-b from-green-400 to-transparent rounded-br group-hover:h-14 transition-all" />
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 group-hover:bg-green-500/20 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all">
                <ArrowDownRight className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-xs font-mono text-green-400 group-hover:text-green-300 transition-colors">INBOUND</span>
            </div>
            <p className="text-gray-400 text-xs font-mono tracking-widest mb-2 group-hover:text-green-400/70 transition-colors">INCOME</p>
            <p className="text-2xl font-black text-green-300 group-hover:text-green-200 font-mono transition-colors">{formatVND(recentIncome)}</p>
            <p className="text-xs text-gray-500 mt-3">{transactions.filter((t: any) => t.toAccountId === account.id).slice(0, 10).length} events</p>
          </div>
        </div>

        {/* Card 2: Expense */}
        <div className={`stat-card group relative border border-cyan-500/20 rounded-2xl p-6 bg-gradient-to-br from-black/40 via-black/30 to-cyan-500/5 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer overflow-hidden ${animateStats ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100' : 'opacity-0'}`}>
          <div className="absolute top-0 left-0 w-1 h-10 bg-gradient-to-b from-red-400 to-transparent rounded-br group-hover:h-14 transition-all" />
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 group-hover:bg-red-500/20 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all">
                <ArrowUpRight className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-xs font-mono text-red-400 group-hover:text-red-300 transition-colors">OUTBOUND</span>
            </div>
            <p className="text-gray-400 text-xs font-mono tracking-widest mb-2 group-hover:text-red-400/70 transition-colors">EXPENSE</p>
            <p className="text-2xl font-black text-red-300 group-hover:text-red-200 font-mono transition-colors">{formatVND(recentExpense)}</p>
            <p className="text-xs text-gray-500 mt-3">{transactions.filter((t: any) => t.fromAccountId === account.id).slice(0, 10).length} events</p>
          </div>
        </div>

        {/* Card 3: Avg Transaction */}
        <div className={`stat-card group relative border border-cyan-500/20 rounded-2xl p-6 bg-gradient-to-br from-black/40 via-black/30 to-cyan-500/5 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer overflow-hidden ${animateStats ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200' : 'opacity-0'}`}>
          <div className="absolute top-0 left-0 w-1 h-10 bg-gradient-to-b from-purple-400 to-transparent rounded-br group-hover:h-14 transition-all" />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs font-mono text-purple-400 group-hover:text-purple-300 transition-colors">AVERAGE</span>
            </div>
            <p className="text-gray-400 text-xs font-mono tracking-widest mb-2 group-hover:text-purple-400/70 transition-colors">AVG AMOUNT</p>
            <p className="text-2xl font-black text-purple-300 group-hover:text-purple-200 font-mono transition-colors">{formatVND(avgTransaction)}</p>
            <p className="text-xs text-gray-500 mt-3">per transaction</p>
          </div>
        </div>

        {/* Card 4: Card Status */}
        <div className={`stat-card group relative border border-cyan-500/20 rounded-2xl p-6 bg-gradient-to-br from-black/40 via-black/30 to-cyan-500/5 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer overflow-hidden ${animateStats ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300' : 'opacity-0'}`}>
          <div className="absolute top-0 left-0 w-1 h-10 bg-gradient-to-b from-blue-400 to-transparent rounded-br group-hover:h-14 transition-all" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all">
                <CreditCard className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-mono text-blue-400 group-hover:text-blue-300 transition-colors">CARD</span>
            </div>
            <p className="text-gray-400 text-xs font-mono tracking-widest mb-2 group-hover:text-blue-400/70 transition-colors">STATUS</p>
            <p className="text-2xl font-black text-blue-300 group-hover:text-blue-200 font-mono transition-colors">
              {account.card ? '● ACTIVE' : '○ INACTIVE'}
            </p>
            {account.card && <p className="text-xs text-blue-400/60 mt-3 font-mono">**** {account.card.cardNumber.slice(-4)}</p>}
          </div>
        </div>
      </div>

      {/* === CHARTS SECTION === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Trend */}
        <div className={`lg:col-span-2 chart-card group relative border border-cyan-500/20 rounded-2xl p-6 bg-gradient-to-br from-black/40 via-black/30 to-cyan-500/5 overflow-hidden ${animateStats ? 'animate-in fade-in slide-in-from-left-4 duration-500 delay-400' : 'opacity-0'}`}>
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/80 to-black/40 border-b border-cyan-500/30 rounded-t-2xl flex items-center px-6 z-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-cyan-400">TREND_ANALYZER.EXE</span>
            </div>
          </div>

          <div className="relative z-5 pt-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Financial Trends
            </h3>
            
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(6,182,212,0.5)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="rgba(6,182,212,0.5)" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.9)', 
                      border: '1px solid rgba(6,182,212,0.3)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => formatVND(Number(value))}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500 font-mono text-sm">{'>'} NO_DATA_AVAILABLE</div>
            )}
          </div>
        </div>

        {/* Side: Transaction Types */}
        <div className={`chart-card group relative border border-cyan-500/20 rounded-2xl p-6 bg-gradient-to-br from-black/40 via-black/30 to-cyan-500/5 overflow-hidden ${animateStats ? 'animate-in fade-in slide-in-from-right-4 duration-500 delay-400' : 'opacity-0'}`}>
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/80 to-black/40 border-b border-cyan-500/30 rounded-t-2xl flex items-center px-6 z-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-cyan-400">CATEGORY_DIST.EXE</span>
            </div>
          </div>

          <div className="relative z-5 pt-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Distribution
            </h3>
            
            {transactionStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={transactionStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {transactionStats.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={['#06b6d4', '#0ea5e9', '#06d6a6', '#a855f7', '#f43f5e'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 font-mono text-sm">{'>'} NO_DATA_AVAILABLE</div>
            )}
          </div>
        </div>
      </div>

      {/* === QUICK ACTION MODULES === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR PAYMENT - FEATURED */}
        <Link href="/dashboard/qr" className={`action-card group relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/10 hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] ${animateStats ? 'animate-in fade-in slide-in-from-top-4 duration-500 delay-400' : 'opacity-0'}`}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 via-transparent to-transparent" style={{ animation: 'scan 2s linear infinite' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_70%)]" />
          </div>
          
          <div className="relative p-8 flex items-center gap-6 group-hover:translate-x-1 transition-transform duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/40 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative p-4 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-400/50 group-hover:bg-cyan-400/20 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all group-hover:scale-110 group-hover:rotate-3">
                <QrCode className="w-8 h-8 text-cyan-200 group-hover:text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-200 group-hover:from-cyan-200 group-hover:via-blue-200 group-hover:to-white transition-all">QR PAYMENT</h4>
              <p className="text-xs text-cyan-300/80 font-mono group-hover:text-cyan-200 transition-colors">Scan & Generate instantly</p>
            </div>
            <div className="text-3xl text-cyan-400/40 group-hover:text-cyan-300 transition-all group-hover:translate-x-2 group-hover:scale-125">→</div>
          </div>
        </Link>

        {/* TOP UP - QUICK LOAD */}
        <Link href="/dashboard/topup" className={`action-card group relative overflow-hidden rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-green-500/5 hover:border-green-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] ${animateStats ? 'animate-in fade-in slide-in-from-top-4 duration-500 delay-450' : 'opacity-0'}`}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-500/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-green-400/10 via-transparent to-transparent" style={{ animation: 'scan 2s linear infinite' }} />
          </div>
          
          <div className="relative p-8 flex items-center gap-6 group-hover:translate-x-1 transition-transform duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/30 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative p-4 rounded-lg bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-400/50 group-hover:bg-green-400/20 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all group-hover:scale-110 group-hover:rotate-3">
                <Wallet className="w-8 h-8 text-green-200 group-hover:text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-300 to-green-200 group-hover:from-green-200 group-hover:via-emerald-200 group-hover:to-white transition-all">TOP UP</h4>
              <p className="text-xs text-green-300/80 font-mono group-hover:text-green-200 transition-colors">Load balance instantly</p>
            </div>
            <div className="text-3xl text-green-400/40 group-hover:text-green-300 transition-all group-hover:translate-x-2 group-hover:scale-125">→</div>
          </div>
        </Link>

        <Link href="/dashboard/transfer" className={`action-card group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-black/40 via-black/30 to-cyan-500/5 hover:border-cyan-500/50 transition-all duration-300 ${animateStats ? 'animate-in fade-in slide-in-from-left-4 duration-500 delay-500' : 'opacity-0'}`}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" style={{ animation: 'scan 2s linear infinite' }} />
          </div>
          
          <div className="relative p-8 flex items-center gap-6 group-hover:translate-x-1 transition-transform duration-300">
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all group-hover:scale-110">
              <Send className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">TRANSFER FUNDS</h4>
              <p className="text-xs text-gray-400 font-mono group-hover:text-cyan-400/60 transition-colors">Send payments instantly</p>
            </div>
            <div className="text-3xl text-cyan-400/20 group-hover:text-cyan-400/60 transition-all group-hover:translate-x-2">→</div>
          </div>
        </Link>

        <Link href="/dashboard/card" className={`action-card group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-black/40 via-black/30 to-cyan-500/5 hover:border-cyan-500/50 transition-all duration-300 ${animateStats ? 'animate-in fade-in slide-in-from-right-4 duration-500 delay-500' : 'opacity-0'}`}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" style={{ animation: 'scan 2s linear infinite' }} />
          </div>
          
          <div className="relative p-8 flex items-center gap-6 group-hover:translate-x-1 transition-transform duration-300">
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all group-hover:scale-110">
              <CreditCard className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">CARD MANAGEMENT</h4>
              <p className="text-xs text-gray-400 font-mono group-hover:text-cyan-400/60 transition-colors">Control payment instruments</p>
            </div>
            <div className="text-3xl text-cyan-400/20 group-hover:text-cyan-400/60 transition-all group-hover:translate-x-2">→</div>
          </div>
        </Link>

        <Link href="/dashboard/bills" className={`action-card group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-black/40 via-black/30 to-cyan-500/5 hover:border-cyan-500/50 transition-all duration-300 ${animateStats ? 'animate-in fade-in slide-in-from-left-4 duration-500 delay-600' : 'opacity-0'}`}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" style={{ animation: 'scan 2s linear infinite' }} />
          </div>
          
          <div className="relative p-8 flex items-center gap-6 group-hover:translate-x-1 transition-transform duration-300">
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all group-hover:scale-110">
              <Zap className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">PAY BILLS</h4>
              <p className="text-xs text-gray-400 font-mono group-hover:text-cyan-400/60 transition-colors">Utility & service payments</p>
            </div>
            <div className="text-3xl text-cyan-400/20 group-hover:text-cyan-400/60 transition-all group-hover:translate-x-2">→</div>
          </div>
        </Link>

        <Link href="/dashboard/reports" className={`action-card group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-black/40 via-black/30 to-cyan-500/5 hover:border-cyan-500/50 transition-all duration-300 ${animateStats ? 'animate-in fade-in slide-in-from-right-4 duration-500 delay-600' : 'opacity-0'}`}>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" style={{ animation: 'scan 2s linear infinite' }} />
          </div>
          
          <div className="relative p-8 flex items-center gap-6 group-hover:translate-x-1 transition-transform duration-300">
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all group-hover:scale-110">
              <Activity className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">ANALYTICS</h4>
              <p className="text-xs text-gray-400 font-mono group-hover:text-cyan-400/60 transition-colors">Detailed reports & insights</p>
            </div>
            <div className="text-3xl text-cyan-400/20 group-hover:text-cyan-400/60 transition-all group-hover:translate-x-2">→</div>
          </div>
        </Link>
      </div>

      {/* === TRANSACTION LOG === */}
      <div className={`log-card relative border border-cyan-500/20 rounded-2xl p-8 bg-gradient-to-b from-black/50 via-black/40 to-cyan-500/5 overflow-hidden ${animateStats ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700' : 'opacity-0'}`}>
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/80 to-black/40 border-b border-cyan-500/30 rounded-t-2xl flex items-center px-6">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400">TRANSACTION_LOG.EXE</span>
            <span className="text-xs font-mono text-cyan-400/50 ml-auto">[LIVE_STREAM]</span>
          </div>
        </div>

        <div className="mt-8 space-y-3 relative z-10">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            RECENT ACTIVITY
            <span className="text-xs text-cyan-400/60 font-mono ml-auto">[SHOWING {Math.min(10, transactions.length)} / {transactions.length}]</span>
          </h3>

          <div className="space-y-2">
            {transactions.slice(0, 10).map((tx: any, idx: number) => {
              const isIncoming = tx.toAccountId === account.id;
              return (
                <div
                  key={tx.id}
                  className={`group/tx relative flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-white/5 to-transparent border border-cyan-500/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-300 font-mono text-sm ${animateStats ? 'animate-in fade-in slide-in-from-left-2 duration-500' : 'opacity-0'}`}
                  style={{ animationDelay: `${750 + idx * 30}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1 relative z-10">
                    <span className="text-cyan-400/60 w-8 text-center group-hover/tx:text-cyan-400 transition-colors font-bold">[{String(idx + 1).padStart(2, '0')}]</span>
                    <div className={`w-8 h-8 flex items-center justify-center rounded border transition-all group-hover/tx:scale-110 ${isIncoming ? 'border-green-400/30 text-green-400 bg-green-500/10 group-hover/tx:bg-green-500/20' : 'border-red-400/30 text-red-400 bg-red-500/10 group-hover/tx:bg-red-500/20'}`}>
                      {isIncoming ? '↓' : '↑'}
                    </div>
                    <div className="flex-1">
                      <p className="text-white group-hover/tx:text-cyan-300 transition-colors font-semibold">{tx.description || (isIncoming ? 'DEPOSIT' : 'WITHDRAWAL')}</p>
                      <p className="text-xs text-gray-500 group-hover/tx:text-gray-400 transition-colors">{new Date(tx.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-base group-hover/tx:text-lg transition-all relative z-10 ${isIncoming ? 'text-green-400 group-hover/tx:text-green-300' : 'text-red-400 group-hover/tx:text-red-300'}`}>
                    {isIncoming ? '+' : '-'}{formatVND(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-12 text-gray-500 font-mono text-sm">
              <div className="text-cyan-400 mb-2">{'>'}</div>
              NO_RECENT_TRANSACTIONS
            </div>
          )}
        </div>
      </div>

      {/* === HIDDEN STYLES === */}
      <style>{`
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
