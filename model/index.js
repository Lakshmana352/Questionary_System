const {Sequelize, DataTypes} = require("sequelize");

const db_name = process.env.DB_NAME;
const db_host = process.env.DB_HOST;
const db_pw = process.env.DB_PW;
const db_user = process.env.DB_USER;

// console.log(db_name,db_host,db_pw,db_user);

const sequelize = new Sequelize(db_name,db_user,db_pw,{
  host: db_host,
  dialect: "mysql"
});

sequelize.authenticate()
  .then(()=>{
    console.log("Database connected successfully.");
  })
  .catch((err)=>{
    console.log(`Error: ${err}`);
  });

const db = {};
db.sequelize = Sequelize;
db.sequelize = sequelize;

db.role = require("./role")(sequelize,DataTypes);
db.user = require("./user")(sequelize,DataTypes);
db.questionarie = require("./questionarie")(sequelize,DataTypes);
db.questions = require("./questions")(sequelize,DataTypes);
db.answers = require("./answers")(sequelize,DataTypes);

db.role.hasMany(db.user,{foreignKey: 'role'});
// db.user.belongsTo(db.role,{foreignKey: 'role'});

db.user.hasMany(db.questionarie,{foreignKey: 'admin'});
// db.questionarie.belongsTo(db.user,{foreignKey: 'admin'});

db.questionarie.hasMany(db.questions,{foreignKey: 'questionarie'});
// db.questions.belongsTo(db.questionarie,{foreignKey: 'questionarie'});

db.questions.hasMany(db.answers,{foreignKey: 'question'});
// db.answers.belongsTo(db.questions,{foreignKey: 'question'});

db.user.hasMany(db.answers,{foreignKey:'user'});
// db.answers.belongsTo(db.user,{foreignKey:'user'});

db.sequelize.options.logging = false;
db.sequelize.sync({force:false})
  .then(()=>{
    console.log(`Re-sync done successfully.`);
  })
  .catch((err)=>{
    console.log(err);
  })


module.exports = db;
