import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    // 1. Create dealers table
    if (!(await this.schema.hasTable('dealers'))) {
      this.schema.createTable('dealers', (table) => {
        table.increments('id').notNullable()
        table.string('name', 255).notNullable()
        table.string('agency_name', 255).notNullable()
        table.string('phone', 50).notNullable()
        table.string('email', 255).notNullable()
        table.text('profile_photo', 'longtext').notNullable()
        table.string('office_address', 500).nullable()
        table.string('city', 100).nullable().defaultTo('Surat')
        table.string('dealer_type', 100).nullable().defaultTo('Individual Dealer')
        table.string('rera_number', 100).nullable()
        table.text('bio').nullable()
        table.string('verification_status', 50).nullable().defaultTo('Verified')

        table.timestamp('created_at').notNullable()
        table.timestamp('updated_at').nullable()
      })
    }

    // 2. Alter properties table: change image to longtext and add dealer fields
    this.schema.alterTable('properties', (table) => {
      // Modify image column so long base64 data URLs don't trigger ER_DATA_TOO_LONG
      table.text('image', 'longtext').alter()
      table.integer('dealer_id').unsigned().nullable().index()
      table.text('dealer_data', 'longtext').nullable()
    })
  }

  async down() {
    this.schema.alterTable('properties', (table) => {
      table.dropColumn('dealer_id')
      table.dropColumn('dealer_data')
    })
    this.schema.dropTableIfExists('dealers')
  }
}
