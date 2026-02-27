const app = require('./index');
const port = 3000;

app.listen(port, () => {
    console.log(`Local test server listening at http://localhost:${port}`);
});
