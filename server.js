const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/status', async (req, res) => {

    const response = await fetch("http://192.168.1.243/rpc/Switch.GetStatus?id=0");
    const data = await response.json()
    console.log(data)

  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
