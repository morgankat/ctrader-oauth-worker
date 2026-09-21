export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const redirectUri = url.searchParams.get("redirect_uri");
    if (!code || !redirectUri) {
      return new Response(JSON.stringify({ error: "Missing code or redirect_uri" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    const tokenUrl = "https://connect.spotware.com/apps/token"
      + "?grant_type=authorization_code"
      + "&code=" + encodeURIComponent(code)
      + "&redirect_uri=" + encodeURIComponent(redirectUri)
      + "&client_id=" + encodeURIComponent(env.CTRADER_CLIENT_ID)
      + "&client_secret=" + encodeURIComponent(env.CTRADER_CLIENT_SECRET);
    const resp = await fetch(tokenUrl, { method: "GET", headers: { "Accept": "application/json" } });
    const raw = await resp.json();
if (raw.accessToken) raw.clientSecret = env.CTRADER_CLIENT_SECRET;
const data = JSON.stringify(raw);
    return new Response(data, { status: resp.status, headers: { "Content-Type": "application/json", ...corsHeaders } });
  },
};
