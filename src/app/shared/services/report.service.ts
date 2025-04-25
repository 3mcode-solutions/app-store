import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SalesData, CustomerData, InventoryData } from '../interfaces/report.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) { }

  /**
   * الحصول على بيانات المبيعات
   */
  getSalesData(startDate: string, endDate: string): Observable<SalesData> {
    // محاكاة طلب HTTP
    const salesData: SalesData = {
      totalSales: 125750,
      totalOrders: 450,
      averageOrderValue: 279.44,
      salesGrowth: 12.5,
      ordersGrowth: 8.3,
      aovGrowth: 4.2,
      timeline: [
        { date: '2023-01-01', sales: 5200, orders: 20 },
        { date: '2023-01-02', sales: 4800, orders: 18 },
        { date: '2023-01-03', sales: 6100, orders: 22 },
        { date: '2023-01-04', sales: 5500, orders: 19 },
        { date: '2023-01-05', sales: 7200, orders: 25 },
        { date: '2023-01-06', sales: 6800, orders: 24 },
        { date: '2023-01-07', sales: 8100, orders: 30 },
        { date: '2023-01-08', sales: 7500, orders: 28 },
        { date: '2023-01-09', sales: 6900, orders: 26 },
        { date: '2023-01-10', sales: 7800, orders: 29 },
        { date: '2023-01-11', sales: 8500, orders: 32 },
        { date: '2023-01-12', sales: 9200, orders: 35 },
        { date: '2023-01-13', sales: 8800, orders: 33 },
        { date: '2023-01-14', sales: 9500, orders: 36 },
        { date: '2023-01-15', sales: 10200, orders: 38 },
        { date: '2023-01-16', sales: 9800, orders: 37 },
        { date: '2023-01-17', sales: 10500, orders: 40 },
        { date: '2023-01-18', sales: 11200, orders: 42 },
        { date: '2023-01-19', sales: 10800, orders: 41 },
        { date: '2023-01-20', sales: 11500, orders: 43 },
        { date: '2023-01-21', sales: 12200, orders: 45 },
        { date: '2023-01-22', sales: 11800, orders: 44 },
        { date: '2023-01-23', sales: 12500, orders: 46 },
        { date: '2023-01-24', sales: 13200, orders: 48 },
        { date: '2023-01-25', sales: 12800, orders: 47 },
        { date: '2023-01-26', sales: 13500, orders: 49 },
        { date: '2023-01-27', sales: 14200, orders: 51 },
        { date: '2023-01-28', sales: 13800, orders: 50 },
        { date: '2023-01-29', sales: 14500, orders: 52 },
        { date: '2023-01-30', sales: 15200, orders: 54 },
        { date: '2023-01-31', sales: 14800, orders: 53 }
      ],
      topProducts: [
        { id: 1, name: 'هاتف ذكي', sales: 25000, quantity: 50 },
        { id: 2, name: 'لابتوب', sales: 18000, quantity: 20 },
        { id: 3, name: 'سماعات لاسلكية', sales: 12000, quantity: 80 },
        { id: 4, name: 'ساعة ذكية', sales: 9000, quantity: 30 },
        { id: 5, name: 'تلفزيون ذكي', sales: 7500, quantity: 10 }
      ]
    };
    
    return of(salesData).pipe(delay(800));
  }

  /**
   * الحصول على بيانات العملاء
   */
  getCustomerData(startDate: string, endDate: string): Observable<CustomerData> {
    // محاكاة طلب HTTP
    const customerData: CustomerData = {
      totalCustomers: 1250,
      newCustomers: 120,
      returningCustomers: 1130,
      customerGrowth: 9.6,
      timeline: [
        { date: '2023-01-01', newCustomers: 4, activeCustomers: 45 },
        { date: '2023-01-02', newCustomers: 3, activeCustomers: 42 },
        { date: '2023-01-03', newCustomers: 5, activeCustomers: 48 },
        { date: '2023-01-04', newCustomers: 4, activeCustomers: 46 },
        { date: '2023-01-05', newCustomers: 6, activeCustomers: 50 },
        { date: '2023-01-06', newCustomers: 5, activeCustomers: 49 },
        { date: '2023-01-07', newCustomers: 7, activeCustomers: 52 },
        { date: '2023-01-08', newCustomers: 6, activeCustomers: 51 },
        { date: '2023-01-09', newCustomers: 5, activeCustomers: 50 },
        { date: '2023-01-10', newCustomers: 6, activeCustomers: 52 },
        { date: '2023-01-11', newCustomers: 7, activeCustomers: 54 },
        { date: '2023-01-12', newCustomers: 8, activeCustomers: 56 },
        { date: '2023-01-13', newCustomers: 7, activeCustomers: 55 },
        { date: '2023-01-14', newCustomers: 8, activeCustomers: 57 },
        { date: '2023-01-15', newCustomers: 9, activeCustomers: 59 },
        { date: '2023-01-16', newCustomers: 8, activeCustomers: 58 },
        { date: '2023-01-17', newCustomers: 9, activeCustomers: 60 },
        { date: '2023-01-18', newCustomers: 10, activeCustomers: 62 },
        { date: '2023-01-19', newCustomers: 9, activeCustomers: 61 },
        { date: '2023-01-20', newCustomers: 10, activeCustomers: 63 },
        { date: '2023-01-21', newCustomers: 11, activeCustomers: 65 },
        { date: '2023-01-22', newCustomers: 10, activeCustomers: 64 },
        { date: '2023-01-23', newCustomers: 11, activeCustomers: 66 },
        { date: '2023-01-24', newCustomers: 12, activeCustomers: 68 },
        { date: '2023-01-25', newCustomers: 11, activeCustomers: 67 },
        { date: '2023-01-26', newCustomers: 12, activeCustomers: 69 },
        { date: '2023-01-27', newCustomers: 13, activeCustomers: 71 },
        { date: '2023-01-28', newCustomers: 12, activeCustomers: 70 },
        { date: '2023-01-29', newCustomers: 13, activeCustomers: 72 },
        { date: '2023-01-30', newCustomers: 14, activeCustomers: 74 },
        { date: '2023-01-31', newCustomers: 13, activeCustomers: 73 }
      ],
      topCustomers: [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', totalOrders: 12, totalSpent: 15000 },
        { id: 2, name: 'سارة خالد', email: 'sara@example.com', totalOrders: 10, totalSpent: 12000 },
        { id: 3, name: 'محمد علي', email: 'mohamed@example.com', totalOrders: 8, totalSpent: 9500 },
        { id: 4, name: 'فاطمة أحمد', email: 'fatima@example.com', totalOrders: 7, totalSpent: 8200 },
        { id: 5, name: 'خالد عبدالله', email: 'khaled@example.com', totalOrders: 6, totalSpent: 7500 }
      ]
    };
    
    return of(customerData).pipe(delay(800));
  }

  /**
   * الحصول على بيانات المخزون
   */
  getInventoryData(): Observable<InventoryData> {
    // محاكاة طلب HTTP
    const inventoryData: InventoryData = {
      totalProducts: 250,
      inStockProducts: 220,
      outOfStockProducts: 30,
      lowStockProducts: 45,
      topSellingProducts: [
        { id: 1, name: 'هاتف ذكي', quantitySold: 50, remainingStock: 20 },
        { id: 2, name: 'لابتوب', quantitySold: 20, remainingStock: 15 },
        { id: 3, name: 'سماعات لاسلكية', quantitySold: 80, remainingStock: 50 },
        { id: 4, name: 'ساعة ذكية', quantitySold: 30, remainingStock: 25 },
        { id: 5, name: 'تلفزيون ذكي', quantitySold: 10, remainingStock: 5 }
      ],
      lowStockItems: [
        { id: 5, name: 'تلفزيون ذكي', currentStock: 5, minStockLevel: 10 },
        { id: 6, name: 'كاميرا رقمية', currentStock: 3, minStockLevel: 8 },
        { id: 7, name: 'طابعة', currentStock: 2, minStockLevel: 5 },
        { id: 8, name: 'ماوس لاسلكي', currentStock: 4, minStockLevel: 10 },
        { id: 9, name: 'لوحة مفاتيح', currentStock: 6, minStockLevel: 12 }
      ]
    };
    
    return of(inventoryData).pipe(delay(800));
  }
}
