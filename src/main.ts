import { initEmail, sendEmail } from "./email";
import { initTezos, transferTo } from "./faucet";
require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path');

initEmail(process.env.SENDGRID_KEY,process.env.EMAIL_SOURCE)
initTezos( process.env.LUGH_CONTRACT )

app.use(express.json({extended: false})); 
app.use(express.urlencoded({extended: true}))

app.post('/transfer', async function(req, res) {
  console.log(req.body)
  let result = await transferTo(req.body.address,parseInt(process.env.AMOUNT_TRANSFERRED))
 // const result="fake"
  console.log(result)
  sendEmail(process.env.EMAIL_DEST,req.body.email,req.body.company)
  res.send(`<html><body><H1>Well done</H1>${process.env.AMOUNT_TRANSFERRED} Lugh transferred to ${req.body.address}</body></html>`);
});

// sendFile will go here
app.get('/', function(req, res) {
  res.sendFile(path.join( path.join(__dirname, '../public'), '/index.html'));
});


app.listen(port, (err: any) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});