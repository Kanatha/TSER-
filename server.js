const express = require("express");
const { Client } = require("pg");

const app = express();
const port = 3000;

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "admin",
  password: "secret",
  database: "shelly",
});

client.connect();

const readTable = async () => {
  const res = await client.query(
    "SELECT * FROM tarifa ORDER BY id desc LIMIT 100"
  );

  return res.rows;
};

const writeTable = async (power, tarif) => {
  await client.query("INSERT INTO tarifa(tarifa, moc) VALUES($1, $2)", [
    tarif,
    power,
  ]);
};

const getData = async () => {
  const tarifaRes = await fetch("https://api-drzavno-test.scv.si/api/tarifa");
  const tarifa = await tarifaRes.json();

  const powerRes = await fetch(
    "http://192.168.1.243/rpc/Switch.GetStatus?id=0"
  );
  const power = await powerRes.json();

  //console.log({ power, tarifa });
  //console.log(tarifa.tarifa, power.apower);
  return [tarifa.tarifa, power.apower];
};

app.get("/status", async (req, res) => {
  const data = await getData();
  res.json(data[1]);
});

setInterval(async () => {
  const data = await getData();

  writeTable(data[1], data[0]);
}, 5000);

app.get("/data", async (req, res) => {
  const tableData = await readTable();
  console.log(tableData);
  res.json(tableData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//TODO: Set interval on writeTable to write every 5 seconds instead on on request.
