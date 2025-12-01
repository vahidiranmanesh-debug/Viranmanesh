
import React, { useState } from 'react';
import { ProjectData, Transaction } from '../types';
import { ArrowDownLeft, ArrowUpRight, Clock, FileText, Filter, Plus, X, Calendar, DollarSign } from 'lucide-react';

interface FinancialsProps {
  data: ProjectData;
  onAddTransaction: (transaction: Transaction) => void;
}

const Financials: React.FC<FinancialsProps> = ({ data, onAddTransaction }) => {
  const [filter, setFilter] = useState<'all' | 'deposit' | 'expense' | 'debt'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'expense',
    status: 'paid',
    date: new Date().toLocaleDateString('fa-IR'),
  });

  const filteredTransactions = data.transactions.filter(t => {
    const typeMatch = filter === 'all' ? true : t.type === filter;
    
    // Simple string comparison for dates (YYYY/MM/DD format works well for this)
    const startDateMatch = dateRange.start ? t.date >= dateRange.start : true;
    const endDateMatch = dateRange.end ? t.date <= dateRange.end : true;

    return typeMatch && startDateMatch && endDateMatch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.description) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: newTransaction.date || new Date().toLocaleDateString('fa-IR'),
      amount: Number(newTransaction.amount),
      type: newTransaction.type as 'deposit' | 'expense' | 'debt',
      description: newTransaction.description || '',
      status: newTransaction.status as 'paid' | 'pending' | 'overdue',
    };

    onAddTransaction(transaction);
    setShowModal(false);
    setNewTransaction({ type: 'expense', status: 'paid', date: new Date().toLocaleDateString('fa-IR'), amount: 0, description: '' });
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="text-emerald-600" />;
      case 'expense': return <ArrowUpRight className="text-red-600" />;
      case 'debt': return <Clock className="text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">امور مالی و صورت وضعیت‌ها</h2>
          <p className="text-slate-500 text-sm mt-1">مدیریت واریزی‌های شرکا و هزینه‌های پروژه</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-emerald-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
          >
            <Plus size={18} />
            <span>ثبت تراکنش جدید</span>
          </button>
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition">
            <FileText size={18} />
            <span>خروجی اکسل</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-6 rounded-2xl text-white shadow-lg shadow-emerald-200">
          <p className="text-emerald-100 text-sm mb-2">مجموع واریزی شرکا</p>
          <h3 className="text-3xl font-bold">۵,۲۰۰ م‌ت</h3>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-100 bg-white/10 w-fit px-2 py-1 rounded">
            <span>+۱۲٪ افزایش نسبت به ماه قبل</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-2xl text-white shadow-lg shadow-red-200">
          <p className="text-red-100 text-sm mb-2">مجموع مخارج پروژه</p>
          <h3 className="text-3xl font-bold">۴,۸۵۰ م‌ت</h3>
           <div className="mt-4 flex items-center gap-2 text-xs text-red-100 bg-white/10 w-fit px-2 py-1 rounded">
            <span>۹۲٪ بودجه جذب شده</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg shadow-yellow-200">
          <p className="text-yellow-50 text-sm mb-2">بدهی‌های جاری</p>
          <h3 className="text-3xl font-bold">۳۵۰ م‌ت</h3>
           <div className="mt-4 flex items-center gap-2 text-xs text-yellow-100 bg-white/10 w-fit px-2 py-1 rounded">
            <span>۲ مورد سررسید گذشته</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filter Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {(['all', 'deposit', 'expense', 'debt'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-sm transition whitespace-nowrap ${
                  filter === t 
                    ? 'bg-emerald-800 text-white font-medium' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t === 'all' && 'همه'}
                {t === 'deposit' && 'واریزی‌ها'}
                {t === 'expense' && 'هزینه‌ها'}
                {t === 'debt' && 'بدهی‌ها'}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
             <div className="flex items-center gap-1 px-2 text-slate-400">
               <Calendar size={16} />
             </div>
             <input 
               type="text" 
               placeholder="از تاریخ (۱۴۰۳/۰۱/۰۱)"
               className="bg-transparent text-sm w-32 outline-none text-slate-700 placeholder:text-slate-400"
               value={dateRange.start}
               onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
             />
             <span className="text-slate-300">|</span>
             <input 
               type="text" 
               placeholder="تا تاریخ"
               className="bg-transparent text-sm w-32 outline-none text-slate-700 placeholder:text-slate-400"
               value={dateRange.end}
               onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
             />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">نوع</th>
                <th className="px-6 py-4">توضیحات</th>
                <th className="px-6 py-4">مبلغ (تومان)</th>
                <th className="px-6 py-4">تاریخ</th>
                <th className="px-6 py-4">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-slate-100`}>
                        {getIcon(t.type)}
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {t.type === 'deposit' ? 'واریزی' : t.type === 'expense' ? 'هزینه' : 'بدهی'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{t.description}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {new Intl.NumberFormat('fa-IR').format(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {t.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(t.status)}`}>
                      {t.status === 'paid' ? 'پرداخت شده' : t.status === 'pending' ? 'در انتظار' : 'سررسید گذشته'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            تراکنشی با این مشخصات یافت نشد.
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 bg-emerald-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-yellow-400" />
                <h3 className="font-bold text-lg">ثبت تراکنش جدید</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-emerald-200 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-slate-700 block mb-2">نوع تراکنش</label>
                   <select 
                     value={newTransaction.type}
                     onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as any})}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                   >
                     <option value="expense">هزینه</option>
                     <option value="deposit">واریزی</option>
                     <option value="debt">بدهی</option>
                   </select>
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-700 block mb-2">وضعیت</label>
                   <select 
                     value={newTransaction.status}
                     onChange={(e) => setNewTransaction({...newTransaction, status: e.target.value as any})}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                   >
                     <option value="paid">پرداخت شده</option>
                     <option value="pending">در انتظار</option>
                     <option value="overdue">معوق</option>
                   </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">شرح تراکنش</label>
                <input 
                  type="text" 
                  value={newTransaction.description} 
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="مثال: خرید سیمان تیپ ۲"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-slate-700 block mb-2">مبلغ (تومان)</label>
                   <input 
                    type="number" 
                    value={newTransaction.amount || ''} 
                    onChange={(e) => setNewTransaction({...newTransaction, amount: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-mono dir-ltr focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="10,000,000"
                    required
                  />
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-700 block mb-2">تاریخ</label>
                   <input 
                    type="text" 
                    value={newTransaction.date} 
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="1403/02/20"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition"
                >
                  انصراف
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition"
                >
                  ثبت نهایی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financials;
