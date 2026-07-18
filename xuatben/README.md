# Lệnh Xuất Bến — PHL (Phát Hoàng Long)

Web app chạy 100% trong trình duyệt: đọc ảnh CCCD khách → tự điền **Danh sách hành khách** (lệnh xuất bến) → xuất file Excel giữ nguyên định dạng gốc. **Ảnh không rời máy.**

## Dùng
1. Mở web (HTTPS) → kéo/thả ảnh CCCD (ưu tiên mặt trước có mã QR).
2. QR rõ → tự điền (nhãn QR). QR mờ → dòng viền đỏ (nhãn Tay) để gõ tay.
3. Kiểm tra bảng → **Xuất file Excel** → gửi Zalo (người dùng tự gửi).

## Kỹ thuật
- QR: `jsQR` (crop góc trên phải + upscale). Parse `id|CMND|tên|ddMMyyyy|giới|địa chỉ|ngày cấp`.
- Điền xlsx: `JSZip` + chỉnh XML trực tiếp (inlineStr) → **lossless**, giữ logo. Template: `assets/template.xlsx`.
- Offline: PWA (`sw.js` cache toàn bộ). Yêu cầu host **HTTPS**.
- Fallback OCR (Tesseract vie) là opt-in — thả `vendor/tesseract.min.js` để bật.

## Deploy
GitHub Pages: `bash deploy-ghpages.sh <git-remote-url>`
Hoặc copy toàn bộ thư mục lên bất kỳ static host có HTTPS.

## ⚠️ Bảo mật
Không commit/host kèm ảnh CCCD. `.gitignore` đã chặn `*.jpg`, `testimg/`, `out/`.
