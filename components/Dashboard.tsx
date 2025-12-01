
import React from 'react';
import { ProjectData } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList
} from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle2, DollarSign, Activity } from 'lucide-react';

interface DashboardProps {
  data: ProjectData;
}

// Theme Colors
const COLORS = {
  emerald: '#059669', // Jade Green
  emeraldLight: '#34d399',
  yellow: '#EAB308', // Dark Yellow
  red: '#EF4444',
  slate: '#64748b'
};

const PIE_COLORS = [COLORS.emerald, COLORS.yellow, COLORS.red, '#3B82F6'];

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const financialData = [
    { name: 'بودجه کل', amount: data.totalBudget },
    { name: 'هزینه شده', amount: data.totalSpent },
    { name: 'باقی‌مانده', amount: data.totalBudget - data.totalSpent },
  ];

  // Logic to group the 30+ stages into readable categories for the dashboard
  const categorizeStages = () => {
    const categories = [
      { id: 'prep', name: 'مجوزها و فونداسیون', keywords: ['پروانه', 'مهندسین', 'گود', 'شمع', 'فنداسیون'] },
      { id: 'structure', name: 'سازه و اسکلت', keywords: ['اسکلت', 'والپست', 'دیوارچینی', 'سقف', 'شاسی'] },
      { id: 'mep', name: 'تاسیسات مکانیک/برق', keywords: ['تاسیسات', 'لوله', 'برق', 'گاز', 'آب', 'کانال', 'کر گیری'] },
      { id: 'finishing', name: 'نازک‌کاری و نما', keywords: ['گچ', 'سیمان', 'کاشی', 'سرامیک', 'سفید', 'نما', 'پنجره', 'فوم'] },
      { id: 'completion', name: 'تکمیل و نصبیات', keywords: ['نصب', 'لابی', 'روشنایی', 'پله', 'ایزوگام'] },
    ];

    return categories.map(cat => {
      // Find all stages belonging to this category based on keywords
      const categoryStages = data.stages.filter(stage => 
        cat.keywords.some(k => stage.name.includes(k))
      );

      if (categoryStages.length === 0) return { name: cat.name, progress: 0, count: 0 };

      const totalProgress = categoryStages.reduce((acc, curr) => acc + curr.percentage, 0);
      const avgProgress = Math.round(totalProgress / categoryStages.length);

      return {
        name: cat.name,
        progress: avgProgress,
        count: categoryStages.length
      };
    });
  };

  const groupedProgressData = categorizeStages();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fa-IR').format(val) + ' م‌ت';
  };

  // Custom Tooltip for the Bar Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-emerald-900 text-white p-3 rounded-lg shadow-xl text-xs border border-emerald-700">
          <p className="font-bold mb-1 text-yellow-400">{label}</p>
          <p className="flex justify-between gap-4">
            <span>پیشرفت میانگین:</span>
            <span className="font-mono font-bold">{payload[0].value}٪</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 mb-2">داشبورد وضعیت پروژه</h2>
           <p className="text-slate-500 text-sm">نمای کلی از پیشرفت فازهای اصلی و وضعیت مالی</p>
        </div>
        <div className="text-left hidden sm:block">
           <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
             وضعیت کلی: {data.status}
           </span>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-emerald-100"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1 font-medium">پیشرفت فیزیکی کل</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{data.totalProgress}٪</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl shadow-sm">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full shadow-[0_0_10px_rgba(5,150,105,0.4)]" style={{ width: `${data.totalProgress}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition">
           <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-red-100"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1 font-medium">هزینه شده تا کنون</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">{formatCurrency(data.totalSpent)}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl shadow-sm">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-xs text-red-500 mt-3 flex items-center gap-1 font-medium">
            <AlertCircle size={14} />
            <span>۳۲٪ از کل بودجه</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute right-0 top-0 w-24 h-24 bg-yellow-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-yellow-100"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1 font-medium">فاز اجرایی</p>
              <h3 className="text-xl font-bold text-slate-800 mt-2">{data.status}</h3>
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl shadow-sm">
              <HardHatIcon size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">پایان تخمینی: ۱۴۰۴/۰۶</p>
        </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-blue-100"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 mb-1 font-medium">وضعیت کارگاه</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-2">فعال</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm">
              <Activity size={24} />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-3 font-medium flex items-center gap-1">
             <CheckCircle2 size={14} />
             <span>بدون حادثه (۴۵ روز)</span>
          </p>
        </div>
      </div>

      {/* Advanced Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>
              تحلیل پیشرفت فازهای اصلی
            </h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">خلاصه ۳۰ مرحله اجرایی</span>
          </div>
          
          <div className="h-[350px] w-full dir-ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={groupedProgressData} 
                layout="vertical" 
                margin={{ left: 20, right: 60, top: 0, bottom: 0 }}
                barSize={24}
              >
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#EAB308" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={140} 
                  tick={{ fontSize: 13, fontWeight: 600, fill: '#334155' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9', opacity: 0.5}} />
                
                {/* Background Bar (Track) */}
                <Bar dataKey="progress" data={groupedProgressData.map(d => ({...d, full: 100}))} barSize={24} fill="#f1f5f9" radius={[0, 8, 8, 0]} isAnimationActive={false} />
                
                {/* Actual Progress Bar */}
                <Bar dataKey="progress" fill="url(#progressGradient)" radius={[0, 8, 8, 0]}>
                  <LabelList 
                    dataKey="progress" 
                    position="right" 
                    style={{ fontSize: '14px', fontWeight: 'bold', fill: '#059669' }} 
                    formatter={(val: number) => `${val}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-lg mb-6 text-slate-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>
            تخصیص منابع مالی
          </h3>
          <div className="h-56 flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="amount"
                  stroke="none"
                  cornerRadius={6}
                >
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400">بودجه کل</span>
              <span className="font-bold text-slate-800 dir-ltr">15 B</span>
            </div>
          </div>
          
          <div className="space-y-4 mt-6">
             {financialData.map((item, idx) => (
               <div key={idx} className="flex justify-between items-center text-sm p-3 rounded-xl bg-slate-50 border border-slate-100">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: PIE_COLORS[idx] }}></div>
                   <span className="text-slate-600 font-medium">{item.name}</span>
                 </div>
                 <span className="font-bold text-slate-800">{formatCurrency(item.amount).split(' ')[0]} <span className="text-[10px] text-slate-400">م‌ت</span></span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const HardHatIcon = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/>
    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/>
    <path d="M4 15v-3a6 6 0 0 1 6-6h0"/>
    <path d="M14 6h0a6 6 0 0 1 6 6v3"/>
  </svg>
);

export default Dashboard;
