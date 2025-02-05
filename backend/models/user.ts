import { Model } from 'sequelize'

interface UserAttributes {
  id: string
  username: string
  password: string
  role: string
  salt: string
  sessionToken?: string
}

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: string;
    username!: string;
    password!: string;
    role!: string;
    salt!: string;
    sessionToken!: string;
    static associate(models: any) {
      // define association here
      User.hasMany(models.Product, {
        foreignKey: 'userId',
        as: 'products',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      User.hasMany(models.Sale, {
        foreignKey: 'userId',
        as: 'sales',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "pos"
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sessionToken: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    // getterMethods: {
    //   password() {
    //     return undefined;
    //   },
    // }
  });
  return User;
};