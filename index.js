const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const cors =  require('cors');
app.use(cors())
app.use(express.json());
app.use(express.static('build'));
app.use(express.static(path.resolve(__dirname, './build')));

const cfsApis = [
  "https://manga-sekai-cfs-1.herokuapp.com",
  "https://manga-sekai-cfs-2.herokuapp.com"
];
const backendApis = [
  "https://manga-sekai-backend-1.herokuapp.com",
  "https://manga-sekai-backend-2.herokuapp.com"
];

const currentServers = {
  cfsApi: cfsApis[0],
  backendApi: backendApis[0]
}


setTimeout(async () => {
  currentServers.cfsApi = await getUp(cfsApis)
  currentServers.backendApi = (await getUp(backendApis)) || backendApis[0];
  console.log(currentServers)
}, 0)


setInterval(async () => {
  currentServers.cfsApi = await getUp(cfsApis)
  currentServers.backendApi = await getUp(backendApis)
 
    console.log(currentServers)

}, 30 * 1000);


async function getUp(arr) {
  for(let server of arr) {
    console.log(server)
    if (server) {
      let check = await fetch(server).then(res => {
          return res.ok;
      });

      if (check) return server;
    }
  }
}

app.get('/appApk', (req, res) => {
  res.redirect('https://cdn.glitch.me/61fd6cc8-64b3-456d-90c1-711e8da035a1%2Fmanga-sekaiv1.5.apk');
})

const apicache = require('apicache');
let cache = apicache.middleware;

app.get('/apiServers', (req, res) => {
  console.log('got an api refresh')
  res.json(currentServers);
})



// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

app.listen(3000, () => console.log('started !!'));