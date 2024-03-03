const db = require("../model");
const {Snowflake} = require("@theinternetfolks/snowflake");
const asyncHandler = require("express-async-handler");

const createRole = asyncHandler(async(req,res)=>{
  const resp = {
    status: false,
    content:{}
  }
  const {name} = req.body;
  if(!name){
    resp.content.data = {message:`Name field is mandatory.`};
    res.status(400).json(resp);
    return;
  }
  const check = await db.role.findOne({where:{name:name}});
  if(check){
    resp.content.data = {message:`Role with name ${name} already exists.`};
    res.status(400).json(resp);
    return;
  }
  const role = await db.role.create({
    id: Snowflake.generate(),
    name: name
  });

  resp.content.data = role;
  resp.status = true;
  res.status(200).json(resp);
})

const getAllRoles = asyncHandler(async(req,res)=>{
  const resp = {
    status: true,
    content:{}
  }
  const roles = await db.role.findAll();
  resp.content.data = roles;
  res.status(200).json(resp);
})

module.exports = {
  createRole,
  getAllRoles
}