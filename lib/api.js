async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = 'خطا در ارتباط با سرور';
    try {
      const data = await res.json();
      if (data && data.error) msg = data.error;
    } catch (e) {}
    throw new Error(msg);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  get: (url) => request(url),
  post: (url, body) =>
    request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) }),
  patch: (url, body) =>
    request(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) }),
  del: (url) => request(url, { method: 'DELETE' }),
};
