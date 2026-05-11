# GSC Indexing + Internal Link Execution — chulam.vn

_Date: 2026-05-11 07:50 Asia/Saigon_

## 1) Sitemap resubmitted

Command/API: `node scripts/gsc-tool.mjs submit-sitemap https://chulam.vn/ https://chulam.vn/wp-sitemap.xml`

Result:

```text
✅ Sitemap submitted.
https://chulam.vn/wp-sitemap.xml — 2026-05-11T00:47:47.343Z — errors: 0, warnings: 0
https://chulam.vn/sitemap.xml — 2026-04-19T13:05:16.300Z — errors: 0, warnings: 0
```

## 2) GSC URL Inspection snapshot

| URL | GSC coverage | Verdict | Last crawl | Crawled as | Indexing state |
|---|---|---|---|---|---|
| `https://chulam.vn/tour-tu-sai-gon-di-cam-ranh/` | URL is unknown to Google | NEUTRAL | N/A | N/A | INDEXING_STATE_UNSPECIFIED |
| `https://chulam.vn/tour-binh-hung-vinh-hy-2-ngay-1-dem/` | URL is unknown to Google | NEUTRAL | N/A | N/A | INDEXING_STATE_UNSPECIFIED |
| `https://chulam.vn/kinh-nghiem-du-lich-ninh-van-ganh-nhay-2026-2/` | URL is unknown to Google | NEUTRAL | N/A | N/A | INDEXING_STATE_UNSPECIFIED |
| `https://chulam.vn/kinh-nghiem-du-lich-vinh-hy-binh-lap-2026/` | URL is unknown to Google | NEUTRAL | N/A | N/A | INDEXING_STATE_UNSPECIFIED |
| `https://chulam.vn/booking/tour-dao-binh-hung-2-ngay-1-dem/` | Submitted and indexed | PASS | 2026-05-07T10:56:25Z | MOBILE | INDEXING_ALLOWED |
| `https://chulam.vn/xe-giuong-nam/` | Submitted and indexed | PASS | 2026-04-24T10:20:55Z | MOBILE | N/A / allowed |

## 3) Action taken: internal links to landing page

Problem: new landing page and new cluster blogs are still unknown to Google right after publish.

Action: added a contextual internal-link block to 6 relevant blog posts, pointing to:

`https://chulam.vn/tour-tu-sai-gon-di-cam-ranh/`

Block added:

```html
<h2>Đi từ Sài Gòn đến Cam Ranh?</h2>
<p>Nếu bạn xuất phát từ Sài Gòn và muốn nối lịch xe đêm, điểm đón, tour biển đảo cho gọn, xem thêm: <a href="https://chulam.vn/tour-tu-sai-gon-di-cam-ranh/">tour từ Sài Gòn đi Cam Ranh</a>.</p>
```

Updated posts:

| Post ID | URL | Status |
|---:|---|---|
| 1998 | `https://chulam.vn/kinh-nghiem-du-lich-dao-binh-hung-2026-2/` | updated |
| 1999 | `https://chulam.vn/tour-binh-hung-vinh-hy-2-ngay-1-dem/` | updated |
| 2000 | `https://chulam.vn/vinh-hy-co-gi-choi-review-thuc-te/` | updated |
| 2001 | `https://chulam.vn/tour-binh-hung-vinh-hy-3-ngay-2-dem/` | updated |
| 2022 | `https://chulam.vn/kinh-nghiem-du-lich-vinh-hy-binh-lap-2026/` | updated |
| 2023 | `https://chulam.vn/so-sanh-tour-binh-lap-1-ngay-2n1d-3n2d/` | updated |

Public verify sample:

```text
https://chulam.vn/kinh-nghiem-du-lich-dao-binh-hung-2026-2/ 200 landing_link True
https://chulam.vn/tour-binh-hung-vinh-hy-2-ngay-1-dem/ 200 landing_link True
https://chulam.vn/kinh-nghiem-du-lich-vinh-hy-binh-lap-2026/ 200 landing_link True
```

## 4) Next check

- Re-inspect these unknown URLs in GSC after 24–72h.
- Watch whether new landing page appears in GSC page query rows within 7–14 days.
- If still unknown after 72h, add link from a higher-authority indexed page or homepage/tour hub.
