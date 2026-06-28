// Example Netlify Function: list-admins
// NOTE: This is a skeleton. To use in production, set NETLIFY_TOKEN and SITE_ID as secure environment variables.
// NETLIFY_TOKEN should be a Netlify personal access token with API scopes such as:
//   - identity:read
//   - sites:read
// For admin actions, also include:
//   - identity:write
// The current function reads identity info for the configured site.
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const token = process.env.NETLIFY_TOKEN;
  const siteId = process.env.SITE_ID;
  if (!token || !siteId) return { statusCode: 500, body: 'Server not configured' };

  try {
    const resp = await fetch('https://api.netlify.com/api/v1/sites/' + process.env.SITE_ID + '/identity', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    // This endpoint format may vary; real implementation requires Netlify Identity Admin API usage.
    return { statusCode: 200, body: JSON.stringify({ users: data }) };
  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
};
