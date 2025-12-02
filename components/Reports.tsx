
import React, { useState, useRef } from 'react';
import { ProjectData, SiteReport } from '../types';
import { processVoiceReport } from '../services/geminiService';
import { Mic, Square, Loader2, FileText, Check, X, AlertCircle, Plus, PenTool, Trash2, PlusCircle } from 'lucide-react';

interface ReportsProps {
  data: ProjectData;
  onAddReport: (report: SiteReport) => void;
}

const Reports: React.FC<ReportsProps> = ({ data, onAddReport }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [generatedReport, setGeneratedReport] = useState<Partial<SiteReport> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for manual item entry inside the modal
  const [newItem, setNewItem] = useState({ description: '', quantity: '', unit: '', unitPrice: '' });

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          await analyzeAudio(base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("دسترسی به میکروفون امکان‌پذیر نیست.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const analyzeAudio = async (base64Audio: string) => {
    try {
      const result = await processVoiceReport(base64Audio);
      setGeneratedReport({
        ...result,
        id: Date.now().toString(),
        status: 'pending'
      });
      setShowModal(true);
    } catch (err) {
      setError("خطا در پردازش صدا. لطفا دوباره تلاش کنید.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualEntry = () => {
    setGeneratedReport({
      id: Date.now().toString(),
      title: '',
      description: '',
      amount: 0,
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'pending',
      items: []
    });
    setShowModal(true);
  };

  const handleAddItem = () => {
    if (!newItem.description || !generatedReport) return;
    
    const itemToAdd = {
      description: newItem.description,
      quantity: Number(newItem.quantity) || 0,
      unit: newItem.unit || 'عدد',
      unitPrice: Number(newItem.unitPrice) || 0
    };

    setGeneratedReport({
      ...generatedReport,
      items: [...(generatedReport.items || []), itemToAdd]
    });

    setNewItem({ description: '', quantity: '', unit: '', unitPrice: '' });
  };

  const handleRemoveItem = (index: number) => {
    if (!generatedReport || !generatedReport.items) return;
    const updatedItems = [...generatedReport.items];
    updatedItems.splice(index, 1);
    setGeneratedReport({ ...generatedReport, items: updatedItems });
  };

  const handleConfirm = () => {
    if (generatedReport && generatedReport.title) {
      onAddReport(generatedReport as SiteReport);
      setShowModal(false);
      setGeneratedReport(null);
      setNewItem({ description: '', quantity: '', unit: '', unitPrice: '' });
    } else {
      alert("لطفا عنوان گزارش را وارد کنید.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">مدیریت صورت وضعیت‌ها</h2>
          <p className="text-slate-500 text-sm mt-1">ثبت گزارش کارکرد و هزینه‌ها به صورت صوتی یا دستی</p>
        </div>
        <button 
          onClick={handleManualEntry}
          className="bg-emerald-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
        >
          <PenTool size={18} />
          <span>ثبت گزارش دستی</span>
        </button>
      </div>

      {/* Voice Input Section */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <h3 className="text-xl font-bold mb-2">ثبت هوشمند صورت وضعیت</h3>
          <p className="text-emerald-100 mb-6 max-w-md text-sm">
            برای ثبت گزارش جدید، دکمه میکروفون را نگه دارید و شرح عملیات، هزینه‌ها و مقادیر مصرفی را دیکته کنید. هوش مصنوعی آن را تبدیل به صورت وضعیت می‌کند.
          </p>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`
              w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl
              ${isRecording 
                ? 'bg-red-500 scale-110 ring-4 ring-red-500/30 animate-pulse' 
                : 'bg-white text-emerald-800 hover:scale-105'}
              ${isProcessing ? 'opacity-80 cursor-wait' : ''}
            `}
          >
            {isProcessing ? (
              <Loader2 size={32} className="animate-spin" />
            ) : isRecording ? (
              <Square size={28} fill="currentColor" />
            ) : (
              <Mic size={32} />
            )}
          </button>
          
          <p className="mt-4 text-sm font-medium h-6">
            {isRecording ? 'در حال ضبط... (برای پایان کلیک کنید)' : isProcessing ? 'در حال پردازش و استخراج اطلاعات...' : 'برای شروع صحبت کنید'}
          </p>
          
          {error && (
             <div className="mt-4 bg-red-500/20 text-red-100 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
               <AlertCircle size={16} />
               <span>{error}</span>
             </div>
          )}
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 gap-4">
        {data.reports && data.reports.length > 0 ? (
          data.reports.map((report) => (
            <div key={report.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{report.title}</h4>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1">{report.description}</p>
                  <div className="flex gap-3 mt-2 text-xs text-slate-400">
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.items?.length || 0} قلم کالا/خدمات</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col items-end gap-2 w-full md:w-auto justify-between">
                <span className="font-bold text-lg text-slate-800">
                  {new Intl.NumberFormat('fa-IR').format(report.amount || 0)} <span className="text-xs text-slate-500 font-normal">تومان</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  report.status === 'approved' ? 'bg-green-100 text-green-700' :
                  report.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {report.status === 'approved' ? 'تایید شده' :
                   report.status === 'rejected' ? 'رد شده' : 'در انتظار بررسی'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>هنوز صورت وضعیتی ثبت نشده است.</p>
          </div>
        )}
      </div>

      {/* Confirmation / Manual Entry Modal */}
      {showModal && generatedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-4">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">
                {generatedReport.id ? 'ویرایش و تایید گزارش' : 'ثبت گزارش جدید'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-2">عنوان گزارش</label>
                  <input 
                    type="text" 
                    value={generatedReport.title || ''} 
                    onChange={(e) => setGeneratedReport({...generatedReport, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="مثال: بتن ریزی سقف دوم"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-2">شرح عملیات</label>
                  <textarea 
                    value={generatedReport.description || ''} 
                    onChange={(e) => setGeneratedReport({...generatedReport, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm h-20 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    placeholder="توضیحات تکمیلی..."
                  />
                </div>

                <div>
                   <label className="text-xs font-bold text-slate-700 block mb-2">مبلغ کل (تومان)</label>
                   <input 
                    type="number" 
                    value={generatedReport.amount || 0} 
                    onChange={(e) => setGeneratedReport({...generatedReport, amount: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono dir-ltr focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-700 block mb-2">تاریخ</label>
                   <input 
                    type="text" 
                    value={generatedReport.date || ''} 
                    onChange={(e) => setGeneratedReport({...generatedReport, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-700 text-sm mb-3">ریز اقلام و خدمات</h4>
                
                {/* Add New Item Form */}
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 mb-4 grid grid-cols-12 gap-2 items-end">
                   <div className="col-span-12 sm:col-span-4">
                     <label className="text-[10px] text-slate-500 block mb-1">شرح کالا / خدمات</label>
                     <input 
                       type="text" 
                       value={newItem.description}
                       onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                       className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none"
                       placeholder="مثال: سیمان"
                     />
                   </div>
                   <div className="col-span-4 sm:col-span-2">
                     <label className="text-[10px] text-slate-500 block mb-1">تعداد</label>
                     <input 
                       type="number" 
                       value={newItem.quantity}
                       onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                       className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none"
                     />
                   </div>
                   <div className="col-span-4 sm:col-span-2">
                     <label className="text-[10px] text-slate-500 block mb-1">واحد</label>
                     <input 
                       type="text" 
                       value={newItem.unit}
                       onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                       className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none"
                       placeholder="کیسه"
                     />
                   </div>
                   <div className="col-span-4 sm:col-span-3">
                     <label className="text-[10px] text-slate-500 block mb-1">قیمت واحد</label>
                     <input 
                       type="number" 
                       value={newItem.unitPrice}
                       onChange={(e) => setNewItem({...newItem, unitPrice: e.target.value})}
                       className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none"
                     />
                   </div>
                   <div className="col-span-12 sm:col-span-1">
                     <button 
                       onClick={handleAddItem}
                       className="w-full h-[30px] bg-emerald-600 text-white rounded-lg flex items-center justify-center hover:bg-emerald-700 transition"
                     >
                       <PlusCircle size={18} />
                     </button>
                   </div>
                </div>

                {/* Items List */}
                {generatedReport.items && generatedReport.items.length > 0 ? (
                  <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-100 text-slate-500 font-medium">
                        <tr>
                          <th className="px-3 py-2">شرح</th>
                          <th className="px-3 py-2">تعداد</th>
                          <th className="px-3 py-2">واحد</th>
                          <th className="px-3 py-2">قیمت واحد</th>
                          <th className="px-3 py-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {generatedReport.items.map((item, i) => (
                          <tr key={i} className="hover:bg-white">
                            <td className="px-3 py-2 text-slate-700">{item.description}</td>
                            <td className="px-3 py-2 text-slate-600">{item.quantity}</td>
                            <td className="px-3 py-2 text-slate-600">{item.unit}</td>
                            <td className="px-3 py-2 text-slate-600">{new Intl.NumberFormat('fa-IR').format(item.unitPrice || 0)}</td>
                            <td className="px-3 py-2 text-center">
                              <button 
                                onClick={() => handleRemoveItem(i)}
                                className="text-red-400 hover:text-red-600 transition"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-xs text-slate-400 py-2">هیچ قلمی اضافه نشده است.</p>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 text-slate-600 font-medium hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition"
              >
                انصراف
              </button>
              <button 
                onClick={handleConfirm}
                className="flex-1 py-3 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2"
              >
                <Check size={18} />
                تایید و ثبت نهایی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
