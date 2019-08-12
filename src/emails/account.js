// const sendgridAPIkey = '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'
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to : 'friysenter@gmail.com',
//     from : 'friysenter@gmail.com',
//     subject : 'sg test!',
//     text : 'sg test!'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to : email,
        from : 'friysenter@gmail.com',
        subject : 'Thanks for Jion China State Railway Co.ltd',
        text : `DEAR MR/MS ${name}. WELCOME TO THE CHINA STATE RAILWAY CO.LTD.`
    })
}

module.exports = {
    sendWelcomeEmail
}