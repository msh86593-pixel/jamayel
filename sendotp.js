exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, code } = JSON.parse(event.body || '{}');
  if (!email || !code) {
    return { statusCode: 400, body: JSON.stringify({ error: 'missing fields' }) };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer re_axn4d1JQ_dViJ6BTvy9Z9d3G5HUEv9yhT',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'جمايل <onboarding@resend.dev>',
      to: [email],
      subject: 'كود التحقق — جمايل',
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;background:#f7f0e6;border-radius:8px;">
          <h2 style="color:#6f1536;">مرحباً بك في جمايل</h2>
          <p style="color:#4a2620;">كود التحقق الخاص بك:</p>
          <div style="background:#fff;border:2px solid #6f1536;border-radius:8px;padding:20px;text-align:center;letter-spacing:12px;font-size:2rem;font-weight:700;color:#6f1536;">${code}</div>
          <p style="color:#6e4a3a;font-size:0.85rem;margin-top:20px;">الكود صالح لمدة 10 دقائق.</p>
        </div>
      `
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'فشل الإرسال' }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};