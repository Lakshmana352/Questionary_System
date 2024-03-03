const { Snowflake } = require("@theinternetfolks/snowflake");
const db = require("../model");
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");

const pageSize = 10;
const currentPage = 0;
const addQuestion = asyncHandler(async(req,res)=>{
  const resp = {
    status: false,
    content: {
    }
  };
  const user = req.user;
  //question and options are separated by underScore or any other sign as per requirements
  const {id} = req.params;
  const {question,num} = req.body; 
  const checkId = await db.questionarie.findOne({where:{id:id}});
  if(!checkId){
    resp.content.data = {message:`Given questionarie id does not exists.`};
    res.status(400).json(resp);return;
  }
  if(user.id != checkId.dataValues.admin){
    resp.content.data = {message:`Only questionary admins can modify questionaries.`};
    res.status(400).json(resp);return;
  }
  if(!question || !num) {
    resp.content.data = {message:`All fields are mandatory.`};
    res.status(400).json(resp);return;
  }
  const condition = {
    [Op.and]:[
      {
        questionarie:id
      },
      {
        [Op.or]:[
          {
            num:num
          },
          {
            question:question
          }
        ]
      }
    ]
  };
  const checkQ = await db.questions.findOne({where:condition});
  // console.log(checkQ);
  if(checkQ){
    resp.content.data = {message:`Question or number already exists in this questionary.`};
    res.status(400).json(resp);return;
  }
  var db_question = await db.questions.create({
    id: Snowflake.generate(),
    questionarie: id,
    question: question,
    num: num
  });
  db_question = db_question.dataValues;
  resp.content.data = db_question;
  resp.status = true;
  res.status(200).json(resp);
});

const getQuestions = asyncHandler(async(req,res)=>{
  const resp = {
    status: false,
    content: {
    },
  }
  const {id} = req.params; 
  const checkId = await db.questionarie.findOne({where:{id:id}});
  if(!checkId){
    resp.content.data = {message:`Given questionarie id does not exists.`};
    res.status(400).json(resp);return;
  };
  var questions = await db.questions.findAll({
    where:{questionarie:id},
    order: [
      ['num','ASC']
    ]
  });
  // console.log(questions);
  questions = questions.map((question)=>{
    return question.dataValues
  })
  // console.log(questions);
  const pages = Math.ceil(questions.length/pageSize);
  const startIndex = currentPage*pageSize;
  questions = questions.slice(startIndex,startIndex+pageSize);
  resp.content.meta = {
    total: questions.length,
    pages: pages,
    page: currentPage+1
  }
  resp.content.data = questions;
  resp.status = true;
  res.status(200).json(resp);
  return;
})

module.exports = {
  addQuestion,
  getQuestions
}