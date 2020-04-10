var app = new Vue({
  el: "#app",
  data() {
    return {
      // You can override the wssServer path here
      wssServer: '',
      client: {},
      gol: null,
      grid: [],
      selected: [],
      rows: 0,
      cols: 0,
      count: 0,
      status: "",
      socket: null,
      handler: null
    };
  },
  created() {
    // For code review purpose, added the auto settings of wss server
    if (!this.wssServer) {
      if (window.location.protocol == 'http:') {
        this.wssServer = `ws://${window.location.host}/`;
      } else {
        this.wssServer = `wss://${window.location.host}/`;
      }
    }
  },
  mounted() {
    this.gol = new GOL();
    this.rows = this.gol.getRows();
    this.cols = this.gol.getCols();
    this.$set(this, "grid", this.gol.initGrid());
    this.initClient();
  },
  methods: {
    initClient() {
      // Color is stored in local storage, so each browser have same color value
      if (!window.localStorage.getItem("client")) {
        this.client.color =
          "#" +
          (Math.random().toString(16) + "000000").substring(2, 8).toUpperCase();
        window.localStorage.setItem("client", JSON.stringify(this.client));
      } else {
        this.client = JSON.parse(window.localStorage.getItem("client"));
      }
      this.initWS();
    },
    initWS() {
      if (typeof WebSocket === "undefined") {
        alert("Web Socket Not Supported");
      } else {
        this.socket = new WebSocket(this.wssServer);
        this.socket.onopen = this.open;
        this.socket.onerror = this.error;
        this.socket.onmessage = this.getMessage;
      }
    },
    open() {
      this.status = "Server Connected";
      this.run();
    },
    error() {
      this.status = "Socket Error";
    },
    getMessage(msg) {
      // Sync grid if got messages from server
      const obj = JSON.parse(msg.data);
      if (obj.action === "sync") {
        this.gol.setGrid(obj.grid);
        this.$set(this, "grid", this.gol.getGrid());
        clearTimeout(this.handler);
        this.handler = setTimeout(this.run, 1000);
      }
    },
    send(params) {
      try {
        this.socket.send(JSON.stringify(params));
      } catch (e) {
        this.initWS();
      }
    },
    close() {
      this.status = "Socket Closed";
      this.initWS();
    },
    run() {
      // keep socket alive
      this.count++;
      if (this.count > 30) {
        this.send({ action: "ping" });
        this.count = 0;
      }
      // tick function to update grid
      this.grid = this.gol.updateGrid();
      this.handler = setTimeout(this.run, 1000);
    },
    addSelectedCells() {
      this.send({
        action: "addSelectedCells",
        client: this.client,
        selected: this.selected
      });
      this.selected.forEach(cell =>
        this.gol.selectCell(cell.i, cell.j, this.client.color)
      );
      this.selected = [];
    },
    isSelected(i, j) {
      return this.selected.find(cell => cell.i == i && cell.j == j);
    },
    addPattern(pattern) {
      this.send({
        action: "addPattern",
        pattern: pattern,
        client: this.client
      });
    },
    selectCell(i, j) {
      if (!this.gol.isEmptyCell(i, j)) return;
      var cell = this.selected.find(cell => cell.i == i && cell.j == j);
      if (cell) {
        this.selected = this.selected.filter(
          cell => cell.i != i || cell.j != j
        );
      } else {
        this.selected.push({ i, j });
      }
    }
  },
  destroyed() {
    this.socket.onclose = this.close;
  }
});
