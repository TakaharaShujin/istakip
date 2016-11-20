# İş takip sistemi
Node.js öğrenme/öğretme amacıyla yapılmış örnek bir uygulama.

## Kurulum (geliştirmek için)
### Gereksinimler:
* Git (https://git-scm.com/download/win)
* Node.js (https://nodejs.org/en/download/)
* Nodemon (npm install -g nodemon) - Geliştirmek için
* Redis (https://github.com/MSOpenTech/redis/releases)
* MongoDB (https://www.mongodb.com/download-center)

Github'dan proje indirilir:
```sh
git clone https://github.com/yasinaydin/istakip
```

Proje klasörünün içine girilir:
```sh
cd istakip
```

Gerekli NPM ve Bower modülleri kurulur:
```sh
npm install
```
Redis ve MongoDB bağlantı bilgileri ortam değişkeni olarak kaydedilir. Proje localde çalışıyorsa gerek yoktur. Örneğin:
```
process.env.REDIS_URL = 'redis://localhost:6379'
process.env.MONGODB_URI = 'mongodb://localhost/istakip'
```

Proje nodemon ile çalıştırılır:
```sh
nodemon
```
