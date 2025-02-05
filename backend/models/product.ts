import { IntegerDataType, Model, UUID } from "sequelize"

interface ProductAttributes {
  id: string,
  name: string,
  price: IntegerDataType,
  isAvailable: boolean
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Product extends Model<ProductAttributes> implements ProductAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: string;
    name!: string;
    price!: IntegerDataType;
    isAvailable!: boolean;

    static associate(models: any) {
      // define association here
      Product.belongsTo(models.User, {
        foreignKey: 'userId',  // Foreign key in the Post model
        as: 'user',
      });
    }
  }
  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    price: DataTypes.INTEGER,
    isAvailable: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};