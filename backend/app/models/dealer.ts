import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Property from './property.js'

export default class Dealer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare agencyName: string

  @column()
  declare phone: string

  @column()
  declare email: string

  @column()
  declare profilePhoto: string

  @column()
  declare officeAddress: string | null

  @column()
  declare city: string | null

  @column()
  declare dealerType: string | null

  @column()
  declare reraNumber: string | null

  @column()
  declare bio: string | null

  @column()
  declare verificationStatus: string | null

  @hasMany(() => Property)
  declare properties: HasMany<typeof Property>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
