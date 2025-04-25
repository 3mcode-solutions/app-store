/**
 * ملف JavaScript مخصص للوحة التحكم
 * يحتوي على وظائف إضافية لتحسين تجربة المستخدم
 */

document.addEventListener('DOMContentLoaded', function() {
  // تهيئة زر تبديل الشريط الجانبي
  const toggleSidebarBtn = document.querySelector('.toggle-sidebar-btn');
  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', function() {
      document.body.classList.toggle('toggle-sidebar');
    });
  }

  // تهيئة القوائم المنسدلة في الشريط الجانبي
  const sidebarDropdowns = document.querySelectorAll('.sidebar .nav-link.collapsed');
  sidebarDropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', function(e) {
      if (window.innerWidth < 1200) {
        e.preventDefault();
        this.classList.toggle('collapsed');
        const target = this.getAttribute('data-bs-target');
        const targetElement = document.querySelector(target);
        if (targetElement) {
          targetElement.classList.toggle('collapse');
          targetElement.classList.toggle('show');
        }
      }
    });
  });

  // تهيئة زر البحث في الهيدر
  const searchBarToggle = document.querySelector('.search-bar-toggle');
  if (searchBarToggle) {
    searchBarToggle.addEventListener('click', function() {
      const searchBar = document.querySelector('.search-bar');
      if (searchBar) {
        searchBar.classList.toggle('search-bar-show');
      }
    });
  }

  // تهيئة زر العودة إلى الأعلى
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    });

    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
