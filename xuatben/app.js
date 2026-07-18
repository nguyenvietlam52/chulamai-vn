'use strict';
// ===== Lệnh Xuất Bến PHL — xử lý hoàn toàn trong trình duyệt =====
const FIRST_ROW = 15, MAX_ROWS = 50, SHEET = 'xl/worksheets/sheet1.xml';
const COLS = { name: 'C', dob: 'D', nationality: 'E', id: 'F' };

const $ = s => document.querySelector(s);
const rowsEl = $('#rows'), statusEl = $('#status');
let passengers = []; // {name,dob,nationality,id,src,thumb}

// ---------- CCCD QR parse ----------
// id|CMND cũ|họ tên|ddMMyyyy|giới tính|địa chỉ|ngày cấp
function parseCCCD(raw) {
  const p = String(raw || '').split('|').map(s => s.trim());
  if (p.length < 4 || !/^\d{9,12}$/.test(p[0])) return null;
  const dob = p[3] && /^\d{8}$/.test(p[3])
    ? `${p[3].slice(0,2)}/${p[3].slice(2,4)}/${p[3].slice(4)}` : (p[3] || '');
  return { id: p[0], name: p[2] || '', dob, nationality: 'Việt Nam', src: 'qr' };
}

// ---------- MRZ TD1 (mặt sau CCCD gắn chip) ----------
// Dòng 1: IDVNM<docno>...<12-số-định-danh><check>  Dòng 2: YYMMDD<c>Sex YYMMDD... VNM  Dòng 3: SURNAME<<GIVEN<NAMES
function parseMRZ(text) {
  const up = String(text || '').toUpperCase().replace(/[ \t]/g, '');
  const lines = up.split('\n').map(s => s.replace(/[^A-Z0-9<]/g, '')).filter(s => s.length >= 25 && /</.test(s));
  // tìm cụm 3 dòng bắt đầu bằng ID
  let i = lines.findIndex(l => /^ID[A-Z]{2,3}/.test(l));
  if (i < 0 || i + 2 >= lines.length) return null;
  const l1 = lines[i], l2 = lines[i + 1], l3 = lines[i + 2];
  // số định danh 12 số: cụm 12 số cuối cùng trong dòng 1
  const ids = l1.match(/\d{12}/g);
  const id = ids ? ids[ids.length - 1] : '';
  if (!/^\d{12}$/.test(id)) return null;
  // DOB: 6 số đầu dòng 2 = YYMMDD
  let dob = '';
  const m2 = l2.match(/^(\d{6})/);
  if (m2) {
    const yy = +m2[1].slice(0, 2), mm = m2[1].slice(2, 4), dd = m2[1].slice(4, 6);
    const cur = new Date().getFullYear() % 100;
    const year = yy > cur + 1 ? 1900 + yy : 2000 + yy;
    if (+mm >= 1 && +mm <= 12 && +dd >= 1 && +dd <= 31) dob = `${dd}/${mm}/${year}`;
  }
  // tên (KHÔNG DẤU) từ dòng 3: SURNAME<<GIVEN<PARTS
  let name = '';
  const parts = l3.split('<<');
  if (parts.length >= 2) {
    const sur = parts[0].replace(/</g, ' ').trim();
    const giv = parts.slice(1).join(' ').replace(/</g, ' ').replace(/\s+/g, ' ').trim();
    name = `${sur} ${giv}`.replace(/\s+/g, ' ').trim();
  }
  if (!id) return null;
  return { id, dob, name, nationality: 'Việt Nam', src: 'mrz' };
}

// ---------- Passport MRZ (TD3: 2 dòng × 44) — khách nước ngoài ----------
const NAT3 = { VNM:'Việt Nam', USA:'Hoa Kỳ', GBR:'Anh', KOR:'Hàn Quốc', CHN:'Trung Quốc', TWN:'Đài Loan', JPN:'Nhật Bản', THA:'Thái Lan', FRA:'Pháp', DEU:'Đức', RUS:'Nga', AUS:'Úc', CAN:'Canada', IND:'Ấn Độ', MYS:'Malaysia', SGP:'Singapore', IDN:'Indonesia', PHL:'Philippines', KHM:'Campuchia', LAO:'Lào', NLD:'Hà Lan', ITA:'Ý', ESP:'Tây Ban Nha', CHE:'Thụy Sĩ', SWE:'Thụy Điển', NZL:'New Zealand', HKG:'Hồng Kông' };
function parsePassportMRZ(text) {
  const up = String(text || '').toUpperCase();
  const lines = up.split('\n').map(s => s.replace(/[^A-Z0-9<]/g, '')).filter(s => s.length >= 30);
  // tìm dòng bắt đầu P< (hộ chiếu), dòng kế là dòng dữ liệu
  let i = lines.findIndex(l => /^P[A-Z<]?[A-Z]{3}/.test(l));
  if (i < 0 || i + 1 >= lines.length) return null;
  let l1 = lines[i], l2 = lines[i + 1];
  // chuẩn hoá về 44 ký tự
  const pad = s => (s + '<'.repeat(44)).slice(0, 44);
  l1 = pad(l1); l2 = pad(l2);
  const iss = l1.slice(2, 5).replace(/</g, '');
  // tên: sau P<XXX → SURNAME<<GIVEN
  const nameField = l1.slice(5).replace(/<<+/g, '#').replace(/</g, ' ');
  const [sur, giv] = nameField.split('#');
  const name = `${(sur||'').trim()} ${(giv||'').trim()}`.replace(/\s+/g, ' ').trim();
  // dòng 2: passport no (0-9), quốc tịch (10-13), dob (13-19), sex (20), expiry (21-27)
  const passNo = l2.slice(0, 9).replace(/</g, '').trim();
  const nat3 = l2.slice(10, 13).replace(/</g, '');
  const dobRaw = l2.slice(13, 19);
  const sex = l2.slice(20, 21);
  let dob = '';
  if (/^\d{6}$/.test(dobRaw)) {
    const yy=+dobRaw.slice(0,2), mm=dobRaw.slice(2,4), dd=dobRaw.slice(4,6);
    const cur=new Date().getFullYear()%100; const year=yy>cur+1?1900+yy:2000+yy;
    if (+mm>=1&&+mm<=12&&+dd>=1&&+dd<=31) dob=`${dd}/${mm}/${year}`;
  }
  if (!passNo || !name) return null;
  const nationality = NAT3[nat3] || NAT3[iss] || nat3 || iss || '';
  return { id: passNo, name, dob, nationality, sex: sex==='M'?'Nam':(sex==='F'?'Nữ':''), src: 'ocr', passport: true };
}

// ---------- canvas helpers ----------
function drawCanvas(img, scale = 1, crop = null, rot = 0) {
  const c = document.createElement('canvas');
  let sx = 0, sy = 0, sw = img.width, sh = img.height;
  if (crop) { sx = crop.x; sy = crop.y; sw = crop.w; sh = crop.h; }
  const dw = Math.round(sw * scale), dh = Math.round(sh * scale);
  const ctx = c.getContext('2d');
  if (rot === 90 || rot === 270) { c.width = dh; c.height = dw; } else { c.width = dw; c.height = dh; }
  ctx.save();
  if (rot === 90) { ctx.translate(dh, 0); ctx.rotate(Math.PI / 2); }
  else if (rot === 180) { ctx.translate(dw, dh); ctx.rotate(Math.PI); }
  else if (rot === 270) { ctx.translate(0, dw); ctx.rotate(-Math.PI / 2); }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
  ctx.restore();
  return c;
}
function makeThumb(img, w = 240) {
  const scale = Math.min(1, w / img.width);
  return drawCanvas(img, scale).toDataURL('image/jpeg', 0.7);
}

// ---------- QR: BarcodeDetector (mạnh) → jsQR, có xoay + nhiều mã ----------
let barcodeDetector = null;
if ('BarcodeDetector' in window) {
  try { barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] }); } catch {}
}
// trả về MẢNG passenger (1 ảnh có thể chứa nhiều thẻ)
// jsQR trên 1 vùng đã vẽ sẵn (không vẽ lại full-res nhiều lần — đó là nguồn chậm).
function jsqrData(d) {
  const r = jsQR(d.data, d.width, d.height, { inversionAttempts: 'attemptBoth' });
  return r && r.data ? r.data : null;
}
// QR bất biến với xoay → KHÔNG xoay. Chỉ: (1) toàn ảnh downscale, (2) crop góc phải-trên độ phân giải cao cho QR nhỏ.
async function tryQR(img) {
  const found = new Map();
  const add = raw => { const p = parseCCCD(raw); if (p && p.id) found.set(p.id, p); };
  // 1) toàn ảnh ở ~1100px (một lần vẽ)
  const s1 = Math.min(1, 1100 / Math.max(img.width, img.height));
  const c1 = drawCanvas(img, s1);
  let raw = jsqrData(c1.getContext('2d').getImageData(0, 0, c1.width, c1.height));
  if (raw) add(raw);
  // 2) chưa thấy → crop góc phải-trên (nơi QR nằm), downscale ~1200px cho QR nhỏ
  if (!found.size) {
    const cw = img.width * 0.5, ch = img.height * 0.55;
    const crop = { x: img.width * 0.5, y: 0, w: cw, h: ch };
    const cs = Math.min(1, 1200 / Math.max(cw, ch));
    const c2 = drawCanvas(img, cs, crop);
    raw = jsqrData(c2.getContext('2d').getImageData(0, 0, c2.width, c2.height));
    if (raw) add(raw);
  }
  // 3) vẫn trắng → BarcodeDetector native 1 lần (mạnh hơn jsQR), KHÔNG xoay, downscale 1600
  if (!found.size && barcodeDetector) {
    try {
      const s = Math.min(1, 1600 / Math.max(img.width, img.height));
      const codes = await barcodeDetector.detect(drawCanvas(img, s));
      codes.forEach(cd => add(cd.rawValue || ''));
    } catch {}
  }
  return [...found.values()];
}

function fileToImage(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

// ---------- OCR (Tesseract vie, offline, 1 worker dùng lại) ----------
let ocrWorker = null, ocrLoading = null;
async function getOcrWorker() {
  if (ocrWorker) return ocrWorker;
  if (ocrLoading) return ocrLoading;
  ocrLoading = (async () => {
    if (!('Tesseract' in window)) {
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'vendor/tesseract.min.js'; s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    ocrWorker = await Tesseract.createWorker('vie', 1, {
      workerPath: 'vendor/worker.min.js', corePath: 'vendor/', langPath: 'vendor/'
    });
    return ocrWorker;
  })();
  return ocrLoading;
}
async function ocrText(canvas) {
  const w = await getOcrWorker();
  const { data } = await w.recognize(canvas);
  return data.text || '';
}
// ---------- Parse theo NHÃN: VNeID screenshot + CCCD mặt trước (nhãn song ngữ) ----------
// Lấy tên CÓ DẤU + ngày sinh + số định danh chính xác hơn heuristic.
function parseFrontLabels(txt) {
  const T = String(txt || '').replace(/\u00a0/g, ' ');
  const lines = T.split('\n').map(s => s.replace(/\s{2,}/g, ' ').trim()).filter(Boolean);
  const flat = lines.join('\n');
  // id: 12 số hợp lệ (mã tỉnh 001-096), ưu tiên gần nhãn "định danh"/"No"
  let id = '';
  const idNear = flat.match(/(?:định danh|Personal Iden\w*|Số\s*\/?\s*No)[^\d]{0,40}(\d{12})/i);
  if (idNear) id = idNear[1];
  if (!id) for (const m of flat.match(/\b\d{12}\b/g) || []) { const pv = +m.slice(0,3); if (pv>=1 && pv<=96){ id=m; break; } }
  // ngày sinh: gần nhãn "sinh"/"birth"
  let dob = '';
  const dm = flat.match(/(?:sinh|birth)[\s\S]{0,40}?(\d{2})\s*[\/\-.]\s*(\d{2})\s*[\/\-.]\s*(\d{4})/i);
  if (dm) { const d=+dm[1],mo=+dm[2],y=+dm[3]; if(d>=1&&d<=31&&mo>=1&&mo<=12&&y>=1900&&y<=new Date().getFullYear()) dob=`${dm[1]}/${dm[2]}/${dm[3]}`; }
  // tên: quét TẤT CẢ dòng (không phụ thuộc nhãn OCR méo), lọc rác, ưu tiên dòng CÓ DẤU.
  // Ưu tiên dòng ngay sau nhãn "tên/name" nếu bắt được; nếu không, lấy dòng tên hợp lệ dài nhất.
  const NAME_HINT = /(tên|name|nam[eo])/i;
  let name = '', best = '', bestScore = -1;
  for (let i = 0; i < lines.length; i++) {
    const cand = cleanName(lines[i]);
    if (!isNameVal(cand)) continue;
    const hasDia = /[À-ỹ]/.test(cand);
    const nearLabel = i > 0 && NAME_HINT.test(lines[i-1]);
    // tên nằm phía TRÊN thẻ (địa chỉ ở dưới) → ưu tiên dòng gần đầu mạnh
    const score = (nearLabel?10:0) + (hasDia?3:0) + (lines.length - i) * 0.6;
    if (score > bestScore) { bestScore = score; best = cand; }
  }
  name = best;
  // quốc tịch: chỉ nhận Việt Nam hoặc tên nước hợp lệ (tránh rác OCR "Nabonalty")
  let nationality = '';
  const nat = flat.match(/(?:Quốc tịch|Nationality)[\s\S]{0,25}?([A-Za-zÀ-ỹ][A-Za-zÀ-ỹ\s]{2,20})/i);
  if (nat) {
    const v = nat[1].trim().replace(/\s{2,}/g,' ');
    if (/việt\s*nam/i.test(v)) nationality = 'Việt Nam';
    else if (Object.values(NAT3).some(c => c.toLowerCase() === v.toLowerCase())) nationality = v.replace(/\b\w/g,c=>c.toUpperCase());
  }
  const got = [id,dob,name].filter(Boolean).length;
  if (got < 2) return null; // quá ít → để heuristic khác lo
  return { id, dob, name, nationality: nationality || 'Việt Nam', src: 'ocr' };
}
const STOP_NAME = /CĂN CƯỚC|CÔNG DÂN|SOCIALIST|REPUBLIC|VIET NAM|VIỆT NAM|CITIZEN|IDENTITY|QUỐC TỊCH|NATIONALITY|HỌ|FULL NAME|CỘNG HÒA|CHỦ NGHĨA|NGHĨA|XÃ HỘI|HỘI CHỦ|HÒA XÃ|ĐỘC LẬP|TỰ DO|HẠNH PHÚC|BỘ CÔNG|ĐIỆN TỬ|PERSONAL|NGÀY|SINH|BIRTH|GIỚI TÍNH|DÂN TỘC|TÔN GIÁO|TRUNG TÂM|HÀNH CHÍNH|PHƯỜNG|QUẬN|THÀNH PHỐ|XÃ |TỈNH|ĐƯỜNG|KHU PHỐ|THƯỜNG TRÚ|TẠM TRÚ|QUÊ QUÁN|NƠI |RESIDENCE|ORIGIN/i;
function isNameVal(s) {
  s = cleanName(s);
  if (s.length < 6 || s.length > 36) return false;
  if (STOP_NAME.test(s)) return false;
  if (!/^[A-ZÀ-Ỹ][A-ZÀ-Ỹ\s]+$/.test(s)) return false;
  const w = s.split(/\s+/);
  if (w.length < 2 || w.length > 5) return false; // tên người VN hiếm khi >5 từ
  if (!w.some(x => x.length >= 3)) return false;
  if (new Set(w).size === 1) return false; // "II II II"
  return true;
}
// Bỏ MỌI chữ thường (unicode) + ký tự lạ, giữ token IN HOA ≥2 ký tự.
// Dùng toUpperCase để nhận diện chữ thường (vd 'ø','ầ') mà dải A-ỹ không bắt được.
function cleanName(s) {
  const chars = [...String(s || '')].map(ch => {
    if (/\s/.test(ch)) return ' ';
    if (/[A-Za-zÀ-ỹ]/.test(ch)) return (ch !== ch.toUpperCase() && ch === ch.toLowerCase()) ? '' : ch; // bỏ chữ thường
    return ' ';
  }).join('');
  const w = chars.replace(/\s{2,}/g, ' ').trim().split(' ')
    .filter(x => x.length >= 2 && !/^(.)\1+$/.test(x)); // bỏ token ≥2 ký tự và bỏ "II","XX" (lặp 1 ký tự)
  return w.join(' ').trim();
}

function parseOcrText(txt) {
  const T = txt.replace(/\u00a0/g, ' ');
  // id: 12 số, 3 số đầu là mã tỉnh 001-096 (lọc số rác OCR)
  let id = '', idFallback = '';
  for (const m of T.match(/\b\d{12}\b/g) || []) {
    const prov = +m.slice(0, 3);
    if (prov >= 1 && prov <= 96) { id = m; break; }
    if (!idFallback) idFallback = m; // 12 số nhưng mã tỉnh lạ → giữ tạm, để nhân viên soát
  }
  if (!id) id = idFallback;
  // Ngày sinh: nhãn "sinh"/"birth" rồi ngày, CHO PHÉP xuống dòng (layout VNeID).
  let dob = '';
  const near = T.match(/(?:sinh|birth)[\s\S]{0,40}?(\d{2})\s*[\/\-.]\s*(\d{2})\s*[\/\-.]\s*(\d{4})/i);
  if (near) {
    const d = +near[1], mo = +near[2], yr = +near[3];
    if (d >= 1 && d <= 31 && mo >= 1 && mo <= 12 && yr >= 1900 && yr <= new Date().getFullYear())
      dob = `${near[1]}/${near[2]}/${near[3]}`;
  }
  // tên: dòng IN HOA có dấu dài nhất, bỏ tiêu đề
  let name = '';
  const T_lines = T.split('\n');
  for (let i = 0; i < T_lines.length; i++) {
    const s = cleanName(T_lines[i]);
    if (!isNameVal(s)) continue;
    // ưu tiên dòng gần đầu (tên trên, địa chỉ dưới)
    if (!name || i < 6) { name = s; if (i < 6) break; }
  }
  return { id, dob, name, nationality: 'Việt Nam', src: 'ocr' };
}
// gộp field tốt nhất từ nhiều kết quả parse (ưu tiên có dấu, đủ trường)
function pickBest(cands) {
  const r = { id:'', dob:'', name:'', nationality:'', sex:'', src:'ocr', passport:false };
  for (const c of cands) {
    if (!c) continue;
    if (c.passport) r.passport = true;
    if (!r.id && c.id) r.id = c.id;
    if (!r.dob && c.dob) r.dob = c.dob;
    if (!r.nationality && c.nationality) r.nationality = c.nationality;
    if (!r.sex && c.sex) r.sex = c.sex;
    // tên: ưu tiên có dấu (CCCD/VNeID) hơn MRZ không dấu
    if (c.name) { const hasDia = /[À-ỹ]/.test(c.name); if (!r.name || (hasDia && !/[À-ỹ]/.test(r.name)) || c.name.length > r.name.length) r.name = c.name; }
  }
  if (!r.nationality) r.nationality = 'Việt Nam';
  return (r.id || r.name) ? r : null;
}
// đọc 1 ảnh: thử passport MRZ → CCCD MRZ(mặt sau) → nhãn VNeID/mặt trước → heuristic; gộp field tốt nhất
async function ocrImage(img) {
  try {
    const scale = Math.min(1.6, 1400 / img.width || 1);
    const txt = await ocrText(drawCanvas(img, scale));
    const pp = parsePassportMRZ(txt);
    if (pp && pp.id) return pp; // hộ chiếu: MRZ chuẩn, trả luôn
    const best = pickBest([parseMRZ(txt), parseFrontLabels(txt), parseOcrText(txt)]);
    return best || { id:'', dob:'', name:'', nationality:'Việt Nam', src:'man' };
  } catch {
    return { id: '', dob: '', name: '', nationality: 'Việt Nam', src: 'man' };
  }
}

// ---------- gộp 1 passenger vào danh sách (dedupe theo id) ----------
const RANK = { qr: 3, mrz: 2, ocr: 1, man: 0 };
function mergePassenger(p, thumb) {
  p.thumb = thumb || '';
  const dup = okId(p.id) ? passengers.find(x => x.id === p.id) : null;
  if (dup) {
    // ưu tiên nguồn tin cậy hơn cho từng trường; tên có dấu (qr/ocr) > mrz không dấu
    if ((RANK[p.src] || 0) > (RANK[dup.src] || 0)) dup.src = p.src;
    if (p.name && (!dup.name || (p.src !== 'mrz' && dup.nameSrc === 'mrz'))) { dup.name = p.name; dup.nameSrc = p.src; }
    if (!dup.dob && p.dob) dup.dob = p.dob;
    if (!dup.thumb && thumb) dup.thumb = thumb;
    return;
  }
  p.nameSrc = p.src;
  passengers.push(p);
}

// ---------- xử lý danh sách file: TWO-PASS ----------
async function handleFiles(files) {
  const list = [...files].filter(f => f.type.startsWith('image/'));
  if (!list.length) return;
  const imgs = [];
  // PASS 1 — QR toàn bộ (nhanh), hiện ngay
  for (let i = 0; i < list.length; i++) {
    statusEl.textContent = `Đọc QR ${i + 1}/${list.length}…`;
    try {
      const img = await fileToImage(list[i]);
      const thumb = makeThumb(img);
      const qrs = await tryQR(img);
      imgs.push({ img, thumb, qrs });
      qrs.forEach(p => mergePassenger(p, thumb));
    } catch { imgs.push(null); }
    render();
  }
  // PASS 2 — OCR/MRZ cho ảnh KHÔNG có QR
  const need = imgs.filter(x => x && x.qrs.length === 0);
  for (let j = 0; j < need.length; j++) {
    statusEl.textContent = `Nhận chữ ${j + 1}/${need.length} (ảnh mờ/không QR)…`;
    const p = await ocrImage(need[j].img);
    mergePassenger(p, need[j].thumb);
    render();
  }
  const qr = passengers.filter(p => p.src === 'qr').length;
  const auto = passengers.filter(p => p.src === 'mrz' || p.src === 'ocr').length;
  statusEl.textContent = `Xong ${list.length} ảnh — ${passengers.length} khách (QR: ${qr}, tự nhận: ${auto}). Soát dòng tô màu (đối chiếu ảnh trái) rồi Xuất file.`;
}

// ---------- kiểm tra từng ô ----------
const okId = v => /^\d{12}$/.test(v || '');
const okDob = v => /^\d{2}\/\d{2}\/\d{4}$/.test(v || '');
const okName = v => (v || '').trim().length >= 4;
// khách nước ngoài (passport): id là số hộ chiếu, không ép 12 số
const isForeign = p => p && p.nationality && !/việt\s*nam/i.test(p.nationality);
const okIdOf = p => isForeign(p) ? (p.id || '').trim().length >= 5 : okId(p.id);
function fieldBad(p) {
  return { name: !okName(p.name), dob: !okDob(p.dob), id: !okIdOf(p) };
}
// đủ thông tin cần thiết cho Excel (tên+ngày sinh+số+quốc tịch)
function isComplete(p) {
  return okName(p.name) && okDob(p.dob) && okIdOf(p) && !!(p.nationality || '').trim();
}

// ---------- render bảng ----------
const SRC = { qr: ['QR', 'qr'], mrz: ['Mặt sau', 'ocr'], ocr: ['OCR', 'ocr'], man: ['Tay', 'man'] };
function render() {
  rowsEl.innerHTML = '';
  passengers.forEach((p, i) => {
    const tr = document.createElement('tr');
    const fb = fieldBad(p);
    const s = SRC[p.src] || SRC.man;
    // OCR/MRZ luôn cần soát (tên MRZ không dấu) → tô cam kể cả khi khớp regex
    const needCheck = p.src === 'ocr' || p.src === 'mrz';
    const cls = k => (fb[k] ? ' class="bad"' : (needCheck ? ' class="chk"' : ''));
    // Hiện ảnh đối chiếu CHỈ khi chưa đủ tin: QR + đủ thông tin → ẩn ảnh; còn lại (OCR/thiếu field) → hiện
    const showThumb = p.thumb && (p.src !== 'qr' || !isComplete(p));
    const thumb = showThumb
      ? `<img class="thumb" src="${p.thumb}" data-full="${i}" alt="CCCD">`
      : '<span class="muted">—</span>';
    tr.innerHTML =
      `<td>${String(i + 1).padStart(2, '0')}</td>` +
      `<td class="thumbcell">${thumb}</td>` +
      `<td${cls('name')}><input data-i="${i}" data-k="name" value="${esc(p.name)}"></td>` +
      `<td${cls('dob')}><input data-i="${i}" data-k="dob" value="${esc(p.dob)}" placeholder="dd/mm/yyyy"></td>` +
      `<td><input data-i="${i}" data-k="nationality" value="${esc(p.nationality)}"></td>` +
      `<td${cls('id')}><input data-i="${i}" data-k="id" value="${esc(p.id)}" placeholder="12 số"></td>` +
      `<td><span class="src ${s[1]}">${s[0]}</span></td>` +
      `<td><button class="del" data-del="${i}">Xoá</button></td>`;
    rowsEl.appendChild(tr);
  });
  $('#tbl').hidden = $('#bar').hidden = $('#hint').hidden = passengers.length === 0;
  $('#cnt').textContent = passengers.length;
}
function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

// ---------- điền xlsx (XML surgery, lossless) ----------
function xmlEsc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function cellXml(coord, style, text) {
  return `<c r="${coord}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${xmlEsc(text)}</t></is></c>`;
}
function fillCell(rowXml, coord, val) {
  const re = new RegExp(`<c r="${coord}"[^>]*?(?:/>|>.*?</c>)`, 's');
  const m = rowXml.match(re);
  if (!m) return rowXml;
  const st = (m[0].match(/s="(\d+)"/) || [])[1] || '0';
  return rowXml.replace(re, cellXml(coord, st, val));
}
async function exportXlsx() {
  const valid = passengers.filter(p => okName(p.name) && okIdOf(p));
  if (!valid.length) { alert('Chưa có khách hợp lệ (cần Họ tên + Số định danh 12 số, hoặc số hộ chiếu với khách nước ngoài).'); return; }
  if (valid.length > MAX_ROWS) { alert(`Tối đa ${MAX_ROWS} khách/tàu.`); return; }
  const skipped = passengers.length - valid.length;
  statusEl.textContent = 'Đang tạo file Excel…';
  const buf = await fetch('assets/template.xlsx').then(r => r.arrayBuffer());
  const zip = await JSZip.loadAsync(buf);
  let s = await zip.file(SHEET).async('string');
  valid.forEach((p, i) => {
    const rn = FIRST_ROW + i;
    const rm = s.match(new RegExp(`<row r="${rn}"[^>]*>.*?</row>`, 's'));
    if (!rm) return;
    let row = rm[0];
    row = fillCell(row, COLS.name + rn, p.name.trim());
    row = fillCell(row, COLS.dob + rn, p.dob);
    row = fillCell(row, COLS.nationality + rn, p.nationality || 'Việt Nam');
    row = fillCell(row, COLS.id + rn, p.id);
    s = s.slice(0, rm.index) + row + s.slice(rm.index + rm[0].length);
  });
  zip.file(SHEET, s);
  Object.keys(zip.files).forEach(k => { if (zip.files[k].dir) delete zip.files[k]; });
  const out = await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const d = new Date(), pad = n => String(n).padStart(2, '0');
  const fname = `lenh-xuat-ben-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}.xlsx`;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(out); a.download = fname; a.click();
  statusEl.textContent = `Đã xuất ${fname} (${valid.length} khách${skipped ? `, bỏ qua ${skipped} dòng chưa đủ dữ liệu` : ''}). Kiểm tra rồi gửi Zalo.`;
}

// ---------- xem ảnh phóng to ----------
function showFull(i) {
  const p = passengers[i]; if (!p || !p.thumb) return;
  const ov = document.createElement('div'); ov.className = 'overlay';
  ov.innerHTML = `<img src="${p.thumb}">`;
  ov.onclick = () => ov.remove();
  document.body.appendChild(ov);
}

// ---------- events ----------
const drop = $('#drop'), fileInput = $('#file');
drop.onclick = () => fileInput.click();
fileInput.onchange = e => handleFiles(e.target.files);
['dragover','dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('hover'); }));
['dragleave','drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('hover'); }));
drop.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
rowsEl.addEventListener('input', e => {
  const i = e.target.dataset.i, k = e.target.dataset.k;
  if (i == null) return;
  passengers[i][k] = e.target.value;
  render();
});
rowsEl.addEventListener('click', e => {
  const di = e.target.dataset.del;
  if (di != null) { passengers.splice(+di, 1); render(); return; }
  const fi = e.target.dataset.full;
  if (fi != null) showFull(+fi);
});
$('#export').onclick = exportXlsx;
$('#addrow').onclick = () => { passengers.push({ name:'', dob:'', nationality:'Việt Nam', id:'', src:'man', thumb:'' }); render(); };
$('#clear').onclick = () => { if (confirm('Xoá hết danh sách?')) { passengers = []; render(); } };

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
