
import React, { useState } from 'react';
import { ProjectData, ProgressStage } from '../types';
import { Check, Clock, Loader2, ArrowDown, ChevronDown, ChevronUp, ChevronLeft, Calendar } from 'lucide-react';

interface ProjectProgressProps {
  data: ProjectData;
}

// Helper to calculate group stats
const getGroupStats = (stages: ProgressStage[]) => {
  if (stages.length === 0) return { progress: 0, status: 'pending' };
  
  const total = stages.reduce((acc, curr) => acc + curr.percentage, 0);
  const avg = Math.round(total / stages.length);
  
  let status = 'pending';
  if (avg === 100) status = 'completed';
  else if (avg > 0) status = 'in-progress';
  
  return { progress: avg, status };
};

const ProjectProgress: React.FC<ProjectProgressProps> = ({ data }) => {
  // Define groups based on the specific order of stages in App.tsx
  // We use slice to map the flat list to groups
  const groups = [
    { title: '۱. مجوزها و فونداسیون', startIndex: 0, endIndex: 6 }, // 0 to 5
    { title: '۲. سازه، اسکلت و دیوارچینی', startIndex: 6, endIndex: 11 }, // 6 to 10
    { title: '۳. تاسیسات مکانیک و برق', startIndex: 11, endIndex: 16 }, // 11 to 15
    { title: '۴. کفسازی و زیرسازی', startIndex: 16, endIndex: 23 }, // 16 to 22
    { title: '۵. نازک‌کاری و کاشیکاری', startIndex: 23, endIndex: 28 }, // 23 to 27
    { title: '۶. تکمیل و نصبیات', startIndex: 28, endIndex: 31 }, // 28 to 30
  ];

  const [expandedGroups, setExpandedGroups] = useState<number[]>([1]); // Default open the second group (Structure)

  const toggleGroup = (index: number) => {
    setExpandedGroups(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">پیشرفت فیزیکی پروژه</h2>
        <p className="text-slate-500">دسته‌بندی مراحل اجرایی و وضعیت ریز فعالیت‌ها</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accordion Timeline */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit max-h-[800px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white z-20 pb-2 border-b border-slate-50">
             <h3 className="font-bold text-lg text-emerald-950">مراحل اجرایی</h3>
             <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">۳۱ مرحله عملیاتی</span>
          </div>

          <div className="space-y-4">
            {groups.map((group, groupIndex) => {
              // Extract stages for this group safely
              const groupStages = data.stages.slice(group.startIndex, group.endIndex);
              const { progress, status } = getGroupStats(groupStages);
              const isOpen = expandedGroups.includes(groupIndex);

              return (
                <div key={groupIndex} className={`rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-emerald-200 shadow-md' : 'border-slate-100 bg-slate-50'}`}>
                  {/* Group Header */}
                  <div 
                    onClick={() => toggleGroup(groupIndex)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isOpen ? 'bg-emerald-50' : 'hover:bg-slate-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2
                        ${status === 'completed' ? 'bg-emerald-600 border-emerald-600 text-white' : 
                          status === 'in-progress' ? 'bg-yellow-500 border-yellow-500 text-white' : 
                          'bg-white border-slate-300 text-slate-400'}
                      `}>
                        {status === 'completed' ? <Check size={18} /> : 
                         status === 'in-progress' ? <Loader2 size={18} className="animate-spin" /> : 
                         <span>{groupIndex + 1}</span>}
                      </div>
                      
                      <div>
                        <h4 className={`font-bold text-sm ${isOpen ? 'text-emerald-900' : 'text-slate-700'}`}>{group.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${status === 'completed' ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-slate-500">{progress}٪ تکمیل</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-slate-400">
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {/* Sub Stages List */}
                  {isOpen && (
                    <div className="bg-white border-t border-emerald-100 p-2 space-y-1">
                      {groupStages.map((stage, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition group">
                          {/* Bullet Point */}
                          <div className={`
                            w-2 h-2 rounded-full shrink-0
                            ${stage.status === 'completed' ? 'bg-emerald-500' : 
                              stage.status === 'in-progress' ? 'bg-yellow-500 animate-pulse' : 'bg-slate-200'}
                          `}></div>

                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-sm font-medium ${stage.status === 'pending' ? 'text-slate-400' : 'text-slate-700'}`}>
                                {stage.name}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                stage.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                stage.status === 'in-progress' ? 'bg-yellow-50 text-yellow-700' : 'bg-slate-50 text-slate-400'
                              }`}>
                                {stage.percentage}٪
                              </span>
                            </div>
                            
                            {/* Sub Progress Bar */}
                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                               <div 
                                 className={`h-full ${stage.status === 'completed' ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                                 style={{ width: `${stage.percentage}%` }}
                               ></div>
                            </div>
                            
                            {(stage.startDate || stage.endDate) && (
                              <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-400">
                                <Calendar size={10} />
                                <span>{stage.endDate ? `پایان: ${stage.endDate}` : `شروع: ${stage.startDate}`}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Gallery / Reports Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 text-emerald-950">تصاویر اخیر کارگاه</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-square bg-slate-200 rounded-lg overflow-hidden relative group cursor-pointer">
                <img src="https://picsum.photos/400/400?random=1" alt="Site" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-center pb-2 text-white text-xs">
                  ۱۴۰۳/۰۲/۱۰ - اسکلت
                </div>
              </div>
              <div className="aspect-square bg-slate-200 rounded-lg overflow-hidden relative group cursor-pointer">
                <img src="https://picsum.photos/400/400?random=2" alt="Site" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-center pb-2 text-white text-xs">
                  ۱۴۰۳/۰۲/۰۵ - بتن ریزی
                </div>
              </div>
              <div className="aspect-square bg-slate-200 rounded-lg overflow-hidden relative group cursor-pointer">
                <img src="https://picsum.photos/400/400?random=3" alt="Site" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-center pb-2 text-white text-xs">
                  ۱۴۰۳/۰۱/۲۸ - فونداسیون
                </div>
              </div>
              <div className="aspect-square bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-emerald-50 hover:text-emerald-600 transition gap-2 group border-2 border-dashed border-slate-200 hover:border-emerald-200">
                <span className="bg-white p-2 rounded-full shadow-sm group-hover:scale-110 transition"><ArrowDown size={20} /></span>
                <span className="text-xs font-medium">مشاهده گالری کامل</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-6 rounded-2xl text-white shadow-lg shadow-emerald-200 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                   <Clock className="animate-pulse text-yellow-400" size={20} />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg">وضعیت فعلی: گروه ۲</h3>
                    <p className="text-emerald-200 text-xs">سازه، اسکلت و دیوارچینی</p>
                 </div>
               </div>
               <p className="text-emerald-100 text-sm mb-4 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10 backdrop-blur-md">
                 طبق گزارش مهندس ناظر، تا پایان هفته جاری سقف سوم تکمیل و عملیات دیوارچینی طبقه اول آغاز خواهد شد.
               </p>
               <button className="w-full py-2.5 bg-yellow-500 text-emerald-950 font-bold rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2">
                 <Calendar size={16} />
                 مشاهده برنامه زمان‌بندی
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress;
