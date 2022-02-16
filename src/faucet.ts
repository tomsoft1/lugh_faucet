const { TezosToolkit } = require("@taquito/taquito")
const { InMemorySigner, importKey } = require("@taquito/signer")
const fs = require("fs")
const { pkh, email, password, mnemonic, secret } = JSON.parse(
  fs.readFileSync("./lugh.json").toString()
)
const println = console.log
console.log("Email:",email," mnemonic:",mnemonic, " secret:",secret)
const Tezos = new TezosToolkit("https://hangzhounet.smartpy.io/")
importKey(
  Tezos,
  email,
  password,
  mnemonic.join(' '),
  secret
).catch((e:Error) => console.error(e));

const owner = pkh
var LughContract =""

export function initTezos(address:string){
  LughContract = address
  console.log("Lugh contract address: ",LughContract)
  const signer = new InMemorySigner(secret);
  Tezos.setProvider({ signer: signer })
  console.log("Signer setted")
}


export async function transferTo(to:string,in_value:number):Promise<string>{

  return Tezos.contract
  .at(LughContract)
  .then((contract:any) => {
    console.log(contract.methods.transfer)
    const value = 1000000*in_value

    println(`Transfering value of ${value} from ${owner} to:${to}`);
    return contract.methods.transfer( [{from_:owner,txs:[{to_:to,token_id:0,amount:value}]}]).send(

    );
  })
  .then((op:any) => {
    println(`Waiting for ${op.hash} to be confirmed...`);
    return op.confirmation(1).then(() => op.hash);
  })
  .then((hash:string) => {
    println(`Operation injected: https://hangzhou.tzstats.com/${hash}`)
    return hash
  }
    )
  .catch((error:Error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
}

//transferTo('tz1PkCLMLgEzzgbKs7S99R72JrSbhd8zEgsg',1)