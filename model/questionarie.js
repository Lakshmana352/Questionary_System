module.exports = (sequelize,DataTypes) => {
  const questionarie = sequelize.define('questionarie',{
    id:{
      type: DataTypes.STRING,
      primaryKey: true
    },
    name:{
      type: DataTypes.STRING,
    },
    admin:{
      type: DataTypes.STRING,
    }
  });
  return questionarie;
}