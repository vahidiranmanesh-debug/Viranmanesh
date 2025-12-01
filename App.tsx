
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Financials from './components/Financials';
import ProjectProgress from './components/ProjectProgress';
import AIAssistant from './components/AIAssistant';
import Reports from './components/Reports';
import Inventory from './components/Inventory';
import PurchaseRequests from './components/PurchaseRequests';
import { ProjectData, ProjectStatus, SiteReport, PurchaseRequest, Transaction } from './types';

// Mock Data
const MOCK_PROJECT: ProjectData = {
  id: 'PRJ-1403-01',
  title: 'پروژه بوکان',
  address: 'تهران، نیاوران، خیابان بوکان',
  totalBudget: 15000000000, // 15 Billion Tomans
  totalSpent: 4850000000, // 4.85 Billion Tomans
  totalProgress: 35,
  status: ProjectStatus.STRUCTURE,
  startDate: '1402/09/01',
  estimatedEndDate: '1404/06/30',
  partners: [
    { name: 'علی رضایی', role: 'مالک زمین', share: 60 },
    { name: 'هلدینگ وحید ایرانمنش', role: 'سازنده', share: 40 }
  ],
  stages: [
    { name: 'گرفتن پروانه و مجوز', percentage: 100, status: 'completed', endDate: '1402/09/15' },
    { name: 'انتخاب مهندسین', percentage: 100, status: 'completed', endDate: '1402/09/20' },
    { name: 'گود برداری', percentage: 100, status: 'completed', endDate: '1402/10/10' },
    { name: 'اجرا مگر و شمع', percentage: 100, status: 'completed', endDate: '1402/10/25' },
    { name: 'چاله اسانسور', percentage: 100, status: 'completed', endDate: '1402/11/05' },
    { name: 'اجرای فنداسیون', percentage: 100, status: 'completed', endDate: '1402/12/15' },
    { name: 'اجرا کامل اسکت', percentage: 65, status: 'in-progress', startDate: '1403/01/20' },
    { name: 'اجرا والپست', percentage: 20, status: 'in-progress' },
    { name: 'دیوارچینی', percentage: 0, status: 'pending' },
    { name: 'شاسی کشی اسانسور', percentage: 0, status: 'pending' },
    { name: 'کر گیری', percentage: 0, status: 'pending' },
    { name: 'نصب کانال کولر', percentage: 0, status: 'pending' },
    { name: 'تاسیسات اتش نشانی و گاز', percentage: 0, status: 'pending' },
    { name: 'تاسیسات فاضلاب', percentage: 0, status: 'pending' },
    { name: 'تاسیسات آب', percentage: 0, status: 'pending' },
    { name: 'تاسیسات برق', percentage: 0, status: 'pending' },
    { name: 'گچ و خاک', percentage: 0, status: 'pending' },
    { name: 'شاسی کشی و شروع نما', percentage: 0, status: 'pending' },
    { name: 'سیمان کاری', percentage: 0, status: 'pending' },
    { name: 'نصب فریم در و پنجره', percentage: 0, status: 'pending' },
    { name: 'فوم بتن کف سازی', percentage: 0, status: 'pending' },
    { name: 'آب بندی سرویس ها', percentage: 0, status: 'pending' },
    { name: 'ایزوگام', percentage: 0, status: 'pending' },
    { name: 'سرامیک', percentage: 0, status: 'pending' },
    { name: 'سفید کاری', percentage: 0, status: 'pending' },
    { name: 'کاشی کاری', percentage: 0, status: 'pending' },
    { name: 'سقف کاذب', percentage: 0, status: 'pending' },
    { name: 'سنگ پله', percentage: 0, status: 'pending' },
    { name: 'تکمیل لابی', percentage: 0, status: 'pending' },
    { name: 'نصب پنجره', percentage: 0, status: 'pending' },
    { name: 'نصب روشنایی', percentage: 0, status: 'pending' },
  ],
  transactions: [
    { id: '1', date: '1403/02/10', amount: 500000000, type: 'deposit', description: 'واریزی مرحله دوم سازنده', status: 'paid' },
    { id: '2', date: '1403/02/08', amount: 320000000, type: 'expense', description: 'خرید میلگرد سایز ۱۸', status: 'paid' },
    { id: '3', date: '1403/02/05', amount: 150000000, type: 'expense', description: 'اجاره تاور کرین (ماهانه)', status: 'paid' },
    { id: '4', date: '1403/02/01', amount: 45000000, type: 'debt', description: 'بدهی پیمانکار بتن‌ریزی', status: 'overdue' },
    { id: '5', date: '1403/01/25', amount: 200000000, type: 'deposit', description: 'تزریق نقدینگی مالک', status: 'paid' },
    { id: '6', date: '1403/01/20', amount: 120000000, type: 'expense', description: 'حقوق نگهبانی و کارگران', status: 'paid' },
  ],
  reports: [
    {
      id: 'r1',
      title: 'صورت وضعیت شماره ۱ - گودبرداری',
      description: 'تکمیل عملیات خاکبرداری و نیلینگ دیواره‌های شرقی و شمالی طبق نقشه مصوب.',
      amount: 450000000,
      date: '1402/12/20',
      status: 'approved',
      items: [
        { description: 'خاکبرداری با بیل مکانیکی', unit: 'سرویس', quantity: 150, unitPrice: 1000000 }
      ]
    }
  ],
  inventory: [
    { id: '1', name: 'سیمان تیپ ۲', category: 'materials', quantity: 150, unit: 'کیسه', minQuantity: 200, lastUpdated: '1403/02/14' },
    { id: '2', name: 'میلگرد ۱۴', category: 'materials', quantity: 450, unit: 'شاخه', minQuantity: 100, lastUpdated: '1403/02/10' },
    { id: '3', name: 'آجر سفال ۱۵', category: 'materials', quantity: 5000, unit: 'عدد', minQuantity: 1000, lastUpdated: '1403/02/12' },
    { id: '4', name: 'الکترود جوشکاری', category: 'tools', quantity: 15, unit: 'بسته', minQuantity: 10, lastUpdated: '1403/02/01' },
    { id: '5', name: 'ماسه شسته', category: 'materials', quantity: 8, unit: 'تن', minQuantity: 20, lastUpdated: '1403/02/15' },
  ],
  purchaseRequests: [
    { 
      id: 'pr1', 
      requesterName: 'محمد حسینی (سرپرست)', 
      itemName: 'صفحه سنگ فرز', 
      quantity: 50, 
      unit: 'عدد', 
      urgency: 'high', 
      description: 'برای برشکاری آرماتورها، موجودی تمام شده.', 
      date: '1403/02/16', 
      status: 'pending' 
    },
    { 
      id: 'pr2', 
      requesterName: 'محمد حسینی (سرپرست)', 
      itemName: 'دستکش ایمنی', 
      quantity: 30, 
      unit: 'جفت', 
      urgency: 'medium', 
      description: 'برای کارگران جدید', 
      date: '1403/02/15', 
      status: 'approved' 
    }
  ]
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projectData, setProjectData] = useState<ProjectData>(MOCK_PROJECT);

  const handleAddReport = (report: SiteReport) => {
    setProjectData(prev => ({
      ...prev,
      reports: [report, ...prev.reports]
    }));
  };

  const handleAddPurchaseRequest = (request: PurchaseRequest) => {
    setProjectData(prev => ({
      ...prev,
      purchaseRequests: [request, ...prev.purchaseRequests]
    }));
  };

  const handleUpdatePurchaseRequestStatus = (id: string, status: PurchaseRequest['status']) => {
    setProjectData(prev => ({
      ...prev,
      purchaseRequests: prev.purchaseRequests.map(req => 
        req.id === id ? { ...req, status } : req
      )
    }));
  };

  const handleAddTransaction = (transaction: Transaction) => {
    setProjectData(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions],
      // Update totals based on transaction type
      totalSpent: transaction.type === 'expense' ? prev.totalSpent + transaction.amount : prev.totalSpent
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={projectData} />;
      case 'progress':
        return <ProjectProgress data={projectData} />;
      case 'financials':
        return (
          <Financials 
            data={projectData} 
            onAddTransaction={handleAddTransaction} 
          />
        );
      case 'ai-assistant':
        return <AIAssistant data={projectData} />;
      case 'reports':
        return <Reports data={projectData} onAddReport={handleAddReport} />;
      case 'inventory':
        return <Inventory data={projectData} />;
      case 'purchase-requests':
        return (
          <PurchaseRequests 
            data={projectData} 
            onAddRequest={handleAddPurchaseRequest}
            onUpdateRequestStatus={handleUpdatePurchaseRequestStatus}
          />
        );
      default:
        return <Dashboard data={projectData} />;
    }
  };

  const pendingRequestsCount = projectData.purchaseRequests.filter(r => r.status === 'pending').length;

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} pendingRequestsCount={pendingRequestsCount}>
      {renderContent()}
    </Layout>
  );
};

export default App;
