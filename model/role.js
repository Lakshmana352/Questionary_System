module.exports = (sequelize,DataTypes) => {
  const role = sequelize.define('role',{
    id:{
      type: DataTypes.STRING,
      primaryKey: true
    },
    name:{
      type: DataTypes.STRING
    }
  });
  return role;
}