# CTR Title/Meta Applied — Location Archives

_Date: 2026-05-11 09:55 Asia/Saigon_

## Vì sao chọn

GSC page query 28 ngày cho thấy 2 location archive có vị trí khá tốt nhưng CTR thấp và trước đó không có meta description:

| URL | Clicks | Impr | CTR | Pos | Trạng thái cũ |
|---|---:|---:|---:|---:|---|
| `/location/dao-binh-hung/` | 2 | 87 | 2.3% | 3.1 | Title generic, no meta description |
| `/location/vinh-vinh-hy/` | 2 | 121 | 1.7% | 5.8 | Title generic, no meta description |

Hai URL này là taxonomy/location archive, có thể dùng như hub tour theo địa danh nên không noindex. Tối ưu title/meta để kéo CTR và điều hướng đúng intent tour.

## Đã áp dụng

1. Update term description qua WP REST:
   - `location` ID `109` — Đảo Bình Hưng
   - `location` ID `106` — Vịnh Vĩnh Hy
2. Tạo active Code Snippet ID `126`: `SEO CTR Fix — Location Archives (2026-05-11)`.
3. Snippet ép public title/meta cho 2 taxonomy archives và đảm bảo chỉ còn 1 meta description.

## 1) Location Đảo Bình Hưng

URL: `https://chulam.vn/location/dao-binh-hung/`

### Title mới

```text
Tour Đảo Bình Hưng 2N1Đ – BBQ Tôm Hùm, Vĩnh Hy | Tour Chú Lãm
```

### Meta description mới

```text
Tổng hợp tour đảo Bình Hưng 2N1Đ từ Sài Gòn/Cam Ranh: Bãi Kinh, BBQ tôm hùm, Vĩnh Hy, lịch gọn cuối tuần. Zalo 0917.999.832.
```

### Verify public HTML

```text
status: 200
title: Tour Đảo Bình Hưng 2N1Đ – BBQ Tôm Hùm, Vĩnh Hy | Tour Chú Lãm
desc: Tổng hợp tour đảo Bình Hưng 2N1Đ từ Sài Gòn/Cam Ranh: Bãi Kinh, BBQ tôm hùm, Vĩnh Hy, lịch gọn cuối tuần. Zalo 0917.999.832.
desc count: 1
```

## 2) Location Vịnh Vĩnh Hy

URL: `https://chulam.vn/location/vinh-vinh-hy/`

### Title mới

```text
Tour Vĩnh Hy 1NĐ–2N1Đ – Hòn Rùa, Hang Rái, BBQ Tôm Hùm | Tour Chú Lãm
```

### Meta description mới

```text
Tổng hợp tour Vĩnh Hy: cano Hòn Rùa, Hang Rái, resort, BBQ tôm hùm, lịch trong ngày hoặc 2N1Đ. Tư vấn Zalo 0917.999.832.
```

### Verify public HTML

```text
status: 200
title: Tour Vĩnh Hy 1NĐ–2N1Đ – Hòn Rùa, Hang Rái, BBQ Tôm Hùm | Tour Chú Lãm
desc: Tổng hợp tour Vĩnh Hy: cano Hòn Rùa, Hang Rái, resort, BBQ tôm hùm, lịch trong ngày hoặc 2N1Đ. Tư vấn Zalo 0917.999.832.
desc count: 1
```

## Theo dõi

- Mục tiêu CTR:
  - `/location/dao-binh-hung/`: 2.3% → 5%+
  - `/location/vinh-vinh-hy/`: 1.7% → 4%+
- Recheck GSC sau 2–4 tuần.
