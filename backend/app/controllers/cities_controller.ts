import type { HttpContext } from '@adonisjs/core/http'
import City from '#models/city'

export default class CitiesController {
  /**
   * List all Gujarat cities with property counts and landmark images
   */
  async index({ response }: HttpContext) {
    const cities = await City.query().orderBy('properties_count', 'desc')
    return response.ok(cities)
  }
}
