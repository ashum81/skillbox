# Description of the problem and solution.
This project is to build a multiplayer "Game of Life" game. 
The key problem is to build the pattern computing logic and the multiplayer function

For the pattern computing, it is an algorithmic problem, a straightforward approach
has been used. The grid is updated for every tick, and the status is calculated by
checking neighbor cells of each cell.

For the multiplayer function, the key is to synchronize every players. Each client
has his own grid, they will send the event via websocket about their actions like
add selected cells or patterns. The server keep a master version and will broadcast
to clients after updated. To reduce the traffic between client and server, the client
has a own grid. The client grid can do calculate without the server, so if the connection is unstable, or before next server notificaiton, the client can also compute its own grid. If the client got the message from server, they will use the server version to sync with other clients.

# Get Started
### Demo: 
[https://safe-plateau-00991.herokuapp.com/]

### Configuration
To override the default WebSocket auto path, modify the wss link in app/js/main.js
```
// You can override the wssServer path here
wssServer: '',
```
e.g. wssServer: "wss://safe-plateau-00991.herokuapp.com/"


### Start the server locally

```
npm install
node server.js
```

### Run on local
When the server is ready, open http://localhost:8000

If you would like to specify the port,
```
PORT=3001 node server.js
```


### Test
```
npm run test
```

### Deploy To Heroku
To deploy to heroku, you need a heroku account.

More details can be found in
[https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app]

# Consideration

### For the frontend, Vue and UIKit are used
Although simple javascript and html also work, frameworks and libraries are used for extensibility and readability.

### For the backend
Node.js, express.js and Websocket are used. It is standard and straightforward in our case.

# Trade-offs
For demo purpose, some features are simplified. For example, only three patterns are used in the project. If there are more patterns, the pattern data can be separated in a more robust structure

Although code can be further simplified by using latest JS version, like using the arrow function, const, let, etc. I still tried to use basic javascript instead for better compatibility. In real case, webpack can help to solve the problem.

### Common files
The game logic file in js/logic.js is shared by both server and client to prevent of reinventing the wheel. For demo purpose, the file is located along with frontend code.
For production, the logic can be separated to a common folder and some tools like webpack can be used.

### Average Color
A simplier approach has been used for demo purpose. To do a accuracte average color calculation, the rgb value can be calculated separately for all neighbours.
