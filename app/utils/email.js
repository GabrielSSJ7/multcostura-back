require('dotenv').config()
const hbs = require('nodemailer-express-handlebars')

const nodemailer = require('nodemailer')

function config (emailConf, templatePath, templatePathPartials) {
  const smtpTransport = nodemailer.createTransport({
    // service: process.env.MAILER_SERVICE_PROVIDER || "Gmail",
    host: emailConf.smtpServer,
    port: emailConf.port,
    secure: !!emailConf.ssl,
    auth: {
      user: emailConf.email,
      pass: emailConf.pass
    }
  })

  const handlebarsOptions = {
    viewEngine: {
      extName: 'handlebars',
      partialsDir: templatePath,
      layoutsDir: templatePathPartials,
      defaultLayout: 'template'
    },
    viewPath: templatePath,
    extName: '.html'
  }
  smtpTransport.use('compile', hbs(handlebarsOptions))

  return smtpTransport
}

function envConfig (templatePath, templatePathPartials) {
  const smtpTransport = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER, // SERVIDOR DE EMAIL
    port: process.env.EMAIL_PORT, // PORTA DO SERVIDOR
    secure: !!process.env.EMAIL_SSL, // CONEXÃO COM SSL OU NÃO
    auth: {
      user: process.env.EMAIL_USER, // USUÁRIO EMAIL
      pass: process.env.EMAIL_PASS // SENHA DO EMAIL
    }
  })

  console.log({
     host: process.env.EMAIL_SERVER, // SERVIDOR DE EMAIL
    port: process.env.EMAIL_PORT, // PORTA DO SERVIDOR
    secure: !!process.env.EMAIL_SSL, // CONEXÃO COM SSL OU NÃO
    auth: {
      user: process.env.EMAIL_USER, // USUÁRIO EMAIL
      pass: process.env.EMAIL_PASS // SENHA DO EMAIL
    }
  })

  const handlebarsOptions = {
    viewEngine: {
      extName: 'handlebars',
      partialsDir: templatePath,
      layoutsDir: templatePathPartials,
      defaultLayout: 'template'
    },
    viewPath: templatePath,
    extName: '.html'
  }
  smtpTransport.use('compile', hbs(handlebarsOptions))

  return smtpTransport
}


async function sendMail (template, emailData, smtpTransport) {
  const data = {
    to: emailData.to,
    from: emailData.from,
    bcc: emailData.bcc,
    template: template.name,
    subject: emailData.subject,
    context: template.context
  }

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(data, function (err, info) {
      if (!err) {
        resolve(info)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = { config, envConfig, sendMail }