# SEO Hygiene Noindex — Utility Pages

_Date: 2026-05-11 08:50 Asia/Saigon_

## Vì sao làm

GSC page query 28 ngày cho thấy một số URL tiện ích/confirmation không có intent SEO vẫn nhận impression nhỏ trong Google:

| URL | Clicks | Impr | CTR | Pos | Nhận xét |
|---|---:|---:|---:|---:|---|
| `/all-items/` | 0 | 10 | 0.0% | 2.6 | Trang listing kỹ thuật/không phải landing SEO |
| `/admin-confirmation/` | 0 | 1 | 0.0% | 10.0 | Trang admin/confirmation |
| `/checkout-3/` | 0 | 2 | 0.0% | 7.5 | Trang checkout |
| `/confirmation/` | 0 | 6 | 0.0% | 3.2 | Trang confirmation |
| `/customer-confirmation/` | 0 | 4 | 0.0% | 7.8 | Trang confirmation |
| `/add_services/` | 0 | 1 | 0.0% | 6.0 | Utility endpoint/page |

Các URL này không nên cạnh tranh crawl/index với các trang tour/blog chính. Chọn `noindex,follow` để Google bỏ index nhưng vẫn có thể follow link nếu có.

## Đã áp dụng

Tạo active WordPress Code Snippet:

- Snippet ID: `123`
- Name: `SEO Hygiene Noindex — Utility Pages (2026-05-11)`
- Action: output robots noindex/follow cho các slug utility.

Slug được noindex:

```text
all-items
admin-confirmation
checkout-3
confirmation
customer-confirmation
add_services
```

## Verify public HTML

Public fetch sau khi áp dụng:

```text
https://chulam.vn/all-items/ 200 robots: max-image-preview:large, noindex, follow + noindex,follow
https://chulam.vn/admin-confirmation/ 200 robots: max-image-preview:large, noindex, follow + noindex,follow
https://chulam.vn/checkout-3/ 200 robots: max-image-preview:large, noindex, follow + noindex,follow
https://chulam.vn/confirmation/ 200 robots: max-image-preview:large, noindex, follow + noindex,follow
https://chulam.vn/customer-confirmation/ 200 robots: max-image-preview:large, noindex, follow + noindex,follow
```

Note: Có 2 meta robots vì WordPress core/filter đã output `max-image-preview:large, noindex, follow`, snippet cũng output thêm `noindex,follow`. Cả hai cùng tín hiệu noindex/follow, không conflict.

## URL bị ảnh hưởng

- `https://chulam.vn/all-items/`
- `https://chulam.vn/admin-confirmation/`
- `https://chulam.vn/checkout-3/`
- `https://chulam.vn/confirmation/`
- `https://chulam.vn/customer-confirmation/`
- `https://chulam.vn/add_services/`

## Theo dõi

- Recheck GSC sau 1–3 tuần: các URL này nên chuyển sang trạng thái excluded/noindex và giảm/không còn impression.
- Không ảnh hưởng các trang tour/blog chính.
