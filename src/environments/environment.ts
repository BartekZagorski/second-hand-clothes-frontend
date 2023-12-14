export const environment = {
  production: false,
  secondHandApiUrl: 'http://localhost:8080/api',
  stripePublishableKey: 'pk_test_51MUjj0HVGiMmNmDnMUL9QOuMn9OsIigutBfsvgJDW1o9mZQMU1Mp2kfmodOV9CRcw3DPQITso6CjSXRnCoOc1GVo00Yn68lTAv',
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