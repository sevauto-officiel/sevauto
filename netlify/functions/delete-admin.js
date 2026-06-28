// Example Netlify Function: delete-admin
// WARNING: This is an example template. Deleting Netlify Identity users requires admin API access.
// Set NETLIFY_TOKEN as a secure environment variable with at least identity:write scope.
// Also define SITE_ID to target the correct Netlify site in the API call.
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const token = process.env.NETLIFY_TOKEN;
  const siteId = process.env.SITE_ID;
  if (!token || !siteId) return { statusCode: 500, body: 'Server not configured' };

  const body = event.body ? JSON.parse(event.body) : {};
  const userId = body && body.userId;
  if (!userId) return { statusCode: 400, body: 'Missing userId' };

  try {
    const resp = await fetch(`https://api.netlify.com/api/v1/admin/identities/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    if (!resp.ok) return { statusCode: resp.status, body: await resp.text() };
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
};
