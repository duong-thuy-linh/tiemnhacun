const CACHE_NAME = 'tiemnhacun-v2'; // Đổi v1 thành v2 để trình duyệt nhận biết có sự thay đổi mới
const urlsToCache = [
  './',              // Dùng dấu chấm để hiểu là thư mục hiện tại
  './index.html',    // Đảm bảo file chính của bạn tên là index.html
  './manifest.json',
  './logo.jpg'       // QUAN TRỌNG: Phải có logo.jpg ở đây để icon hiện lên khi offline
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Trả về file từ cache nếu có, nếu không thì tải từ mạng
        return response || fetch(event.request);
      })
      .catch(() => {
        // Nếu mất mạng hoàn toàn, trả về trang index.html
        return caches.match('./index.html');
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
