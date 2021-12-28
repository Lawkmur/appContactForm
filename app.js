const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact', {layout:false});
  app.locals.layout = false;
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Full name: ${req.body.name}</li>
      <li>Adress: ${req.body.adress}</li>
      <li>Adress 2: ${req.body.adress2}</li>
      <li>City: ${req.body.city}</li>
      <li>State: ${req.body.state}</li>
      <li>Zip code: ${req.body.zipcode}</li>

    </ul>
    <h3>Message</h3>
    <p>${req.body.name}</p>
    big thank you!
  `;

      // Creamos una funcion re-utilizable usando el protocolo SMTP con nodemailer
      let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com', // SMTP INFO SOLO PARA OFFICE 365 ACCOUNTS
        port: 587,
        secure: false, // true para 465, falsa para otros.
        auth: {
            user: 'correoelectronico@outlook.com', // correo del transporte
            pass: 'password'  // contraseña del transporte
        },
        // Transport Layer Securuty. 
        tls:{
          rejectUnauthorized:false
        }
      });
    
      // Set up de los datos del correo
      let mailOptions = {
          from: '"Fabio Menjívar" <correoelectronico@outlook.com>', // Correo del emisor
          to: 'anotheremail@outlook.com', // Lista de receptores
          subject: 'Whats up?!', // Asunto del correo
          html: output // cuerpo html.
      };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

app.listen(3000, () => console.log('Server started...'));