const CACHE_VERSION = 'v1';
const CACHE_NAME = `smart-creator-${CACHE_VERSION}`;
const RUNTIME_CACHE = `smart-creator-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `smart-creator-images-${CACHE_VERSION}`;

// الملفات الأساسية المطلوبة للعمل بدون إنترنت
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/sw.js'
];

// ============================================
// تثبيت Service Worker
// ============================================
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        console.log('[Service Worker] Caching essential files');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('[Service Worker] Cache install error:', err);
        });
      }),
      caches.open(RUNTIME_CACHE),
      caches.open(IMAGE_CACHE)
    ])
  );
  
  self.skipWaiting();
});

// ============================================
// تفعيل Service Worker
// ============================================
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // حذف الـ caches القديمة
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== RUNTIME_CACHE &&
            cacheName !== IMAGE_CACHE
          ) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// ============================================
// معالجة الطلبات (Fetch Event)
// ============================================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل الطلبات غير GET
  if (request.method !== 'GET') {
    return;
  }

  // استراتيجية مختلفة حسب نوع الملف
  
  // 1. طلبات API - Network First مع Offline Fallback
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // 2. الصور - Cache First مع Network Fallback
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // 3. الملفات الثابتة (HTML, CSS, JS) - Cache First
  if (
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.json') ||
    url.pathname === '/'
  ) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  // 4. الملفات الأخرى - Network First
  event.respondWith(networkFirstStrategy(request));
});

// ============================================
// استراتيجية Cache First
// ============================================
async function cacheFirstStrategy(request, cacheName) {
  try {
    // ابحث في الـ cache أولاً
    const cached = await caches.match(request);
    if (cached) {
      console.log('[Service Worker] Cache hit:', request.url);
      return cached;
    }

    // إذا لم يكن في الـ cache، احصل عليه من الشبكة
    const response = await fetch(request);
    
    // احفظ الرد في الـ cache
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error('[Service Worker] Cache first error:', error);
    
    // إذا فشلت الشبكة والـ cache، أرجع صفحة بديلة
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // أرجع صفحة بديلة للتطبيق
    return caches.match('/index.html').then(response => {
      return response || new Response('Offline - Please check your connection', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain; charset=utf-8'
        })
      });
    });
  }
}

// ============================================
// استراتيجية Network First
// ============================================
async function networkFirstStrategy(request) {
  try {
    // حاول الحصول على الرد من الشبكة أولاً
    const response = await fetch(request);
    
    // احفظ الرد في الـ cache للاستخدام لاحقاً
    if (response && response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.warn('[Service Worker] Network error, trying cache:', request.url);
    
    // إذا فشلت الشبكة، حاول الـ cache
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // إذا كان طلب API، أرجع خطأ JSON
    if (request.url.includes('/api/')) {
      return new Response(
        JSON.stringify({
          error: 'Offline - Unable to reach server',
          status: 'offline'
        }),
        {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        }
      );
    }

    // للملفات الأخرى، أرجع الصفحة الرئيسية
    return caches.match('/index.html').then(response => {
      return response || new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    });
  }
}

// ============================================
// معالجة الرسائل من العميل
// ============================================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
  }
});

// ============================================
// معالجة الإشعارات
// ============================================
self.addEventListener('push', event => {
  if (!event.data) return;

  const options = {
    body: event.data.text(),
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'smart-creator-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Smart Creator', options)
  );
});

// ============================================
// معالجة نقرات الإشعارات
// ============================================
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // ابحث عن نافذة مفتوحة بالفعل
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // إذا لم تكن هناك نافذة مفتوحة، افتح واحدة جديدة
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

console.log('[Service Worker] Loaded successfully');
