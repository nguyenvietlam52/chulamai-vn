# Technical SEO Verify + Blog Publish — 2026-05-11

_Date: 2026-05-11 10:10 Asia/Saigon_

## 0) Verify lời cảnh báo “modified hôm nay = 0”

Kiểm tra trực tiếp qua WP REST/API cho thấy sáng nay có thay đổi trên WordPress.

### Recent active snippets modified today

```text
122 SEO CTR Fix — Tour chủ lực + Tứ Bình + Xe giường nằm (2026-05-11) active True modified 2026-05-11 02:18:55
123 SEO Hygiene Noindex — Utility Pages (2026-05-11) active True modified 2026-05-11 01:47:16
124 SEO CTR Fix — Vinh Hy Binh Lap 2N1D (2026-05-11) active True modified 2026-05-11 02:21:27
125 SEO CTR Fix — Tour Săn Bắn Cá Bình Hưng (2026-05-11) active True modified 2026-05-11 02:53:38
126 SEO CTR Fix — Location Archives (2026-05-11) active True modified 2026-05-11 02:53:26
127 SEO Meta + Schema — Cach Di Cam Ranh Tu Sai Gon (2026-05-11) active True modified 2026-05-11
```

### Recent to_book modified today

```text
1368 2026-05-11T09:51:53 /booking/tour-san-ban-ca-dao-binh-hung-trong-ngay/
1290 2026-05-11T09:21:23 /booking/tour-vinh-hy-binh-lap-2-ngay-1-dem/
1238 2026-05-11T09:18:49 /booking/tour-tu-binh-cam-ranh/
1476 2026-05-11T08:48:21 /booking/tour-vinh-hy-2-ngay-1-dem/
1187 2026-05-11T07:49:47 /booking/tour-dao-binh-ba-2-ngay-1-dem/
1231 2026-05-11T07:21:55 /booking/tour-dao-binh-hung-2-ngay-1-dem/
```

=> Cron verify có thể đang check sai endpoint, sai timezone, hoặc không tính Code Snippets/to_book modified.

## 1) Published blog đang dở

Nguồn file WP-ready:

`seo-workflow/content/blog-cach-di-cam-ranh-tu-sai-gon.md`

Published:

- WP post ID: `2050`
- URL: `https://chulam.vn/cach-di-cam-ranh-tu-sai-gon/`
- Category: `Kinh Nghiệm Du Lịch`

Fix khi publish:

- Chuẩn hóa internal links sang `/booking/...` đúng URL tour.
- Giữ nội dung theo keyword `cách đi Cam Ranh từ Sài Gòn`, `xe giường nằm Sài Gòn Cam Ranh`.

## 2) Applied meta/schema cho blog mới

Tạo active Code Snippet:

- Snippet ID: `127`
- Name: `SEO Meta + Schema — Cach Di Cam Ranh Tu Sai Gon (2026-05-11)`

Public verify:

```text
URL: https://chulam.vn/cach-di-cam-ranh-tu-sai-gon/
status: 200
title: Cách Đi Cam Ranh Từ Sài Gòn 2026: Xe Giường Nằm, Máy Bay, Tàu | Tour Chú Lãm
desc_count: 1
desc: Cách đi Cam Ranh từ Sài Gòn 2026 bằng xe giường nằm, máy bay, tàu hỏa. So sánh thời gian, chi phí và cách nối tour đảo Cam Ranh.
schema_count: 2
schema types: Article, FAQPage
internal booking links: True
```

## 3) Technical SEO verify tour trọng điểm

Curl/public HTML verification:

| URL | Status | Desc count | Schema types |
|---|---:|---:|---|
| `/booking/tour-dao-binh-ba-2-ngay-1-dem/` | 200 | 1 | TouristTrip, FAQPage, BreadcrumbList, Product |
| `/booking/tour-dao-binh-hung-2-ngay-1-dem/` | 200 | 1 | TouristTrip, FAQPage, BreadcrumbList, Product |
| `/booking/tour-binh-hung-vinh-hy-2-ngay-1-dem/` | 200 | 1 | TouristTrip, FAQPage, BreadcrumbList, TravelAgency, Product |
| `/booking/tour-vinh-hy-2-ngay-1-dem/` | 200 | 1 | TouristTrip, FAQPage, BreadcrumbList, Product |
| `/booking/tour-tu-binh-cam-ranh/` | 200 | 1 | TouristTrip, FAQPage, Product |
| `/booking/tour-vinh-hy-binh-lap-2-ngay-1-dem/` | 200 | 1 | TouristTrip, FAQPage, BreadcrumbList, Product (có duplicate schema groups cũ, nhưng JSON-LD valid) |
| `/booking/tour-san-ban-ca-dao-binh-hung-trong-ngay/` | 200 | 1 | TouristTrip, FAQPage, Product |
| `/cach-di-cam-ranh-tu-sai-gon/` | 200 | 1 | Article, FAQPage |

## 4) Curl verify commands cho anh chạy nhanh

```bash
curl -Ls https://chulam.vn/cach-di-cam-ranh-tu-sai-gon/ | grep -E '<title>|meta name="description"|application/ld\+json' | head -20
curl -Ls https://chulam.vn/booking/tour-dao-binh-hung-2-ngay-1-dem/ | grep -E '<title>|meta name="description"|application/ld\+json' | head -20
curl -Ls https://chulam.vn/booking/tour-dao-binh-ba-2-ngay-1-dem/ | grep -E '<title>|meta name="description"|application/ld\+json' | head -20
curl -Ls https://chulam.vn/booking/tour-vinh-hy-2-ngay-1-dem/ | grep -E '<title>|meta name="description"|application/ld\+json' | head -20
```

## 5) Notes / next technical issue

- `/booking/tour-vinh-hy-binh-lap-2-ngay-1-dem/` hiện desc count đã về 1, nhưng vẫn có duplicate schema groups cũ (`TouristTrip`, `FAQPage`, `BreadcrumbList` xuất hiện 2 nhóm). JSON-LD vẫn valid, nhưng nên merge/cleanup schema snippet cũ ở lượt sau để sạch hơn.
