const https = require("https");

function callApi(url, method, body) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);

    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const req = https.request(options, res => {
      let data = "";

      res.on("data", chunk => data += chunk);

      res.on("end", () => {
        resolve({
          status: res.statusCode,
          body: data
        });
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

module.exports = async function (context, req) {

  const base = process.env.BID_API_BASE;
  const key = process.env.BID_API_KEY;

  const url = `${base}?code=${encodeURIComponent(key)}`;

  try {
    const result = await callApi(url, req.method, req.body);

    let parsed;

    try {
      parsed = JSON.parse(result.body);
    } catch {
      parsed = [];
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: parsed
    };

  } catch (err) {
    context.res = {
      status: 500,
      body: { error: err.toString() }
    };
  }
};
