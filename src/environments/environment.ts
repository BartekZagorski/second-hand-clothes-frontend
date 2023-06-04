export const environment = {
  production: false,
  serverUrl: '/api',
  keycloak: {
    // Url of the Identity Provider
    issuer: 'http://localhost:9000/realms/second-hand',
    // Realm
    realm: 'second-hand',
    clientId: 'second-hand-app',
    //redirect URI
    redirectURI: 'http://localhost:4200/products',
    //scope
    scope: 'openid profile email offline_access',
  },
};