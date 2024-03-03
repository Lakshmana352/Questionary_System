module.exports = (sequelize,DataTypes) => {
  const answers = sequelize.define('answer',{
    id:{
      type: DataTypes.STRING,
      primaryKey: true
    },
    question:{
      type: DataTypes.STRING,
    },
    user:{
      type: DataTypes.STRING,
    },
    // answer is an option from 1 to no of options.
    answer:{
      type: DataTypes.INTEGER,
    }
  });
  return answers;
}