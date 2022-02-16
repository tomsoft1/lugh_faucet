const sgMail = require('@sendgrid/mail')

var senderG='tobeconfigured@gmail.com'
export function  initEmail(API_KEY:string,sender:string){
  sgMail.setApiKey(API_KEY)
  senderG = sender
}
export async function sendEmail(dest:string,email:string,company:string) {
  const msg = {
    to: dest,
    from: senderG,
    subject: `New Faucet to ${company}`,
    text: `Some lugh has been sent to ${email} from Company:${company}`
  }
  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => {
      console.error(error)
    })
}
