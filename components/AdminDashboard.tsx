import React, { useEffect, useState } from 'react';
import {
    BarChart3, Users, BookMarked, ArrowLeft,
    Download, Laptop, Truck, TrendingUp,
    LayoutDashboard, Activity, AlertCircle
} from 'lucide-react';
import {
    getGlobalStats,
    getEnvironmentStats,
    getSubjectsBreakdown,
    downloadHistoryCSV
} from '../services/storageService';
import { GlobalStats, EnvironmentStats } from '../types';

interface AdminDashboardProps {
    onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
    const [stats, setStats] = useState<GlobalStats | null>(null);
    const [envStats, setEnvStats] = useState<EnvironmentStats | null>(null);
    const [breakdown, setBreakdown] = useState<{ subject: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [g, e, b] = await Promise.all([
                    getGlobalStats(),
                    getEnvironmentStats(),
                    getSubjectsBreakdown()
                ]);
                setStats(g);
                setEnvStats(e);
                setBreakdown(b);
            } catch (err) {
                console.error("Error loading admin data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-40">
                <Activity className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-3 bg-slate-900 rounded-2xl text-slate-500 hover:text-white transition-all">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Console Admin</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Suivi Qualité Académique</p>
                    </div>
                </div>

                <button
                    onClick={downloadHistoryCSV}
                    className="flex items-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-indigo-500/20"
                >
                    <Download className="w-4 h-4" /> Exporter CSV
                </button>
            </div>

            {/* Global Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Users}
                    label="Réponses Totales"
                    value={stats?.totalFeedbacks || 0}
                    color="indigo"
                />
                <StatCard
                    icon={BookMarked}
                    label="Modules Audités"
                    value={stats?.uniqueSubjects || 0}
                    color="blue"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Score Global"
                    value={`${stats?.globalAverageScore || 0}%`}
                    color="emerald"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subjects Table */}
                <div className="glass-panel p-8 rounded-[40px] border border-slate-800">
                    <div className="flex items-center gap-3 mb-8">
                        <BarChart3 className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-black uppercase text-xs tracking-widest text-white">Répartition par Module</h3>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {breakdown.map((b) => (
                            <div key={b.subject} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-900 group hover:border-indigo-500/30 transition-all">
                                <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">{b.subject}</span>
                                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-black">{b.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Environment Stats */}
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-[40px] border border-slate-800">
                        <div className="flex items-center gap-3 mb-8">
                            <Laptop className="w-5 h-5 text-emerald-400" />
                            <h3 className="font-black uppercase text-xs tracking-widest text-white">Équipement Étudiant</h3>
                        </div>
                        <div className="flex items-center justify-between gap-8">
                            <div className="space-y-1">
                                <p className="text-4xl font-black text-white italic">{envStats?.laptop.rate}%</p>
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Taux d'ordinateurs</p>
                            </div>
                            <div className="h-2 flex-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                <div
                                    className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-1000"
                                    style={{ width: `${envStats?.laptop.rate}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-[40px] border border-slate-800">
                        <div className="flex items-center gap-3 mb-8">
                            <Truck className="w-5 h-5 text-blue-400" />
                            <h3 className="font-black uppercase text-xs tracking-widest text-white">Mobilité</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(envStats?.transport || {}).map(([mode, count]) => (
                                <div key={mode} className="p-4 bg-slate-950/50 rounded-2xl border border-slate-900">
                                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">{mode}</p>
                                    <p className="text-xl font-black text-white italic">{count}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: any; label: string; value: string | number; color: string }> = ({ icon: Icon, label, value, color }) => (
    <div className="glass-panel p-8 rounded-[40px] border border-slate-800 relative overflow-hidden group">
        <div className={`absolute -right-4 -bottom-4 opacity-5 text-${color}-500 transform group-hover:scale-110 transition-transform duration-700`}>
            <Icon size={120} />
        </div>
        <div className="relative z-10 space-y-4">
            <div className={`p-3 bg-${color}-500/10 rounded-xl w-fit border border-${color}-500/20`}>
                <Icon className={`w-5 h-5 text-${color}-400`} />
            </div>
            <div>
                <h3 className="text-4xl font-black text-white tracking-tighter italic">{value}</h3>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1">{label}</p>
            </div>
        </div>
    </div>
);

export default AdminDashboard;
