import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'properties'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.string('city').notNullable().index()
      table.string('location').nullable()
      table.string('mode', 20).notNullable().defaultTo('buy').index() // 'buy' | 'rent' | 'short-term'
      table.string('type', 50).notNullable().index() // 'Villa', 'Apartment', 'Bungalow', etc.
      table.bigInteger('price').notNullable().index()
      table.string('price_label').notNullable()
      table.integer('size').nullable() // sq ft
      table.integer('bedrooms').notNullable().defaultTo(1).index()
      table.integer('bathrooms').notNullable().defaultTo(1)
      table.string('details').nullable()
      table.string('image', 1000).notNullable()
      table.string('tag', 50).nullable() // 'Trending', 'Featured', etc.
      table.boolean('is_trending').defaultTo(false).index()
      table.text('description').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
