// Processing request
// No dependyc injection for now...
import { sendEmail } from "./email";
import { transferTo } from "./faucet";
import { validateAddress } from '@taquito/utils'

export async function processRequest(params:any,amount:number,emailDest:string){
    var errors = {} as any
    var returnVal = {} as any
    if ((params.company == null) || (params.company.length < 2)) {
      errors.company = "Vous devez fournir le nom de votre société"
    }
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if ((params.email == null) || (params.email.length < 2) || (!params.email.match(validRegex))) {
      errors.email = "Vous devez fournir un email valide"
    }

      const resultVal = validateAddress(params.address)
      if(resultVal==0)errors.address = "Problème de préfixe avec l'adresse"
      if(resultVal==1)errors.address = "Checksum invalide pour l'adresse"
      if(resultVal==2)errors.address = "Longueur invalide pour l'adresse"
    
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