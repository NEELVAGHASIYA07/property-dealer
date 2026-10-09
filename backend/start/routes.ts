/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

const PropertiesController = () => import('#controllers/properties_controller')
const CitiesController = () => import('#controllers/cities_controller')

router.get('/', () => {
  return {
    name: 'Fieldhouse Real Estate API',
    status: 'online',
    version: '1.0.0',
    database: 'SQLite (Lucid ORM)',
    endpoints: {
      properties: '/api/properties',
      trending: '/api/trending',
      cities: '/api/cities',
      auth: {
        signup: '/api/v1/auth/signup',
        login: '/api/v1/auth/login',
        profile: '/api/v1/account/profile',
      },
    },
  }
})

// Public Real Estate API Endpoints
router
  .group(() => {
    // Properties
    router.get('properties', [PropertiesController, 'index'])
    router.get('properties/:id', [PropertiesController, 'show'])
    router.post('properties', [PropertiesController, 'store'])
    router.put('properties/:id', [PropertiesController, 'update'])
    router.delete('properties/:id', [PropertiesController, 'destroy'])

    // Trending properties
    router.get('trending', [PropertiesController, 'trending'])

    // Cities
    router.get('cities', [CitiesController, 'index'])
  })
  .prefix('/api')

// Auth & Account API Endpoints
router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
