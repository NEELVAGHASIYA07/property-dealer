/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'properties.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/properties',
    tokens: [{"old":"/api/properties","type":0,"val":"api","end":""},{"old":"/api/properties","type":0,"val":"properties","end":""}],
    types: placeholder as Registry['properties.index']['types'],
  },
  'properties.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/properties/:id',
    tokens: [{"old":"/api/properties/:id","type":0,"val":"api","end":""},{"old":"/api/properties/:id","type":0,"val":"properties","end":""},{"old":"/api/properties/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['properties.show']['types'],
  },
  'properties.store': {
    methods: ["POST"],
    pattern: '/api/properties',
    tokens: [{"old":"/api/properties","type":0,"val":"api","end":""},{"old":"/api/properties","type":0,"val":"properties","end":""}],
    types: placeholder as Registry['properties.store']['types'],
  },
  'properties.update': {
    methods: ["PUT"],
    pattern: '/api/properties/:id',
    tokens: [{"old":"/api/properties/:id","type":0,"val":"api","end":""},{"old":"/api/properties/:id","type":0,"val":"properties","end":""},{"old":"/api/properties/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['properties.update']['types'],
  },
  'properties.destroy': {
    methods: ["DELETE"],
    pattern: '/api/properties/:id',
    tokens: [{"old":"/api/properties/:id","type":0,"val":"api","end":""},{"old":"/api/properties/:id","type":0,"val":"properties","end":""},{"old":"/api/properties/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['properties.destroy']['types'],
  },
  'properties.trending': {
    methods: ["GET","HEAD"],
    pattern: '/api/trending',
    tokens: [{"old":"/api/trending","type":0,"val":"api","end":""},{"old":"/api/trending","type":0,"val":"trending","end":""}],
    types: placeholder as Registry['properties.trending']['types'],
  },
  'cities.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/cities',
    tokens: [{"old":"/api/cities","type":0,"val":"api","end":""},{"old":"/api/cities","type":0,"val":"cities","end":""}],
    types: placeholder as Registry['cities.index']['types'],
  },
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/logout',
    tokens: [{"old":"/api/v1/account/logout","type":0,"val":"api","end":""},{"old":"/api/v1/account/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/account/logout","type":0,"val":"account","end":""},{"old":"/api/v1/account/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
