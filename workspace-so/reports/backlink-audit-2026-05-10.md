# Backlink Audit — chulam.vn

Ngày audit: 2026-05-10 15:50 (Asia/Saigon)  
Phạm vi: audit nhanh từ search footprint công khai + brand/phone mentions. Không có Ahrefs/Semrush/Majestic nên đây là bản thực dụng để ưu tiên hành động.

## Tóm tắt

- Brand có footprint xã hội: Instagram `@chulam.vn`, TikTok `@chulam.vn`.
- Có dấu vết domain cũ `tourchulam.com` trên Google/Brave, nhưng hiện fetch lỗi DNS (`ENOTFOUND`). Đây là vấn đề quan trọng: nếu domain cũ từng có backlink/brand signal mà đang chết DNS thì đang mất link equity và mất referral.
- Có ít nhất một backlink/mention chất lượng từ blog du lịch cũ: `vinhgau.com` nhắc chú Lãm + số điện thoại trong bài Bình Hưng.
- Có một số mention/forum/blogspot cũ chất lượng thấp/trung bình; nên khai thác bằng cách yêu cầu sửa link sang `chulam.vn` nếu còn quản trị được.

## Backlink / mention tìm thấy

| Nguồn | URL | Loại | Trạng thái | Nhận xét |
|---|---|---|---|---|
| Instagram | `https://www.instagram.com/chulam.vn/` | Social profile | Indexed | Nên đảm bảo bio có link `https://chulam.vn/` và link tour chủ lực nếu IG cho phép. |
| TikTok | `https://www.tiktok.com/@chulam.vn` | Social profile | Indexed | Nên dùng bio link về landing/tour chính. Tốt cho branded search + video SEO. |
| Vinh Gấu | `https://vinhgau.com/blog/dao-binh-hung-danh-ca-cuoi-tuan-de-kham-pha/` | Editorial/blog mention | Live 200 | Mention số `093.9999.832`, ngữ cảnh Bình Hưng. Nên outreach xin cập nhật link về `https://chulam.vn/booking/tour-dao-binh-hung-2-ngay-1-dem/`. |
| Địa Điểm Ăn Uống forum | `http://forum.diadiemanuong.com/home/f48/chi-2tr-di-choi-het-canh-dep-cam-ranh-voi-tour-tu-binh-chu-lam-956597/` | Forum/review cũ | Search result only | Có thể khó sửa, nhưng nếu còn live thì là mention lịch sử tốt. |
| Blogspot | `https://mynewtourdulich.blogspot.com/` | Blogspot/low authority | Live 200 | Có link về `tourchulam.com/tour-binh-hung`, nên nếu quản trị được cần đổi sang `chulam.vn`. |
| Domain cũ | `https://tourchulam.com/`, `https://tourchulam.com/tour-binh-hung` | Owned/old domain | DNS lỗi | Ưu tiên cao: khôi phục DNS + 301 toàn domain sang `https://chulam.vn/`. |

## Rủi ro / vấn đề

### 1. Domain cũ `tourchulam.com` đang lỗi DNS

Search vẫn thấy nhiều kết quả `tourchulam.com`, ví dụ homepage và `/tour-binh-hung`, nhưng truy cập hiện lỗi `getaddrinfo ENOTFOUND`.

Tác động:
- Mất backlink equity từ các bài cũ đang trỏ về `tourchulam.com`.
- Người dùng click kết quả cũ bị lỗi.
- Google thấy domain cũ chết, không truyền tín hiệu sang domain mới.

Khuyến nghị:
1. Kiểm tra quyền sở hữu domain `tourchulam.com`.
2. Nếu còn sở hữu: trỏ DNS về hosting/Cloudflare.
3. Thiết lập 301 toàn bộ URL cũ sang URL mới tương ứng:
   - `/` → `https://chulam.vn/`
   - `/tour-binh-hung` → `https://chulam.vn/booking/tour-dao-binh-hung-2-ngay-1-dem/`
   - các URL còn lại → trang tour/category gần nhất.
4. Submit change/recrawl trong GSC nếu có property cũ.

### 2. Backlink hiện tại thiên về brand/social, thiếu editorial link mới

Các link/mention tìm được chủ yếu là social hoặc nội dung cũ. Để tăng authority cho mục tiêu Top 5, cần thêm backlink ngữ cảnh từ travel/blog/local directory.

## Outreach ưu tiên

### Ưu tiên 1 — reclaim link cũ

- Vinh Gấu: xin cập nhật đoạn nhắc chú Lãm thành link về bài/tour Bình Hưng hiện tại.
- Blogspot nếu có quyền: đổi link `tourchulam.com/tour-binh-hung` sang `chulam.vn/booking/tour-dao-binh-hung-2-ngay-1-dem/`.
- Domain cũ `tourchulam.com`: khôi phục 301 là đòn mạnh nhất nếu còn sở hữu.

### Ưu tiên 2 — backlink mới chất lượng

Danh sách mục tiêu phù hợp:
- Blog du lịch Việt Nam: mia.vn, traveloka blog/community, ivivu blog, vntrip blog, luhanhvietnam, halotravel.
- Local/citation: Google Business Profile, Tripadvisor/OTA profile, Facebook page/about, TikTok/Instagram bio, YouTube channel.
- Nội dung guest post nên trỏ về cluster mới:
  - Bình Hưng/Vĩnh Hy 2N1Đ
  - Hòn Rùa Vĩnh Hy
  - Ninh Vân Gành Nhảy

## Anchor text đề xuất

Không dùng 100% exact-match; mix tự nhiên:

- Branded: `Tour Chú Lãm`, `Chú Lãm Cam Ranh`, `tourchulam`
- Partial match: `tour Bình Hưng Vĩnh Hy`, `tour đảo Bình Hưng 2 ngày 1 đêm`, `tour Hòn Rùa Vĩnh Hy`
- URL/naked: `chulam.vn`
- Generic/context: `xem lịch trình tour`, `đặt tour địa phương Cam Ranh`

## Action checklist

- [ ] Kiểm tra/quyền sở hữu `tourchulam.com`.
- [ ] Nếu còn sở hữu: khôi phục DNS + 301 sang `chulam.vn`.
- [ ] Outreach Vinh Gấu xin thêm/cập nhật backlink về tour Bình Hưng.
- [ ] Audit và cập nhật bio link Instagram/TikTok.
- [ ] Tạo danh sách 10 mục tiêu guest post/citation cho tháng 5.
- [ ] Sau khi có 301/backlink mới: ghi chú trong GSC snapshot tuần kế tiếp.
