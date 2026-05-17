module.exports = async function (context, req) {
    context.log("bids endpoint hit");

    if (req.method === "GET") {
        context.res = {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: []
        };
        return;
    }

    if (req.method === "POST") {
        context.res = {
            status: 200,
            body: { success: true }
        };
        return;
    }

    context.res = {
        status: 405,
        body: "Method not allowed"
    };
};

