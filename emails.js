const express = require("express")

const mongoose = require("mongoose")

const nodemailer = require("nodemailer");

const app = express()

app.use(express.json())

const connect = () =>
{
    return mongoose.connect("mongodb://localhost:27017/emails")
}

const usersschema = new mongoose.Schema
({
    "firstname" : {type : String , required : true},
    "lastname" : {type : String , required : true},
    "email" : {type : String , required : true}
})

const User = mongoose.model("user",usersschema)

app.get("/users" , async function(req , res)
{
    const data = await User.find().lean().exec()
    return res.send(data)
})

app.post("/users" , async function(req , res)
{
    const data = await User.create(req.body)

    let transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 587 ,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "cae63a36959250", // generated ethereal user
        pass: "da0989c94174a3", // generated ethereal password
      },
    });

     transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: data.email, // list of receivers
      subject: `Welcome to ABC system ${data.firstname} ${data.lastname}`, // Subject line
      text:` Hi ${data.firstname}, Please confirm your email address` , // plain text body
      html: "<b>Hello world?</b>", // html body

      
    });

    //      transporter.sendMail({
    //   from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //   to: "bar@example.com, baz@example.com", // list of receivers
    //   subject: "Hello ✔", // Subject line
    //   text: "Hello world?", // plain text body
    //   html: "<b>Hello world?</b>", // html body
    // });
  

    return res.send({user : data})
})

// async function main() {
//     // Generate test SMTP service account from ethereal.email
//     // Only needed if you don't have a real mail account for testing
    
  
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       host: "smtp.mailtrap.io",
//       port: 587 ,
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: "cae63a36959250", // generated ethereal user
//         pass: "da0989c94174a3", // generated ethereal password
//       },
//     });
  
//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//       from: '"Fred Foo 👻" <foo@example.com>', // sender address
//       to: "bar@example.com, baz@example.com", // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: "Hello world?", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     });
  
//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//   }
  
//   main().catch(console.error);


app.listen(1000, async () =>
{
    await connect()
    console.log("listening to the server")
})