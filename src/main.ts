import { createLogger, format, transports } from "winston";
global.logger = initLogger()
require('dotenv').config()
import { initEmail } from "./email";
import { initTezos } from "./faucet";
import { processRequest } from "./processParams";
const express = require('express')

const logger = global.logger 
function initLogger() {

  return  createLogger({
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { service: 'lugh' },
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.simple()
        )
      }),
      new transports.File({ filename: 'errors.log', level: 'error' }),
    ]
  });
  }
logger.warn('Application Started')

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
  logger.info("Request received",req.body)
  const returnVal = await processRequest(req.body,defaultAmount,process.env.EMAIL_DEST)
  logger.info("Answer:",returnVal)
  res.send(returnVal);
});

app.listen(port, (err: any) => {
  if (err) {
    return logger.error(err);
  }
  return logger.info(`server is listening on ${port}`);
});