// Processing request
// No dependyc injection for now...
import { sendEmail } from "./email";
import { transferTo } from "./faucet";

export async function processRequest(params:any,amount:number,emailDest:string){
    var errors = {} as any
    var returnVal = {} as any
    if ((params.company == null) || (params.company.length < 2)) {
      errors.company = "You must provide a company"
    }
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if ((params.email == null) || (params.email.length < 2) || (!params.email.match(validRegex))) {
      errors.email = "You must provide a valid email"
    }
    if ((params.address == null) || (params.address.length < 20)) {
      errors.address = "You must provide a valid tezos address"
    }
    // Check if there is some errors
    if (Object.keys(errors).length == 0) {
      let result = await transferTo(params.address,amount)
      // const result = "fake"
      console.log(result)
      sendEmail(emailDest,params.email,params.company)
      returnVal = { success: true, data: { address: params.address, amount: amount, result: result } };
  
    } else {
      returnVal = { success: false, errors: errors };
    }
    return returnVal
}