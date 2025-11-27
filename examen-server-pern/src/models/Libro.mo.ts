import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';

@Table({
  tableName: 'books'
})
class Book extends Model {
  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  declare name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  declare author: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true
  })
  declare isbn: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false
  })
  declare releaseDate: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN
  })
  declare availability: boolean;
}

export default Book;
