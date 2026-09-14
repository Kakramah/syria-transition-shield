/**
 * وثائقي سنوات التحصين الخمس (2024-2029) | المحرك التفاعلي
 * بقلم خلدون عكرمة
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. شريط تقدم القراءة وترويسة الصفحة
  const progressBar = document.getElementById('reading-progress');
  const siteHeader = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;

    if (totalHeight > 0 && progressBar) {
      const progressPercent = (scrollPosition / totalHeight) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    if (backToTopBtn) {
      if (scrollPosition > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 2. زر المشاركة والإشعار المنبثق
  const shareBtn = document.getElementById('share-btn');
  const toast = document.getElementById('toast');

  function showToast(message) {
    if (!toast) return;
    if (message) toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: document.title,
        text: 'وثائقي سنوات التحصين الخمس: مواجهة الفلول والدولة العميقة وشرف جوع الكرامة | خلدون عكرمة',
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== 'AbortError') {
            copyToClipboard();
          }
        }
      } else {
        copyToClipboard();
      }
    });
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        showToast('تم نسخ رابط الوثيقة إلى الحافظة بنجاح');
      })
      .catch(() => {
        showToast('تعذر نسخ الرابط تلقائيا');
      });
  }

  // 3. معرض الصور التفاعلي (Lightbox)
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let currentIndex = 0;
  const galleryData = [];

  galleryItems.forEach((item, index) => {
    const imgEl = item.querySelector('.gallery-thumb');
    const titleEl = item.querySelector('.gallery-title');
    const descEl = item.querySelector('.gallery-desc');

    galleryData.push({
      src: imgEl ? imgEl.getAttribute('src') : '',
      alt: imgEl ? imgEl.getAttribute('alt') : '',
      title: titleEl ? titleEl.textContent.trim() : '',
      desc: descEl ? descEl.textContent.trim() : ''
    });

    item.addEventListener('click', () => {
      openLightbox(index);
    });

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  function openLightbox(index) {
    if (!lightboxModal || !galleryData[index]) return;
    currentIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryData[currentIndex];
    if (!item) return;

    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    }

    if (lightboxCaption) {
      lightboxCaption.innerHTML = `<strong>${item.title}:</strong> ${item.desc}`;
    }
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function showPrevImage() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNextImage);
  if (prevBtn) prevBtn.addEventListener('click', showPrevImage);

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      // باللغة العربية: السهم الأيسر ينقل للصورة التالية
      showNextImage();
    } else if (e.key === 'ArrowRight') {
      // باللغة العربية: السهم الأيمن ينقل للصورة السابقة
      showPrevImage();
    }
  });

  // 4. تعقب القسم النشط في شريط التنقل (Scroll Spy)
  const navLinks = document.querySelectorAll('.main-nav .nav-link');
  const monitoredSections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    monitoredSections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // 5. الكشف التدريجي السلس للعناصر التحريرية (Reveal on Scroll)
  if ('IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.content-section, .banner-strip, .featured-card, .sovereign-quote, .justice-card, .manifesto-point, .gallery-item, .callout-box'
    );

    revealTargets.forEach((el) => {
      el.classList.add('reveal-on-scroll');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealTargets.forEach((el) => observer.observe(el));
  }
});

