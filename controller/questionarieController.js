const { Snowflake } = require("@theinternetfolks/snowflake");
const db = require("../model");
const asyncHandler = require("express-async-handler");

const createQuestionarie = asyncHandler(async(req,res)=>{
  const resp = {
    status: false,
    content: {
    }
  }
  const user = req.user;
  const {name} = req.body;
  const role = await db.role.findOne({where:{id:user.role}});
  if(!role || role.dataValues.name != 'Admin'){
    resp.content.data = {message: `Users with role admin can only create questionarie.`};
    res.status(400).json(resp);return;
  }
  if(!name){
    resp.content.data = {message:`Name field is mandatory.`}
    res.status(400).json(resp);
  }
  const check = await db.questionarie.findOne({where:{name:name}});
  if(check){
    resp.content.data = {message: `Questionary with name ${name} already exists.`};
    res.status(400).json(resp);return;
  }
  var questionarie = await db.questionarie.create({
    id: Snowflake.generate(),
    name: name,
    admin: user.id
  });
  questionarie = questionarie.dataValues;
  resp.content.data = questionarie;
  resp.status = true;
  res.status(200).json(resp);
});

module.exports = {
  createQuestionarie
}