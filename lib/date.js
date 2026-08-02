export function pad(n) { return n < 10 ? '0' + n : '' + n; }

export function todayKey(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

export function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export const weekdayFa = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
export const weekdayShortFa = ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'];

export function weekdayName(d) { return weekdayFa[d.getDay()]; }
export function weekdayShort(d) { return weekdayShortFa[d.getDay()]; }

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
export function toFaDigits(str) {
  return String(str).replace(/[0-9]/g, (d) => faDigits[+d]);
}

export function gregorianToJalali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm, jd;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}

export const jalaliMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];

export function jalaliDateString(d) {
  const j = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return weekdayName(d) + '، ' + toFaDigits(j[2]) + ' ' + jalaliMonths[j[1] - 1] + ' ' + toFaDigits(j[0]);
}

export const quotes = [
  'هر قدم کوچک، بخشی از یک مسیر بزرگ است.',
  'پیوستگی، مهم‌تر از کمال است.',
  'امروز را بهتر از دیروز بساز، نه بهترین روز عمرت را.',
  'عادت‌های کوچک، آدم‌های بزرگ می‌سازند.',
  'کافیست فقط یک قدم دیگر برداری.',
  'نظم، پلی است میان هدف و دستاورد.',
  'هر روز یک فرصت تازه برای رشد است.',
];

export function escapeText(s) { return s; }
