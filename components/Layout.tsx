
import React from 'react';
import { 
  LayoutDashboard, 
  HardHat, 
  Wallet, 
  FileText, 
  MessageSquareText, 
  Menu,
  X,
  Package,
  ShoppingCart
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingRequestsCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, pendingRequestsCount = 0 }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { id: 'progress', label: 'پیشرفت پروژه', icon: HardHat },
    { id: 'financials', label: 'امور مالی و واریزی‌ها', icon: Wallet },
    { id: 'reports', label: 'صورت وضعیت‌ها', icon: FileText },
    { id: 'inventory', label: 'مدیریت انبار', icon: Package },
    { id: 'purchase-requests', label: 'درخواست خرید', icon: ShoppingCart, badge: pendingRequestsCount },
    { id: 'ai-assistant', label: 'دستیار هوشمند', icon: MessageSquareText },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="font-bold text-lg text-emerald-900">هلدینگ وحید ایرانمنش</h1>
        <button onClick={toggleSidebar} className="p-2 text-emerald-800">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:relative z-10 top-0 right-0 h-full w-64 bg-emerald-950 text-white transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          flex flex-col
        `}
      >
        <div className="p-6 border-b border-emerald-900">
          <h1 className="text-xl font-bold flex items-center gap-2 text-white">
            <HardHat className="text-yellow-400" />
            <span>هلدینگ ایرانمنش</span>
          </h1>
          <p className="text-xs text-emerald-200 mt-2">پروژه بوکان</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative
                ${activeTab === item.id 
                  ? 'bg-yellow-500 text-emerald-950 font-bold shadow-lg shadow-yellow-500/20' 
                  : 'text-emerald-100 hover:bg-emerald-900 hover:text-white'}
              `}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-emerald-950' : ''} />
              <span className="font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute left-4 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-900">
          <div className="bg-emerald-900/50 rounded-lg p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-sm font-bold border border-emerald-700">
              و ا
            </div>
            <div>
              <p className="text-sm font-medium">وحید ایرانمنش</p>
              <p className="text-xs text-emerald-300">مدیر پروژه</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scroll-smooth">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;