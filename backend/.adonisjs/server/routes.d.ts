import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'properties.index': { paramsTuple?: []; params?: {} }
    'properties.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'properties.store': { paramsTuple?: []; params?: {} }
    'properties.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'properties.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'properties.trending': { paramsTuple?: []; params?: {} }
    'cities.index': { paramsTuple?: []; params?: {} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'properties.index': { paramsTuple?: []; params?: {} }
    'properties.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'properties.trending': { paramsTuple?: []; params?: {} }
    'cities.index': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'properties.index': { paramsTuple?: []; params?: {} }
    'properties.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'properties.trending': { paramsTuple?: []; params?: {} }
    'cities.index': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'properties.store': { paramsTuple?: []; params?: {} }
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'properties.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'properties.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}