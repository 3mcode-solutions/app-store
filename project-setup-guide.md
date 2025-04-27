# دليل إعداد وتشغيل المشروع

## المتطلبات الأساسية

قبل البدء في تشغيل المشروع، تأكد من تثبيت البرامج التالية:

1. **Node.js**: الإصدار 18.0.0 أو أحدث
   - يمكن تحميله من [الموقع الرسمي](https://nodejs.org/)

2. **.NET SDK**: الإصدار 8.0 أو أحدث
   - يمكن تحميله من [الموقع الرسمي](https://dotnet.microsoft.com/download)

3. **SQL Server**: الإصدار 2019 أو أحدث
   - يمكن استخدام SQL Server Express للتطوير المحلي
   - تأكد من تكوين مثيل SQL Server: `3M-CODE\SQLEXPRESS`

4. **بيئة التطوير المتكاملة (IDE)**:
   - Visual Studio Code للواجهة الأمامية (Angular)
   - Visual Studio للواجهة الخلفية (ASP.NET Core)

## إعداد قاعدة البيانات

1. **إنشاء قاعدة البيانات**:
   - افتح SQL Server Management Studio
   - قم بإنشاء قاعدة بيانات جديدة باسم `app-store`
   - أو استخدم Entity Framework لإنشاء قاعدة البيانات تلقائيًا

2. **تكوين اتصال قاعدة البيانات**:
   - افتح ملف `appsettings.json` في مشروع ASP.NET Core
   - تأكد من تكوين سلسلة الاتصال بشكل صحيح:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=3M-CODE\\SQLEXPRESS;Database=app-store;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
```

## إعداد الواجهة الخلفية (ASP.NET Core)

1. **استعادة الحزم**:
   - افتح موجه الأوامر في مجلد `app-store-api`
   - قم بتنفيذ الأمر التالي:
   ```
   dotnet restore
   ```

2. **تطبيق الترحيلات (Migrations)**:
   - قم بتنفيذ الأمر التالي لإنشاء قاعدة البيانات وتطبيق الترحيلات:
   ```
   dotnet ef database update
   ```

3. **تشغيل المشروع**:
   - قم بتنفيذ الأمر التالي لتشغيل الخادم:
   ```
   dotnet run
   ```
   - سيتم تشغيل الخادم على العنوان `https://localhost:7240`
   - يمكن الوصول إلى واجهة Swagger على العنوان `https://localhost:7240/swagger`

## إعداد الواجهة الأمامية (Angular)

1. **تثبيت الحزم**:
   - افتح موجه الأوامر في مجلد `app-store`
   - قم بتنفيذ الأمر التالي:
   ```
   npm install
   ```

2. **تكوين عنوان API**:
   - افتح ملف `src/environments/environment.ts`
   - تأكد من تكوين عنوان API بشكل صحيح:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://localhost:7240/api'
   };
   ```

3. **تشغيل خادم التطوير**:
   - قم بتنفيذ الأمر التالي:
   ```
   ng serve
   ```
   - سيتم تشغيل التطبيق على العنوان `http://localhost:4200`

## إنشاء حساب مسؤول

1. **استخدام Swagger**:
   - افتح واجهة Swagger على العنوان `https://localhost:7240/swagger`
   - انتقل إلى نقطة النهاية `POST /api/Users/Register`
   - قم بإنشاء حساب مسؤول باستخدام البيانات التالية:
   ```json
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "Admin123!",
     "phone": "+966123456789",
     "role": "Admin"
   }
   ```

2. **تسجيل الدخول**:
   - انتقل إلى صفحة تسجيل الدخول في التطبيق
   - استخدم البريد الإلكتروني وكلمة المرور التي قمت بإنشائها
   - سيتم توجيهك إلى لوحة تحكم المسؤول

## هيكل المشروع

### الواجهة الأمامية (Angular)

```
app-store/
├── src/
│   ├── app/
│   │   ├── admin/                  # مكونات لوحة تحكم المسؤول
│   │   ├── pages/                  # صفحات المتجر الرئيسية
│   │   ├── shared/                 # المكونات والخدمات المشتركة
│   │   └── layouts/                # تخطيطات الصفحات
│   ├── assets/                     # الموارد الثابتة
│   └── environments/               # إعدادات البيئات
└── angular.json                    # إعدادات Angular
```

### الواجهة الخلفية (ASP.NET Core)

```
app-store-api/
├── Controllers/                    # وحدات التحكم
├── Models/                         # نماذج البيانات
├── DTOs/                           # كائنات نقل البيانات
├── Data/                           # طبقة الوصول للبيانات
├── Services/                       # الخدمات
├── Helpers/                        # مساعدات
└── Program.cs                      # نقطة الدخول الرئيسية
```

## تسجيل الدخول واختبار المشروع

1. **حساب المسؤول**:
   - البريد الإلكتروني: `admin@example.com`
   - كلمة المرور: `Admin123!`

2. **حساب العميل للاختبار**:
   - البريد الإلكتروني: `ahmed@example.com`
   - كلمة المرور: (استخدم كلمة المرور التي قمت بتعيينها أثناء إنشاء الحساب)

## إضافة بيانات تجريبية

يمكنك إضافة بيانات تجريبية للمشروع باستخدام الخطوات التالية:

1. **إضافة تصنيفات**:
   - استخدم نقطة النهاية `POST /api/Categories` لإضافة تصنيفات جديدة
   - مثال:
   ```json
   {
     "name": "إلكترونيات",
     "description": "أجهزة إلكترونية وملحقاتها",
     "imageUrl": "assets/img/categories/electronics.jpg"
   }
   ```

2. **إضافة منتجات**:
   - استخدم نقطة النهاية `POST /api/Products` لإضافة منتجات جديدة
   - مثال:
   ```json
   {
     "name": "هاتف سامسونج جالكسي S23",
     "description": "هاتف ذكي حديث مع كاميرا متطورة وأداء فائق",
     "price": 3499.99,
     "discount": 10,
     "stock": 50,
     "categoryId": 1,
     "imageUrl": "assets/img/products/phone-1.jpg",
     "rating": 4.8,
     "featured": true,
     "active": true
   }
   ```

## حل المشكلات الشائعة

### مشكلات الواجهة الخلفية

1. **خطأ في الاتصال بقاعدة البيانات**:
   - تأكد من تشغيل SQL Server
   - تحقق من سلسلة الاتصال في ملف `appsettings.json`
   - تأكد من وجود قاعدة البيانات

2. **خطأ في الترحيلات (Migrations)**:
   - قم بحذف مجلد `Migrations` وإنشاء ترحيل جديد:
   ```
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

3. **خطأ في المصادقة**:
   - تأكد من تكوين JWT بشكل صحيح في ملف `appsettings.json`
   - تأكد من استخدام خوارزمية `HmacSha256Signature` للتوقيع

### مشكلات الواجهة الأمامية

1. **خطأ في الاتصال بـ API**:
   - تأكد من تشغيل خادم ASP.NET Core
   - تحقق من عنوان API في ملف `environment.ts`
   - تحقق من سياسة CORS في الخادم

2. **خطأ في تثبيت الحزم**:
   - قم بحذف مجلد `node_modules` وتنفيذ الأمر `npm install` مرة أخرى

3. **خطأ في HttpParams**:
   - تأكد من استيراد `HttpParams` من `@angular/common/http`
   - تأكد من استخدام `new HttpParams()` بدلاً من `{}`

## تطوير المشروع

### إضافة ميزات جديدة

1. **إضافة نموذج جديد**:
   - قم بإنشاء ملف نموذج جديد في مجلد `Models`
   - قم بإضافة DbSet في `ApplicationDbContext`
   - قم بإنشاء ترحيل جديد وتحديث قاعدة البيانات

2. **إضافة وحدة تحكم جديدة**:
   - قم بإنشاء ملف وحدة تحكم جديد في مجلد `Controllers`
   - قم بتنفيذ العمليات الأساسية (CRUD)
   - قم بإضافة سمات التفويض المناسبة

3. **إضافة مكون Angular جديد**:
   - قم بإنشاء مكون جديد باستخدام الأمر:
   ```
   ng generate component path/to/component
   ```
   - قم بإضافة المسار في ملف التوجيه المناسب

### نشر المشروع

1. **نشر الواجهة الخلفية**:
   - قم ببناء المشروع للإنتاج:
   ```
   dotnet publish -c Release
   ```
   - قم بنشر الملفات الناتجة على خادم الويب (IIS أو Azure)

2. **نشر الواجهة الأمامية**:
   - قم بتحديث ملف `environment.prod.ts` بعنوان API الإنتاجي
   - قم ببناء المشروع للإنتاج:
   ```
   ng build --configuration production
   ```
   - قم بنشر محتويات مجلد `dist/app-store` على خادم الويب

## الخلاصة

هذا الدليل يوفر الخطوات الأساسية لإعداد وتشغيل المشروع. للحصول على مزيد من المعلومات، يرجى الرجوع إلى وثائق المشروع الكاملة.
