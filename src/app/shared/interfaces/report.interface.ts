export interface SalesData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesGrowth: number;
  ordersGrowth: number;
  aovGrowth: number;
  timeline: TimelineItem[];
  topProducts: TopProduct[];
}

export interface TimelineItem {
  date: string;
  sales: number;
  orders: number;
}

export interface TopProduct {
  id: number;
  name: string;
  sales: number;
  quantity: number;
}

export interface CustomerData {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerGrowth: number;
  timeline: CustomerTimelineItem[];
  topCustomers: TopCustomer[];
}

export interface CustomerTimelineItem {
  date: string;
  newCustomers: number;
  activeCustomers: number;
}

export interface TopCustomer {
  id: number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
}

export interface InventoryData {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  topSellingProducts: TopSellingProduct[];
  lowStockItems: LowStockItem[];
}

export interface TopSellingProduct {
  id: number;
  name: string;
  quantitySold: number;
  remainingStock: number;
}

export interface LowStockItem {
  id: number;
  name: string;
  currentStock: number;
  minStockLevel: number;
}
