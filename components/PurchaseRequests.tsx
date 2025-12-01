
import React, { useState } from 'react';
import { ProjectData, PurchaseRequest } from '../types';
import { ShoppingCart, UserCog, User, AlertCircle, CheckCircle, XCircle, Clock, Send, Plus } from 'lucide-react';

interface PurchaseRequestsProps {
  data: ProjectData;
  onAddRequest: (request: PurchaseRequest) => void;
  onUpdateRequestStatus: (id: string, status: PurchaseRequest['status']) => void;
}

const PurchaseRequests: React.FC<PurchaseRequestsProps> = ({ data, onAddRequest, onUpdateRequestStatus }) => {
  // Toggle between Supervisor (Requester) and Manager (Approver) roles for demo purposes
  const [role, setRole] = useState<'supervisor' | 'manager'>('supervisor');
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [newItem, setNewItem] = useState({
    itemName: '',
    quantity: '',
    unit: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.itemName || !newItem.quantity) return;

    const request: PurchaseRequest = {
      id: Date.now().toString(),
      requesterName: 'سرپرست کارگاه',
      itemName: newItem.itemName,
      quantity: Number(newItem.quantity),
      unit: newItem.unit,
      urgency: newItem.urgency,
      description: newItem.description,
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'pending'
    };

    onAddRequest(request);
    setShowForm(false);
    setNewItem({ itemName: '', quantity: '', unit: '', urgency: 'medium', description: '' });
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return { text: 'در انتظار بررسی', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'approved': return { text: 'تایید شده', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle };
      case 'purchased': return { text: 'خریداری شده', color: 'bg-blue-100 text-blue-800', icon: ShoppingCart };
      case 'rejected': return { text: 'رد شده', color: 'bg-red-100 text-red-800', icon: XCircle };
      default: return { text: status, color: 'bg-gray-100', icon: AlertCircle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Role Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">درخواست‌های خرید</h2>
          <p className="text-slate-500 text-sm mt-1">مدیریت تامین مصالح و نیازمندی‌های کارگاه</p>
        </div>
        
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setRole('supervisor')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${
              role === 'supervisor' 
                ? 'bg-emerald-800 text-white shadow' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <User size={16} />
            سرپرست (درخواست دهنده)
          </button>
          <button 
             onClick={() => setRole('manager')}
             className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${
              role === 'manager' 
                ? 'bg-emerald-800 text-white shadow' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <UserCog size={16} />
            مدیر پروژه (تایید کننده)
          </button>
        </div>
      </div>

      {/* SUPERVISOR VIEW */}
      {role === 'supervisor' && (
        <>
          {!showForm ? (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">نیاز به مصالح یا ابزار دارید؟</h3>
                <p className="text-emerald-100 text-sm">
                  درخواست خود را ثبت کنید تا مدیر پروژه بررسی و دستور خرید را صادر کند.
                </p>
              </div>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-white text-emerald-800 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-50 transition flex items-center gap-2"
              >
                <Plus size={20} />
                ثبت درخواست جدید
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h3 className="font-bold text-lg text-slate-800">فرم درخواست خرید</h3>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-red-500">
                  <XCircle size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">نام کالا / ابزار</label>
                  <input 
                    type="text" 
                    value={newItem.itemName}
                    onChange={e => setNewItem({...newItem, itemName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="مثال: سیمان سیاه"
                    required
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">تعداد</label>
                    <input 
                      type="number" 
                      value={newItem.quantity}
                      onChange={e => setNewItem({...newItem, quantity: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                      required
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-sm font-medium text-slate-700 mb-2">واحد</label>
                    <input 
                      type="text" 
                      value={newItem.unit}
                      onChange={e => setNewItem({...newItem, unit: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="کیلو/عدد"
                      required
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">اولویت نیاز</label>
                   <div className="flex gap-2">
                     {['low', 'medium', 'high'].map((u) => (
                       <button
                        key={u}
                        type="button"
                        onClick={() => setNewItem({...newItem, urgency: u as any})}
                        className={`flex-1 py-2 rounded-lg text-sm border transition ${
                          newItem.urgency === u 
                            ? (u === 'high' ? 'bg-red-50 border-red-200 text-red-700 font-bold' : u === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-700 font-bold' : 'bg-green-50 border-green-200 text-green-700 font-bold')
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                       >
                         {u === 'high' ? 'فوری' : u === 'medium' ? 'متوسط' : 'عادی'}
                       </button>
                     ))}
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">توضیحات تکمیلی</label>
                  <input 
                    type="text" 
                    value={newItem.description}
                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="مورد مصرف، برند خاص و..."
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                  >
                    انصراف
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 shadow-lg shadow-emerald-200 flex items-center gap-2"
                  >
                    <Send size={18} />
                    ارسال به مدیریت
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {/* LIST OF REQUESTS (Shared View but with different Actions) */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-700 border-r-4 border-emerald-500 pr-3">
          {role === 'manager' ? 'درخواست‌های دریافتی از کارگاه' : 'تاریخچه درخواست‌های شما'}
        </h3>
        
        {data.purchaseRequests.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
             <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
             <p>هیچ درخواستی ثبت نشده است.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {data.purchaseRequests.map((req) => {
              const Badge = getStatusBadge(req.status);
              const StatusIcon = Badge.icon;
              
              return (
                <div key={req.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${getUrgencyColor(req.urgency)}`}>
                          {req.urgency === 'high' ? 'فوری' : req.urgency === 'medium' ? 'متوسط' : 'عادی'}
                        </span>
                        <h4 className="font-bold text-slate-800 text-lg">{req.itemName}</h4>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${Badge.color}`}>
                         <StatusIcon size={14} />
                         <span>{Badge.text}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-500 mb-3">
                       <div>
                         <span className="block text-xs text-slate-400">تعداد</span>
                         <span className="font-medium text-slate-700">{req.quantity} {req.unit}</span>
                       </div>
                       <div>
                         <span className="block text-xs text-slate-400">درخواست کننده</span>
                         <span className="font-medium text-slate-700">{req.requesterName}</span>
                       </div>
                       <div>
                         <span className="block text-xs text-slate-400">تاریخ ثبت</span>
                         <span className="font-medium text-slate-700">{req.date}</span>
                       </div>
                    </div>
                    
                    {req.description && (
                      <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {req.description}
                      </p>
                    )}
                  </div>

                  {/* MANAGER ACTIONS */}
                  {role === 'manager' && req.status === 'pending' && (
                    <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-r border-slate-100 pt-4 md:pt-0 md:pr-4 md:w-48">
                      <button 
                        onClick={() => onUpdateRequestStatus(req.id, 'approved')}
                        className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} />
                        تایید درخواست
                      </button>
                      <button 
                         onClick={() => onUpdateRequestStatus(req.id, 'rejected')}
                         className="w-full py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-bold hover:bg-red-100 transition flex items-center justify-center gap-2"
                      >
                        <XCircle size={16} />
                        رد کردن
                      </button>
                    </div>
                  )}

                  {/* ACTION TO MARK AS PURCHASED */}
                  {role === 'manager' && req.status === 'approved' && (
                    <div className="flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-r border-slate-100 pt-4 md:pt-0 md:pr-4 md:w-48">
                      <button 
                        onClick={() => onUpdateRequestStatus(req.id, 'purchased')}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} />
                        خرید انجام شد
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseRequests;
