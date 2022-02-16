import { initEmail } from "./email";
import { initTezos } from "./faucet";
import { processRequest } from "./processParams";

require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path');

initEmail(process.env.SENDGRID_KEY, process.env.EMAIL_SOURCE)
initTezos(process.env.LUGH_CONTRACT,process.env.TEZOS_NODE)

const defaultAmount = parseInt(process.env.AMOUNT_TRANSFERRED)

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));

app.post('/transfer', async function (req, res) {
  console.log(req.body)
  const params = req.body
  const returnVal = await processRequest(req.body,defaultAmount,process.env.EMAIL_DEST)
  console.log(returnVal)
  res.send(returnVal);



});

app.get('/', function (req, res) {
  res.sendFile(path.join(path.join(__dirname, '../public'), '/index.html'));
});


app.listen(port, (err: any) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});