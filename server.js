const express = require('express');
const corser = require("corser");

const { applyHeaderRouting } = require('./istio/header-routing');

const app = express();
app.use(corser.create());

app.use(express.static(__dirname + '/dist/coolstore'));

app.options("*", function (req, res) {
  // CORS
  res.writeHead(204);
  res.end();
});

// Used for App health checking
app.get('/sys/info/ping', function(req, res, next) {
  res.end('"OK"');
});

// Used for App health checking
app.get('/istio/header-routing', async function(req, res) {
    try {
        const result = await applyHeaderRouting();
        res.send(result);
    } catch (error) {
        console.log('header-routing error', error);
        res.status(500).send({success: false, error: error});
    }
});

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const host = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const server = app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
module.exports = server;