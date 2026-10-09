/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  properties: {
    index: typeof routes['properties.index']
    show: typeof routes['properties.show']
    store: typeof routes['properties.store']
    update: typeof routes['properties.update']
    destroy: typeof routes['properties.destroy']
    trending: typeof routes['properties.trending']
  }
  cities: {
    index: typeof routes['cities.index']
  }
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
}
