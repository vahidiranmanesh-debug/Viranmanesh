
export enum ProjectStatus {
  PLANNING = 'در حال برنامه ریزی',
  EXCAVATION = 'گودبرداری',
  FOUNDATION = 'فونداسیون',
  STRUCTURE = 'اسکلت و سقف',
  WALLS = 'سفت کاری',
  FINISHING = 'نازک کاری',
  COMPLETED = 'تکمیل شده'
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  share: number; // percentage
  phoneNumber?: string;
  joinDate?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'deposit' | 'expense' | 'debt';
  description: string;
  status: 'paid' | 'pending' | 'overdue';
  partnerId?: string; // Link transaction to a specific partner
}

export interface SiteReport {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  items: { description: string; unit: string; quantity: number; unitPrice: number }[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'materials' | 'tools' | 'equipment';
  quantity: number;
  unit: string;
  minQuantity: number; // Threshold for low stock alert
  lastUpdated: string;
  location?: string;
}

export interface PurchaseRequest {
  id: string;
  requesterName: string; // e.g., 'Site Supervisor'
  itemName: string;
  quantity: number;
  unit: string;
  urgency: 'low' | 'medium' | 'high';
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'purchased' | 'rejected';
}

export interface ProgressStage {
  name: string;
  percentage: number;
  status: 'completed' | 'in-progress' | 'pending';
  startDate?: string;
  endDate?: string;
  images?: string[];
}

export interface ProjectData {
  id: string;
  title: string;
  address: string;
  totalBudget: number;
  totalSpent: number;
  totalProgress: number;
  status: ProjectStatus;
  startDate: string;
  estimatedEndDate: string;
  partners: Partner[];
  stages: ProgressStage[];
  transactions: Transaction[];
  reports: SiteReport[];
  inventory: InventoryItem[];
  purchaseRequests: PurchaseRequest[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}
