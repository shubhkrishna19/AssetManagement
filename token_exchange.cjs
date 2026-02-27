const https = require('https');
const querystring = require('querystring');

const exchangeToken = (code) => {
    const postData = querystring.stringify({
        code: code,
        client_id: '1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA',
        client_secret: 'f60455449d30984ca1c026a872a2395cb5100dba36',
        grant_type: 'authorization_code',
        // redirect_uri might be needed if the token was generated with one
    });

    const options = {
        hostname: 'accounts.zoho.com',
        path: '/oauth/v2/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (d) => data += d);
        res.on('end', () => {
            const fs = require('fs');
            fs.writeFileSync('token_response.json', data);
            console.log("Token written to token_response.json");
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(postData);
    req.end();
};

const code = process.argv[2];
if (code) {
    exchangeToken(code);
} else {
    console.log("Usage: node token_exchange.js <GRANT_TOKEN>");
}
