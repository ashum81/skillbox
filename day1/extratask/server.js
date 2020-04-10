var express = require("express");
var WebSocket = require("ws");
var GOL = require("./app/js/logic");
var http = require("http");

var app = express();
server = http.createServer(app);

var PORT = process.env.PORT || 8000;
var wss = new WebSocket.Server({ server });

var gol = new GOL();
gol.initGrid();
setInterval(function() {
  gol.updateGrid();
}, 1000);

var sync = function() {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ action: "sync", grid: gol.getGrid() }));
    }
  });
};

wss.on("connection", function(ws) {
  ws.on("message", function(message) {
    var params = JSON.parse(message);
    if (params.action == "addSelectedCells") {
      params.selected.forEach(cell =>
        gol.selectCell(cell.i, cell.j, params.client.color)
      );
      sync();
    }
    if (params.action == "addPattern") {
      gol.addPattern(params.pattern, params.client.color);
      sync();
    }
    if (params.action == "ping") {
      sync();
    }
  });
  sync();
});

gol.updateGrid();

app.use(express.static("app"));
server.listen(PORT, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
