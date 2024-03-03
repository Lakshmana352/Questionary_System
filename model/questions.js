module.exports = (sequelize,DataTypes) => {
  const questions = sequelize.define('question',{
    id:{
      type: DataTypes.STRING,
      primaryKey: true
    },
    questionarie:{
      type: DataTypes.STRING,
    },
    // question and options are separated by comma.
    question:{
      type: DataTypes.STRING,
    },
    // num is the position of specific question in respective questionary.
    num:{
      type: DataTypes.INTEGER,
    }
  });
  return questions;
}