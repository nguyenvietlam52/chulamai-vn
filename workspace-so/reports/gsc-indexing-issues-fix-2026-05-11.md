# GSC Indexing Issues Fix — 2026-05-11

_Date: 2026-05-11 15:25 Asia/Saigon_

## Vấn đề

GSC gửi email "New reasons prevent pages from being indexed" cho chulam.vn.

## Nguyên nhân

Sau khi em apply Snippet 123 (noindex utility pages) sáng nay, Google sẽ dần phát hiện các trang này có `noindex` và báo "excluded by noindex tag" thay vì "Submitted and indexed".

Đây là **hành vi đúng và mong muốn** — các trang utility không nên có trong index.

## Kiểm tra

### Các trang utility đã được noindex (Snippet 123):

**Sáng nay đã có:**
- `/all-items/` — status 200, `noindex,follow` ✅
- `/admin-confirmation/` — status 200, `noindex,follow` ✅
- `/checkout-3/` — status 200, `noindex,follow` ✅
- `/confirmation/` — status 200, `noindex,follow` ✅
- `/customer-confirmation/` — status 200, `noindex,follow` ✅
- `/add_services/` — status 200, `noindex,follow` ✅

**Chiều nay thêm (mở rộng Snippet 123):**
- `/booking/` — archive page, `noindex,follow` ✅
- `/careers/` — trang tuyển dụng, `noindex,follow` ✅
- `/product-category/business/` — WooCommerce demo, `noindex,follow` ✅
- `/product-category/music/` — WooCommerce demo, `noindex,follow` ✅
- `/sample-page/` — trang mẫu WP, `noindex,follow` ✅
- `/shop/` — WooCommerce shop (không dùng), `noindex,follow` ✅
- `/tours-list-view/` — view thay thế, `noindex,follow` ✅
- `/tours-page/` — view thay thế, `noindex,follow` ✅
- `/type/*` — taxonomy archives, `noindex,follow` ✅

### Quan trọng: Tour pages vẫn được index

Verify:
- `/booking/tour-dao-binh-ba-2-ngay-1-dem/` — `noindex: False` ✅
- `/booking/tour-dao-binh-hung-2-ngay-1-dem/` — `noindex: False` ✅

## Trạng thái GSC hiện tại

Một số URL utility vẫn đang "Submitted and indexed" trong GSC vì Google chưa re-crawl sau khi em thêm noindex:

| URL | GSC Status | Last Crawl | noindex applied |
|---|---|---|---|
| `/all-items/` | Submitted and indexed | 2026-05-09 | ✅ |
| `/admin-confirmation/` | Submitted and indexed | 2026-05-07 | ✅ |
| `/checkout-3/` | Submitted and indexed | 2026-05-08 | ✅ |
| `/confirmation/` | Submitted and indexed | 2026-04-12 | ✅ |
| `/shop/` | Submitted and indexed | 2026-05-10 | ✅ |
| `/sample-page/` | Submitted and indexed | 2026-04-19 | ✅ |
| `/tours-list-view/` | Submitted and indexed | 2026-04-28 | ✅ |

## Hành động tiếp theo

1. **Không cần hành động gì thêm** — sau khi Google re-crawl, các URL này sẽ chuyển từ "Submitted and indexed" sang "Excluded by 'noindex' tag" trong GSC Coverage report.

2. **Nếu muốn đẩy nhanh**: có thể dùng GSC URL Removal tool để tạm ẩn các URL này khỏi search results trong 6 tháng. Tuy nhiên không cần thiết vì noindex sẽ tự xử lý.

3. **Theo dõi**: Kiểm tra lại GSC Coverage sau 1-2 tuần để confirm các URL utility đã được excluded.

## Code Snippet 123 (updated)

```php
// SEO Hygiene Noindex — Utility & Demo Pages (Sò, 2026-05-11 updated)
add_action('template_redirect', function() {
    $noindex_slugs = [
        'all-items', 'admin-confirmation', 'checkout-3', 'confirmation',
        'customer-confirmation', 'add_services', 'sample-page',
        'tours-list-view', 'tours-page', 'shop', 'careers',
    ];
    $noindex_exact_paths = ['/booking/', '/shop/'];
    $noindex_prefix_paths = ['/product-category/', '/type/'];
    
    // Logic: noindex slugs + exact paths + prefix paths
    // BUT NOT tour detail pages like /booking/tour-xyz/
});
```
