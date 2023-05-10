export const environment = {
  production: false,
  serverUrl: '/api',
  keycloak: {
    // Url of the Identity Provider
    issuer: 'http://localhost:9000',
    // Realm
    realm: 'SecondHandClothesApp',
    clientId: 'second-hand-angular'
  },
};