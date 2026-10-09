import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    const email = (this.resource.email || '').toLowerCase()
    const isAdmin =
      email === 'admin@fieldhouse.re' ||
      email.includes('admin') ||
      email.includes('dealer')

    return {
      ...this.pick(this.resource, [
        'id',
        'fullName',
        'email',
        'createdAt',
        'updatedAt',
        'initials',
      ]),
      role: isAdmin ? 'admin' : 'client',
      isDealer: isAdmin,
    }
  }
}
