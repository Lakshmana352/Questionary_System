const db = require("../model");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const {getToken} = require("../middleware/auth");
const { Snowflake } = require("@theinternetfolks/snowflake");

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
const signUp = asyncHandler(async(req,res)=>{
  const resp = {
    status: false,
    content: {},
    meta: {}
  }
  const {name,email,role,password} = req.body;
  if(!name || !email || !role || !password){
    resp.content.data = {message:`All fields are mandatory.`};
    res.status(400).json(resp);return;
  }
  if(!isValidEmail(email)){
    resp.content.data = {message:"Email is not valid."};
    res.status(400).json(resp);
    return;
  }
  const checkEmail = await db.user.findOne({where:{email:email}});
  if(checkEmail){
    resp.content.data = {message:`User with email ${email} already exists.`};
    res.status(400).json(resp);return;
  }
  const checkRole = await db.role.findOne({where:{name:role}});
  if(!checkRole){
    resp.content.data = {message:`Role with name ${role} doesnot exists.`};
    res.status(400).json(resp);return;
  }
  let salt = process.env.SALT_ROUNDS;
  salt = Number(salt);
  const hashedPassword = await bcrypt.hash(password,salt);
  var user = await db.user.create({
    id: Snowflake.generate(),
    name: name,
    email: email,
    role: checkRole.dataValues.id,
    password: hashedPassword
  });
  user = user.dataValues;
  // console.log(user);
  const token = getToken(user);
  resp.status = true;
  resp.content.data = user;
  resp.content.meta = {token: token};
  res.status(200).json(resp);
})
const signIn = asyncHandler(async(req,res)=>{
  const resp = {
    status: false,
    content: {}
  };
  const {email,password} = req.body;
  if(!email || !password){
    resp.content.data = {message: `All fields are mandatory.`}
    res.status(400).json(resp);
    return;
  }
  var check = await db.user.findOne({where:{email:email}});
  if(!check){
    resp.content.data = {message:`User with email ${email} does not exists.`};
    res.status(400).json(resp);
  }
  check = check.dataValues;
  if(!(await bcrypt.compare(password,check.password))){
    resp.content.data = {message:`Password or email is wrong try again by correcting.`};
    res.status(400).json(resp);
  }
  // console.log(check);
  const token = getToken(check);
  resp.status = true;
  resp.content.data = {message: "SignIn Successful."};
  resp.content.meta = {token: token};
  res.status(200).json(resp);
});

module.exports = {
  signIn,
  signUp
}