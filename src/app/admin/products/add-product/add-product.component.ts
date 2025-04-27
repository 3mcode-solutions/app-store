import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { ToastrService } from '../../../shared/services/toastr.service';
import { Category } from '../../../shared/interfaces/category.interface';
import { Product, ProductAttribute, ProductImage, ProductVariant } from '../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  // نموذج المنتج
  productForm: FormGroup;

  // بيانات الفئات
  categories: Category[] = [];

  // حالة التحميل
  isLoading = false;

  // حالة عرض الأقسام
  activeTab: 'basic' | 'details' | 'images' | 'variants' | 'seo' = 'basic';

  // وحدات القياس
  weightUnits = ['kg', 'g'];
  dimensionUnits = ['cm', 'm'];

  // تحميل الصور
  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    // إنشاء نموذج المنتج
    this.productForm = this.fb.group({
      // المعلومات الأساسية
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      imageUrl: ['', [Validators.required]],
      category: ['', [Validators.required]],
      inStock: [true],
      stockQuantity: [0, [Validators.min(0)]],
      featured: [false],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],

      // معلومات إضافية
      sku: [''],
      barcode: [''],
      brand: [''],
      weight: [0],
      weightUnit: ['kg'],
      dimensions: this.fb.group({
        length: [0],
        width: [0],
        height: [0],
        unit: ['cm']
      }),
      minOrderQuantity: [1, [Validators.min(1)]],
      maxOrderQuantity: [0],
      isDigital: [false],
      downloadLink: [''],
      taxRate: [0, [Validators.min(0), Validators.max(100)]],
      shippingRequired: [true],

      // الصور
      images: this.fb.array([]),

      // المتغيرات
      variants: this.fb.array([]),

      // الخصائص
      attributes: this.fb.array([]),

      // العلامات
      tags: [''],

      // SEO
      metaTitle: [''],
      metaDescription: [''],
      metaKeywords: [''],

      // المنتجات ذات الصلة
      relatedProductIds: [[]]
    });
  }

  ngOnInit(): void {
    // تحميل الفئات
    this.loadCategories();
  }

  /**
   * تحميل الفئات
   */
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading categories:', error);
        this.toastr.error('حدث خطأ أثناء تحميل الفئات');
      }
    );
  }

  /**
   * حفظ المنتج
   */
  saveProduct(): void {
    if (this.productForm.invalid) {
      // تحديد جميع الحقول كـ "تم لمسها" لإظهار رسائل الخطأ
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });

      // التحقق من صحة مصفوفات النموذج
      this.validateFormArrays();

      // عرض رسالة خطأ
      this.toastr.error('يرجى تصحيح الأخطاء قبل حفظ المنتج');
      return;
    }

    this.isLoading = true;

    // الحصول على بيانات النموذج
    const formData = this.productForm.value;

    // تحويل سلسلة العلامات إلى مصفوفة
    formData.tags = this.parseTags(formData.tags);

    // تحويل سلسلة الكلمات المفتاحية إلى مصفوفة
    formData.metaKeywords = this.parseKeywords(formData.metaKeywords);

    // تعيين الصورة الرئيسية كصورة المنتج الرئيسية
    if (formData.images && formData.images.length > 0) {
      const mainImage = formData.images.find((img: ProductImage) => img.isMain);
      if (mainImage) {
        formData.imageUrl = mainImage.url;
      }
    }

    // إضافة تواريخ الإنشاء والتحديث
    formData.createdAt = new Date();
    formData.updatedAt = new Date();

    // إرسال البيانات إلى الخادم
    this.productService.addProduct(formData).subscribe({
      next: () => {
        this.toastr.success('تم إضافة المنتج بنجاح');
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error adding product:', error);
        this.toastr.error('حدث خطأ أثناء إضافة المنتج');
        this.isLoading = false;
      }
    });
  }

  /**
   * التحقق من صحة مصفوفات النموذج
   */
  validateFormArrays(): void {
    // التحقق من صحة مصفوفة الصور
    const imagesArray = this.getImagesArray();
    for (let i = 0; i < imagesArray.length; i++) {
      const imageForm = imagesArray.at(i) as FormGroup;
      Object.keys(imageForm.controls).forEach(key => {
        const control = imageForm.get(key);
        control?.markAsTouched();
      });
    }

    // التحقق من صحة مصفوفة المتغيرات
    const variantsArray = this.getVariantsArray();
    for (let i = 0; i < variantsArray.length; i++) {
      const variantForm = variantsArray.at(i) as FormGroup;
      Object.keys(variantForm.controls).forEach(key => {
        const control = variantForm.get(key);
        control?.markAsTouched();
      });
    }

    // التحقق من صحة مصفوفة الخصائص
    const attributesArray = this.getAttributesArray();
    for (let i = 0; i < attributesArray.length; i++) {
      const attributeForm = attributesArray.at(i) as FormGroup;
      Object.keys(attributeForm.controls).forEach(key => {
        const control = attributeForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  /**
   * إعادة تعيين النموذج
   */
  resetForm(): void {
    this.productForm.reset({
      inStock: true,
      stockQuantity: 0,
      featured: false,
      price: 0,
      discount: 0,
      rating: 0,
      weightUnit: 'kg',
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: 'cm'
      },
      minOrderQuantity: 1,
      maxOrderQuantity: 0,
      isDigital: false,
      shippingRequired: true,
      taxRate: 0
    });

    // إعادة تعيين مصفوفات النموذج
    this.getImagesArray().clear();
    this.getVariantsArray().clear();
    this.getAttributesArray().clear();

    // إعادة تعيين الصور
    this.selectedImages = [];
    this.imagePreviewUrls = [];

    // إعادة تعيين التبويب النشط
    this.activeTab = 'basic';
  }

  /**
   * تغيير التبويب النشط
   */
  setActiveTab(tab: 'basic' | 'details' | 'images' | 'variants' | 'seo'): void {
    this.activeTab = tab;
  }

  /**
   * الحصول على مصفوفة الصور
   */
  getImagesArray(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  /**
   * إضافة صورة جديدة
   */
  addImage(): void {
    const imageForm = this.fb.group({
      url: ['', [Validators.required]],
      isMain: [false],
      alt: ['']
    });

    this.getImagesArray().push(imageForm);
  }

  /**
   * حذف صورة
   */
  removeImage(index: number): void {
    this.getImagesArray().removeAt(index);
  }

  /**
   * معالجة تحميل الصور
   */
  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        this.selectedImages.push(file);

        // إنشاء معاينة للصورة
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          this.imagePreviewUrls.push(imageUrl);

          // إضافة الصورة إلى النموذج
          const imageForm = this.fb.group({
            url: [imageUrl],
            isMain: [this.getImagesArray().length === 0], // الصورة الأولى هي الرئيسية
            alt: [file.name.split('.')[0]] // استخدام اسم الملف كنص بديل
          });

          this.getImagesArray().push(imageForm);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  /**
   * تعيين الصورة الرئيسية
   */
  setMainImage(index: number): void {
    // إلغاء تحديد جميع الصور كرئيسية
    for (let i = 0; i < this.getImagesArray().length; i++) {
      this.getImagesArray().at(i).get('isMain')?.setValue(false);
    }

    // تعيين الصورة المحددة كرئيسية
    this.getImagesArray().at(index).get('isMain')?.setValue(true);
  }

  /**
   * الحصول على مصفوفة المتغيرات
   */
  getVariantsArray(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  /**
   * إضافة متغير جديد
   */
  addVariant(): void {
    const variantForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.min(0)]],
      stockQuantity: [0, [Validators.min(0)]],
      sku: ['']
    });

    this.getVariantsArray().push(variantForm);
  }

  /**
   * حذف متغير
   */
  removeVariant(index: number): void {
    this.getVariantsArray().removeAt(index);
  }

  /**
   * الحصول على مصفوفة الخصائص
   */
  getAttributesArray(): FormArray {
    return this.productForm.get('attributes') as FormArray;
  }

  /**
   * إضافة خاصية جديدة
   */
  addAttribute(): void {
    const attributeForm = this.fb.group({
      name: ['', [Validators.required]],
      value: ['', [Validators.required]]
    });

    this.getAttributesArray().push(attributeForm);
  }

  /**
   * حذف خاصية
   */
  removeAttribute(index: number): void {
    this.getAttributesArray().removeAt(index);
  }

  /**
   * تحويل سلسلة العلامات إلى مصفوفة
   */
  parseTags(tagsString: string): string[] {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  /**
   * تحويل سلسلة الكلمات المفتاحية إلى مصفوفة
   */
  parseKeywords(keywordsString: string): string[] {
    if (!keywordsString) return [];
    return keywordsString.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
  }
}
