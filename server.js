const express = require('express');
const path = require('path');
const { Client } = require("pg");

const app = express();
const port = 3000;

const client = new Client({

  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: 'secret',
  database: 'shelly'


});

client.connect()
  .then(() => {

    console.log("connected to db")

    return client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = "public";')

  })

  .catch(err => {
    console.error(err.stack)

  })


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/status', async (req, res) => {

      const response = await fetch("http://192.168.1.243/rpc/Switch.GetStatus?id=0");
    const data = await response.json();


    const tarifaRes = await fetch("https://api-drzavno-test.scv.si/api/tarifa");
    const tarifa = await tarifaRes.json();
    console.log(tarifa.tarifa)

    //formula za trenutno porabo

  res.send(data);
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
