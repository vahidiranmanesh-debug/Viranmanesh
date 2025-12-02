
import React, { useState } from 'react';
import { ProjectData, Partner, Transaction } from '../types';
import { Users, UserPlus, Phone, Calendar, ArrowDownLeft, Wallet, Percent, ChevronLeft, X, CreditCard } from 'lucide-react';

interface PartnersProps {
  data: ProjectData;
  onAddPartner: (partner: Partner) => void;
}

const Partners: React.FC<PartnersProps> = ({ data, onAddPartner }) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({
    joinDate: new Date().toLocaleDateString('fa-IR'),
  });

  const selectedPartner = data.partners.find(p => p.id === selectedPartnerId);

  const getPartnerStats = (partnerId: string) => {
    const partnerTransactions = data.transactions.filter(t => t.partnerId === partnerId);
    
    const totalDeposits = partnerTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDebts = partnerTransactions
      .filter(t => t.type === 'debt' && t.status !== 'paid')
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalDeposits, totalDebts, transactionCount: partnerTransactions.length };
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name || !newPartner.share) return;

    const partner: Partner = {
      id: Date.now().toString(),
      name: newPartner.name,
      role: newPartner.role || 'سرمایه‌گذار',
      share: Number(newPartner.share),
      phoneNumber: newPartner.phoneNumber,
      joinDate: newPartner.joinDate
    };

    onAddPartner(partner);
    setShowAddModal(false);
    setNewPartner({ joinDate: new Date().toLocaleDateString('fa-IR') });
  };

  if (selectedPartner) {
    const stats = getPartnerStats(selectedPartner.id);
    const transactions = data.transactions.filter(t => t.partnerId === selectedPartner.id);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        <button 
          onClick={() => setSelectedPartnerId(null)}
          className="flex items-center text-slate-500 hover:text-slate-800 transition mb-4"
        >
          <ChevronLeft className="rotate-180 ml-1" size={20} />
          بازگشت به لیست شرکا
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-sm">
              {selectedPartner.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{selectedPartner.name}</h2>
              <div className="flex gap-3 text-sm text-slate-500 mt-1">
                <span>{selectedPartner.role}</span>
                <span>•</span>
                <span>سهم مشارکت: {selectedPartner.share}٪</span>
                {selectedPartner.phoneNumber && (
                   <>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {selectedPartner.phoneNumber}</span>
                   </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs text-emerald-600 mb-1">کل واریزی‌ها</p>
                <p className="font-bold text-lg text-emerald-800">{new Intl.NumberFormat('fa-IR').format(stats.totalDeposits)} <span className="text-xs font-normal">تومان</span></p>
             </div>
             <div className="px-4 py-2 bg-yellow-50 rounded-xl border border-yellow-100">
                <p className="text-xs text-yellow-600 mb-1">بدهی / تعهدات</p>
                <p className="font-bold text-lg text-yellow-800">{new Intl.NumberFormat('fa-IR').format(stats.totalDebts)} <span className="text-xs font-normal">تومان</span></p>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-slate-700">
            تاریخچه مالی
          </div>
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">تاریخ</th>
                <th className="px-6 py-4">نوع تراکنش</th>
                <th className="px-6 py-4">شرح</th>
                <th className="px-6 py-4">مبلغ (تومان)</th>
                <th className="px-6 py-4">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length > 0 ? transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-slate-500">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      t.type === 'deposit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {t.type === 'deposit' ? 'واریز وجه' : t.type === 'debt' ? 'ایجاد بدهی' : 'هزینه کرد'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{t.description}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{new Intl.NumberFormat('fa-IR').format(t.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {t.status === 'paid' ? 'تسویه شده' : 'معوق / در انتظار'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    هیچ تراکنش مالی برای این شریک ثبت نشده است.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">مدیریت شرکا و سهامداران</h2>
          <p className="text-slate-500 text-sm mt-1">لیست مشارکت‌کنندگان پروژه و وضعیت مالی هر کدام</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
        >
          <UserPlus size={18} />
          <span>افزودن شریک جدید</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.partners.map((partner) => {
          const stats = getPartnerStats(partner.id);
          
          return (
            <div 
              key={partner.id}
              onClick={() => setSelectedPartnerId(partner.id)}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-emerald-100 group-hover:text-emerald-700 transition">
                  {partner.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold">
                  <Percent size={12} />
                  <span>{partner.share}٪ سهم</span>
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-slate-800 mb-1">{partner.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{partner.role}</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 flex items-center gap-1"><Wallet size={14} /> کل واریزی</span>
                  <span className="font-bold text-emerald-600">{new Intl.NumberFormat('fa-IR').format(stats.totalDeposits)} <span className="text-[10px]">تومان</span></span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 flex items-center gap-1"><CreditCard size={14} /> تعهدات / بدهی</span>
                  <span className="font-bold text-red-500">{new Intl.NumberFormat('fa-IR').format(stats.totalDebts)} <span className="text-[10px]">تومان</span></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-emerald-900 text-white flex justify-between items-center">
              <h3 className="font-bold">افزودن شریک جدید</h3>
              <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">نام و نام خانوادگی</label>
                <input 
                  type="text" 
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">نقش (سازنده/مالک/سرمایه‌گذار)</label>
                  <input 
                    type="text" 
                    value={newPartner.role}
                    onChange={(e) => setNewPartner({...newPartner, role: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="سرمایه‌گذار"
                  />
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-700 block mb-2">درصد سهم</label>
                   <input 
                    type="number" 
                    value={newPartner.share}
                    onChange={(e) => setNewPartner({...newPartner, share: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="20"
                    required
                  />
                </div>
              </div>
              <div>
                 <label className="text-xs font-bold text-slate-700 block mb-2">شماره تماس</label>
                 <input 
                  type="tel" 
                  value={newPartner.phoneNumber}
                  onChange={(e) => setNewPartner({...newPartner, phoneNumber: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              
              <button type="submit" className="w-full py-3 bg-emerald-700 text-white rounded-xl font-bold mt-4 hover:bg-emerald-800 transition">
                ثبت اطلاعات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partners;
