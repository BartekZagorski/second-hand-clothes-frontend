export const environment = {
  production: true,
  secondHandApiUrl: 'https://secondhand.bartlomiejzagorski.pl/api',
  stripePublishableKey: 'pk_test_51MUjj0HVGiMmNmDnMUL9QOuMn9OsIigutBfsvgJDW1o9mZQMU1Mp2kfmodOV9CRcw3DPQITso6CjSXRnCoOc1GVo00Yn68lTAv',
  serverUrl: '/api',
  keycloak: {
    // Url of the Identity Provider
    issuer: 'https://keycloak.bartlomiejzagorski.pl/realms/second-hand',
    // Realm
    realm: 'second-hand',
    clientId: 'second-hand-app',
    //redirect URI
    redirectURI: 'https://secondhand.bartlomiejzagorski.pl/products',
    //scope
    scope: 'openid profile email offline_access',
  },
};