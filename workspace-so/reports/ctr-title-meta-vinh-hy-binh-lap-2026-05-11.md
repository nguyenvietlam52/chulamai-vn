# CTR Title/Meta Applied — Tour Vĩnh Hy Bình Lập 2N1Đ

_Date: 2026-05-11 09:20 Asia/Saigon_

## Vì sao chọn URL này

GSC page query 28 ngày còn một URL cũ/redirect có impression nhưng CTR thấp:

```text
/booking/tour-hon-rua-vinh-hy-sao-bien-bi...  clicks 6, impressions 206, CTR 2.9%, avg position 9.7
```

URL này redirect về trang tour hiện tại:

```text
https://chulam.vn/booking/tour-hon-rua-vinh-hy-sao-bien-binh-lap-dien-gio-dam-nai-2-ngay-1-dem/
-> https://chulam.vn/booking/tour-vinh-hy-binh-lap-2-ngay-1-dem/
```

Trang đích hiện tại cũng có vấn đề:

- Title cũ: `Tour Vĩnh Hy Bình Lập 2N1Đ 2.4M - Sao Biển Resort | Tour Chú Lãm`
- Meta cũ dùng hotline cũ `0939.999.832`.
- Public HTML có 2 meta description (`desc count 2`).

## Đã áp dụng

WP object:

- Type: `to_book`
- ID: `1290`
- URL: `https://chulam.vn/booking/tour-vinh-hy-binh-lap-2-ngay-1-dem/`

Actions:

1. Update WP title/excerpt qua REST API.
2. Tạo active Code Snippet ID `124`: `SEO CTR Fix — Vinh Hy Binh Lap 2N1D (2026-05-11)`.
3. Snippet ép public `<title>`, xoá duplicate meta description và output đúng 1 meta description.

## Title/meta mới

### Title

```text
Tour Vĩnh Hy Bình Lập 2N1Đ từ 2.4M – Hòn Rùa, Sao Biển | Tour Chú Lãm
```

### Meta description

```text
Tour Vĩnh Hy Bình Lập 2 ngày 1 đêm từ 2.4M: Hòn Rùa, resort Sao Biển, BBQ tôm hùm, Hang Rái. Tư vấn Zalo 0917.999.832.
```

## Intent xử lý

- Giữ keyword chính: `Tour Vĩnh Hy Bình Lập 2N1Đ`.
- Nêu giá từ `2.4M` rõ ràng.
- Nêu điểm kéo click thực tế: Hòn Rùa, Sao Biển, BBQ tôm hùm, Hang Rái.
- Chuẩn hóa hotline mới `0917.999.832`.
- Không clickbait; chỉ nêu đúng trải nghiệm/tuyến.

## Verify public HTML

### URL chính

```text
URL: https://chulam.vn/booking/tour-vinh-hy-binh-lap-2-ngay-1-dem/
status: 200
title: Tour Vĩnh Hy Bình Lập 2N1Đ từ 2.4M – Hòn Rùa, Sao Biển | Tour Chú Lãm
desc: Tour Vĩnh Hy Bình Lập 2 ngày 1 đêm từ 2.4M: Hòn Rùa, resort Sao Biển, BBQ tôm hùm, Hang Rái. Tư vấn Zalo 0917.999.832.
desc count: 1
```

### URL cũ/redirect đang có impression

```text
URL: https://chulam.vn/booking/tour-hon-rua-vinh-hy-sao-bien-binh-lap-dien-gio-dam-nai-2-ngay-1-dem/
redirects to: https://chulam.vn/booking/tour-vinh-hy-binh-lap-2-ngay-1-dem/
status: 200
title: Tour Vĩnh Hy Bình Lập 2N1Đ từ 2.4M – Hòn Rùa, Sao Biển | Tour Chú Lãm
desc: Tour Vĩnh Hy Bình Lập 2 ngày 1 đêm từ 2.4M: Hòn Rùa, resort Sao Biển, BBQ tôm hùm, Hang Rái. Tư vấn Zalo 0917.999.832.
desc count: 1
```

## Theo dõi

- GSC CTR target: 2.9% → 5%+ trong 2–4 tuần.
- Theo dõi cả URL cũ/redirect và URL canonical mới.
