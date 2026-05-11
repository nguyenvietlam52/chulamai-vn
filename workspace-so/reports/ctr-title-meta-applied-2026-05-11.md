# CTR Title/Meta Applied — chulam.vn

_Date: 2026-05-11 07:35 Asia/Saigon_

Nguồn ưu tiên: GSC snapshot 2026-05-10 cho thấy 2 URL có impression cao nhưng CTR thấp:

- `/booking/tour-dao-binh-hung-2-ngay-1-dem/`: 1716 impressions, CTR 3.6%, position 7.1.
- `/xe-giuong-nam/`: 2382 impressions, CTR 2.4%, position 7.2.

Đã áp dụng bằng WordPress REST:

- Update post title/excerpt:
  - `to_book` ID `1231`
  - `page` ID `1754`
- Tạo active Code Snippet ID `122`: `SEO CTR Fix — Bình Hưng + Xe giường nằm (2026-05-11)` để đảm bảo public `<title>` và `<meta name="description">` output đúng, vì trang tour Bình Hưng đang bị snippet SEO master cũ override.

## 1) Trang Bình Hưng 2N1Đ

URL: `https://chulam.vn/booking/tour-dao-binh-hung-2-ngay-1-dem/`  
WP object: `to_book` ID `1231`

### Title mới

```text
Tour Đảo Bình Hưng 2N1Đ từ 1.650K – BBQ Tôm Hùm, Vĩnh Hy | Tour Chú Lãm
```

### Meta description mới

```text
Tour đảo Bình Hưng 2 ngày 1 đêm từ 1.650K: BBQ tôm hùm, tàu/cano tham quan Vĩnh Hy, lịch gọn cuối tuần. Zalo 0917.999.832.
```

### Intent xử lý

- Giữ keyword chính `tour đảo Bình Hưng 2 ngày 1 đêm`.
- Nêu giá thật `1.650K`.
- Nêu điểm khác biệt thực tế: BBQ tôm hùm, tàu/cano, Vĩnh Hy, lịch cuối tuần.
- Tránh clickbait; không hứa quá mức.

### Verify public HTML

```text
status: 200
title: Tour Đảo Bình Hưng 2N1Đ từ 1.650K – BBQ Tôm Hùm, Vĩnh Hy | Tour Chú Lãm
desc: Tour đảo Bình Hưng 2 ngày 1 đêm từ 1.650K: BBQ tôm hùm, tàu/cano tham quan Vĩnh Hy, lịch gọn cuối tuần. Zalo 0917.999.832.
desc count: 1
```

## 2) Trang xe giường nằm

URL: `https://chulam.vn/xe-giuong-nam/`  
WP object: `page` ID `1754`

### Title mới

```text
Xe Giường Nằm Sài Gòn Cam Ranh – Đi Bình Hưng, Vĩnh Hy | Tour Chú Lãm
```

### Meta description mới

```text
Xe giường nằm Sài Gòn – Cam Ranh/Vĩnh Hy đi tour Bình Hưng, Bình Ba. Tư vấn giờ xe, điểm đón, nối tour thuận tiện: 0917.999.832.
```

### Intent xử lý

- Match intent `xe giường nằm Sài Gòn Cam Ranh`, thêm tour-context `Bình Hưng, Vĩnh Hy`.
- Nêu đúng pain point: giờ xe, điểm đón, nối tour.
- Không clickbait; CTA bằng hotline/Zalo.

### Verify public HTML

```text
status: 200
title: Xe Giường Nằm Sài Gòn Cam Ranh – Đi Bình Hưng, Vĩnh Hy | Tour Chú Lãm
desc: Xe giường nằm Sài Gòn – Cam Ranh/Vĩnh Hy đi tour Bình Hưng, Bình Ba. Tư vấn giờ xe, điểm đón, nối tour thuận tiện: 0917.999.832.
desc count: 1
```

## Theo dõi sau triển khai

- Check GSC sau 7–14 ngày.
- Mục tiêu CTR:
  - Bình Hưng 2N1Đ: 3.6% → 5%+
  - Xe giường nằm: 2.4% → 4%+
