const db = require("../model");
const asyncHandler = require("express-async-handler");
const {Snowflake} = require("@theinternetfolks/snowflake");


const addAnswer = asyncHandler(async(req,res)=>{
  const user = req.user;
  const {answer} = req.body;
  const {id} = req.params;
  const resp = {
    status: false,
    content: {
    }
  };
  if(!answer){
    resp.content.data = {message:`Answer is mandatory in integer.`};
    res.status(400).json(resp);return;
  }
  var checkId = await db.questions.findOne({where:{id:id}});
  checkId = checkId.dataValues;
  if(!checkId){
    resp.content.data = {message:`There is no question with id ${id}.`}
    res.status(400).json(resp);return;
  }
  var questionarie = await db.questionarie.findOne({where:{id:checkId.questionarie}});
  questionarie = questionarie.dataValues;
  if(questionarie.admin == user.id){
    resp.content.data = {messsage: "Admin not allowed to answer his/her own questionarie."}
    res.status(400).json(resp);return;
  }
  const check_already_answered = await db.answers.findOne({where:{question:checkId.id,user:user.id}});
  if(check_already_answered){
    resp.content.data = {message:`You have already answered this question.`};
    res.status(400).json(resp);return;
  }
  const mcq = checkId.question.split(',');
  if(answer >= mcq.length || answer < 0){
    resp.content.data = {message:`Answer be above 0 and less than ${mcq.length}`};
    res.status(400).json(resp);return;
  };
  const db_answer = (await db.answers.create({
    id: Snowflake.generate(),
    question: checkId.id,
    user: user.id,
    answer: answer
  })).dataValues;
  resp.content.data = db_answer;
  resp.status = true;
  res.status(200).json(resp);
  return;
});


const getAnswers = asyncHandler(async(req,res)=>{
  const user = req.user;
  const {id} = req.params;
  const resp = {
    status: false,
    content:{
    }
  };
  const checkId = (await db.questionarie.findOne({where:{id:id}})).dataValues;
  if(!checkId){
    resp.content.data = {message:`Quetionary with id ${id} doesnot exists.`};
    res.status(400).json(resp);
  };
  if(checkId.admin != user.id){
    resp.content.data = {message:`Questionarie answer can viewed by only respective admins.`};
    res.status(400).json(resp);
  }
  const questions = await db.questions.findAll({where:{questionarie:id}});
  resp.content.data = [];
  for (const question of questions) {
    const answers = await db.answers.findAll({ where: { question: question.id } });

    if (answers && answers.length > 0) {
      const formattedAnswers = answers.map(answer => ({
        answer: answer.dataValues.answer,
        user: answer.dataValues.user
      }));

      resp.content.data.push({
        Question: question.dataValues.question,
        answers: formattedAnswers
      });
    }
  }
  resp.status =true;
  res.status(200).json(resp);
  return;
})


module.exports = {
  addAnswer,
  getAnswers
}