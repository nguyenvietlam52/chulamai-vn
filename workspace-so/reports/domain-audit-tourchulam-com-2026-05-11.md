# Domain Audit — tourchulam.com

_Date: 2026-05-11 07:30 Asia/Saigon_

## Verify trạng thái

### DNS / HTTP

Kiểm tra local resolver:

```text
DOMAIN tourchulam.com
DNS_ERROR gaierror [Errno 8] nodename nor servname provided, or not known

DOMAIN www.tourchulam.com
DNS_ERROR gaierror [Errno 8] nodename nor servname provided, or not known
```

Kiểm tra HTTP/HTTPS:

```text
https://tourchulam.com/      -> curl: (6) Could not resolve host: tourchulam.com
https://www.tourchulam.com/  -> curl: (6) Could not resolve host: www.tourchulam.com
http://tourchulam.com/       -> curl: (6) Could not resolve host: tourchulam.com
http://www.tourchulam.com/   -> curl: (6) Could not resolve host: www.tourchulam.com
```

### WHOIS / registrar

WHOIS registry vẫn có domain:

```text
Domain Name: TOURCHULAM.COM
Registry Domain ID: 3062802786_DOMAIN_COM-VRSN
Registrar: Spaceship, Inc.
Updated Date: 2026-01-30T08:45:34Z
Creation Date: 2026-01-30T08:45:27Z
Registry Expiry Date: 2027-01-30T08:45:27Z
Domain Status: clientTransferProhibited
Name Server: LAUNCH1.SPACESHIP.NET
Name Server: LAUNCH2.SPACESHIP.NET
DNSSEC: signedDelegation
```

## Kết luận quyền kiểm soát

- Bằng chứng cho thấy domain **còn được đăng ký** đến 2027-01-30 tại Spaceship.
- Nhưng DNS hiện **không resolve** cho cả root và www.
- Từ máy này chưa có bằng chứng đăng nhập/quyền quản trị registrar, nên **chưa thể xác nhận đang còn quyền kiểm soát**.
- Nếu chú Lãm/team có tài khoản Spaceship quản lý domain này: có thể khôi phục DNS và làm 301.
- Nếu không có quyền: xem phần phương án thay thế bên dưới.

## Map 301 đề xuất nếu còn quyền kiểm soát

Ưu tiên map các URL cũ còn xuất hiện trong search/footprint sang URL mới tương ứng trên chulam.vn.

| Old URL | New URL |
|---|---|
| `https://tourchulam.com/` | `https://chulam.vn/` |
| `https://www.tourchulam.com/` | `https://chulam.vn/` |
| `https://tourchulam.com/tour-binh-hung` | `https://chulam.vn/booking/tour-dao-binh-hung-2-ngay-1-dem/` |
| `https://www.tourchulam.com/tour-binh-hung` | `https://chulam.vn/booking/tour-dao-binh-hung-2-ngay-1-dem/` |
| `https://tourchulam.com/tour-binh-ba` | `https://chulam.vn/booking/tour-dao-binh-ba-2-ngay-1-dem/` |
| `https://tourchulam.com/tour-binh-ba-2-ngay-1-dem` | `https://chulam.vn/booking/tour-dao-binh-ba-2-ngay-1-dem/` |
| `https://tourchulam.com/tour-vinh-hy` | `https://chulam.vn/booking/tour-vinh-hy-2-ngay-1-dem/` |
| `https://tourchulam.com/tour-vinh-hy-2-ngay-1-dem` | `https://chulam.vn/booking/tour-vinh-hy-2-ngay-1-dem/` |
| `https://tourchulam.com/tour-tu-binh` | `https://chulam.vn/booking/tour-tu-binh-cam-ranh/` |
| `https://tourchulam.com/tour-tu-binh-cam-ranh` | `https://chulam.vn/booking/tour-tu-binh-cam-ranh/` |
| `https://tourchulam.com/tour-binh-lap` | `https://chulam.vn/booking/tour-vinh-hy-binh-lap-2n1d/` |
| `https://tourchulam.com/tour-hon-rua-vinh-hy` | `https://chulam.vn/booking/tour-hon-rua-vinh-hy-trong-ngay/` |
| `https://tourchulam.com/tour-ninh-van-ganh-nhay` | `https://chulam.vn/booking/tour-ninh-van-ganh-nhay-2-ngay-1-dem/` |
| `https://tourchulam.com/xe-giuong-nam` | `https://chulam.vn/xe-giuong-nam/` |
| Any unmatched path | `https://chulam.vn/` or closest relevant tour/category page |

## Cách triển khai nếu còn quyền

1. Đăng nhập Spaceship, kiểm tra DNSSEC. Vì WHOIS báo `DNSSEC: signedDelegation`, nếu DNS bị cấu hình sai, có thể cần tắt DNSSEC hoặc cấu hình đúng DS/NS.
2. Trỏ `tourchulam.com` và `www.tourchulam.com` về Cloudflare/hosting có rule redirect.
3. Tạo 301 redirects theo bảng trên.
4. Verify bằng:
   - `curl -I https://tourchulam.com/tour-binh-hung`
   - kỳ vọng: `HTTP/2 301` + `location: https://chulam.vn/booking/tour-dao-binh-hung-2-ngay-1-dem/`
5. Nếu có GSC property domain cũ: submit recrawl/change signals.

## Phương án thay thế nếu không còn quyền

- Không thể reclaim link equity bằng 301 nếu không kiểm soát domain.
- Làm link reclamation thủ công:
  1. Liên hệ Vinh Gấu xin cập nhật mention/link sang `chulam.vn`.
  2. Sửa các blogspot/forum/profile nào team còn quyền đăng nhập.
  3. Đảm bảo Instagram/TikTok/Facebook/YouTube bio đều trỏ về `https://chulam.vn/` hoặc landing page phù hợp.
  4. Tạo 3–5 backlink/citation mới theo `backlink-prospect-plan-2026-05-10.md` để bù tín hiệu domain cũ.
