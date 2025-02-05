import { IntegerDataType, Model } from 'sequelize';
interface SaleAttributes {
  id: string,
  quantity: IntegerDataType,
  price: IntegerDataType

}

module.exports = (sequelize: any, DataTypes: any) => {
  class Sale extends Model<SaleAttributes> implements SaleAttributes {
    static associate(models: any) {
      // define association here
      Sale.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      Sale.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });
    }
    id!: string;
    quantity!: IntegerDataType;
    price!: IntegerDataType;

  }
  Sale.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Sale',
  });
  return Sale;
};