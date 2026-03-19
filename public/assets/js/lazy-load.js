/**
 * MindGuard - Lazy Loading & Performance Optimization
 * Optimizes image loading and scroll animations
 */

// Lazy Load Images
const lazyLoadImages = () => {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Load the image
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        // Load srcset for responsive images
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        
        // Add loaded class for fade-in effect
        img.classList.add('loaded');
        
        // Stop observing this image
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px', // Start loading 50px before image enters viewport
    threshold: 0.01
  });

  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
};

// Scroll Animations
const animateOnScroll = () => {
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // Observe elements with animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach(element => {
    animationObserver.observe(element);
  });
};

// Navbar scroll effect
const handleNavbarScroll = () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide navbar on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 500) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });
};

// Smooth scroll for anchor links
const smoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just '#'
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// Preload critical resources
const preloadResources = () => {
  // Preload fonts
  const fonts = [
    '/assets/fonts/inter-regular.woff2',
    '/assets/fonts/inter-bold.woff2'
  ];

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = font;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Defer non-critical CSS
const deferStyles = () => {
  const deferredStyles = document.querySelectorAll('link[rel="stylesheet"][media="print"]');
  
  deferredStyles.forEach(link => {
    link.onload = function() {
      this.media = 'all';
    };
  });
};

// Performance monitoring
const logPerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        console.log('🚀 Performance Metrics:');
        console.log(`Page Load Time: ${pageLoadTime}ms`);
        console.log(`Server Response: ${connectTime}ms`);
        console.log(`Render Time: ${renderTime}ms`);

        // Send to analytics (optional)
        if (window.gtag) {
          gtag('event', 'timing_complete', {
            name: 'page_load',
            value: pageLoadTime,
            event_category: 'Performance'
          });
        }
      }, 0);
    });
  }
};

// Service Worker registration (for PWA)
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('✅ Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('❌ Service Worker registration failed:', error);
        });
    });
  }
};

// Optimize third-party scripts
const loadScriptsAsync = () => {
  // Load Google Analytics asynchronously
  const gaScript = document.querySelector('script[src*="googletagmanager"]');
  if (gaScript) {
    gaScript.async = true;
    gaScript.defer = true;
  }
};

// Image optimization helper
const optimizeImages = () => {
  // Convert images to WebP if supported
  const supportsWebP = () => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  };

  if (supportsWebP()) {
    document.documentElement.classList.add('webp');
  } else {
    document.documentElement.classList.add('no-webp');
  }
};

// Initialize all optimizations
const initOptimizations = () => {
  // Core features
  lazyLoadImages();
  animateOnScroll();
  smoothScroll();
  
  // Performance features
  deferStyles();
  optimizeImages();
  loadScriptsAsync();
  
  // Optional features
  if (window.location.pathname === '/') {
    handleNavbarScroll();
  }
  
  // Development only
  if (window.location.hostname === 'localhost') {
    logPerformance();
  }
  
  // PWA features (production only)
  if (window.location.protocol === 'https:') {
    registerServiceWorker();
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOptimizations);
} else {
  initOptimizations();
}

// Export for use in other scripts
window.MindGuardOptimizations = {
  lazyLoadImages,
  animateOnScroll,
  smoothScroll
};
