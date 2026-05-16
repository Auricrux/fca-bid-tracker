const https = require("https");

module.exports = async function (context, req) {
  try {
    const base = process.env.BID_API_BASE;
    const key = process.env.BID_API_KEY;

    const url = `${base}?code=${key}`;

    const options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const request = https.request(url, options, (response) => {
      let data = "";

      response.on("data", chunk => data += chunk);

      response.on("end", () => {
        context.res = {
          status: response.statusCode,
          body: data
        };
      });
    });

    request.on("error", err => {
      context.res = {
        status: 500,
        body: err.toString()
      };
    });

    if (req.body) {
      request.write(JSON.stringify(req.body));
    }

    request.end();

  } catch (err) {
    context.res = {
      status: 500,
      body: err.toString()
    };
  }
};
