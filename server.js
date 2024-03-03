const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("./model");


const app = express();

app.use(express.json());

// app.use('/',(req,res)=>{
//   res.status(200).json({message:"Home Page"})
// });

app.use('/api/role',require('./routes/roleRoutes'));

app.use('/api',require('./routes/userRoutes'));

app.use('/api/question',require('./routes/questionsRouter'));

app.use('/api/questionary',require('./routes/questionaryRoutes'));

app.use('/api/answer',require('./routes/answerRoutes'));

app.listen(process.env.PORT,()=>{
  console.log(`Server is running in port ${process.env.PORT}`);
})

module.exports = app;