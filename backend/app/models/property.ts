import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Dealer from './dealer.js'

export default class Property extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare city: string

  @column()
  declare location: string | null

  @column()
  declare mapUrl: string | null

  @column()
  declare mode: 'buy' | 'rent' | 'short-term'

  @column()
  declare type: string

  @column()
  declare price: number

  @column()
  declare priceLabel: string

  @column()
  declare size: number | null

  @column()
  declare bedrooms: number

  @column()
  declare bathrooms: number

  @column()
  declare details: string | null

  @column()
  declare image: string

  @column()
  declare images: string | null

  @column()
  declare tag: string | null

  @column()
  declare isTrending: boolean

  @column()
  declare description: string | null

  @column()
  declare dealerId: number | null

  @column()
  declare dealerData: string | null

  @belongsTo(() => Dealer)
  declare dealer: BelongsTo<typeof Dealer>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
