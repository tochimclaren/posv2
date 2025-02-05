import { IntegerDataType, Model } from "sequelize"

interface ExchangeAttributes {
  id: string
  price: IntegerDataType
}


module.exports = (sequelize: any, DataTypes: any) => {
  class Exchange extends Model<ExchangeAttributes> implements ExchangeAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: string
    price!: IntegerDataType

    static associate(models: any) {
      // define association here
    }
  }
  Exchange.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    price: {
      type: DataTypes.INTEGER
    }
  
  }, {
    sequelize,
    modelName: 'Exchange',
  });
  return Exchange;
};