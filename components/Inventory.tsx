
import React from 'react';
import { ProjectData } from '../types';
import { Package, AlertTriangle, Plus, Search, Filter } from 'lucide-react';

interface InventoryProps {
  data: ProjectData;
}

const Inventory: React.FC<InventoryProps> = ({ data }) => {
  const lowStockItems = data.inventory.filter(item => item.quantity <= item.minQuantity);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">مدیریت انبار کارگاه</h2>
          <p className="text-slate-500 text-sm mt-1">لیست مصالح موجود، ابزارآلات و تجهیزات</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-800 transition shadow-lg shadow-emerald-200">
            <Plus size={18} />
            <span>ورود کالا</span>
          </button>
           <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition">
            <span>خروج کالا</span>
          </button>
        </div>
      </div>

      {/* Alerts Section */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-3">
          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-yellow-800 text-sm">هشدار موجودی کم</h3>
            <p className="text-yellow-700 text-xs mt-1">
              {lowStockItems.length} قلم کالا به نقطه سفارش مجدد رسیده‌اند. لطفا نسبت به شارژ انبار اقدام کنید.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {lowStockItems.map(item => (
                <span key={item.id} className="bg-white/50 px-2 py-0.5 rounded text-xs text-yellow-800 font-medium">
                  {item.name}: {item.quantity} {item.unit}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs mb-1">کل اقلام</p>
          <h3 className="text-2xl font-bold text-slate-800">{data.inventory.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs mb-1">ارزش تخمینی موجودی</p>
          <h3 className="text-2xl font-bold text-slate-800">۱,۲۵۰ <span className="text-sm font-normal text-slate-400">میلیون تومان</span></h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs mb-1">ورودی هفته</p>
          <h3 className="text-2xl font-bold text-green-600">+۱۲</h3>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs mb-1">خروجی هفته</p>
          <h3 className="text-2xl font-bold text-red-500">-۸</h3>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-slate-800">موجودی فعلی</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:flex-none">
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="جستجو در انبار..." 
                  className="bg-slate-50 border-none rounded-lg pr-10 pl-4 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-emerald-500"
                />
             </div>
             <button className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200">
               <Filter size={18} />
             </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">نام کالا</th>
                <th className="px-6 py-4">دسته‌بندی</th>
                <th className="px-6 py-4">موجودی</th>
                <th className="px-6 py-4">وضعیت</th>
                <th className="px-6 py-4">آخرین بروزرسانی</th>
                <th className="px-6 py-4">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.inventory.map((item) => {
                const isLowStock = item.quantity <= item.minQuantity;
                const stockPercentage = Math.min(100, (item.quantity / (item.minQuantity * 3)) * 100);
                
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                          <Package size={18} />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                        {item.category === 'materials' ? 'مصالح' : item.category === 'tools' ? 'ابزار' : 'تجهیزات'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{item.quantity}</span>
                        <span className="text-xs text-slate-500">{item.unit}</span>
                      </div>
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1.5">
                        <div 
                          className={`h-full rounded-full ${isLowStock ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${stockPercentage}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">کمبود موجودی</span>
                      ) : (
                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">کافی</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {item.lastUpdated}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-emerald-700 text-xs font-bold hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition">
                        گردش کالا
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
