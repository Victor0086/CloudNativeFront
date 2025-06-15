export const environment = {
  production: false,
  msalConfig: {
    auth: {
      clientId: 'f836bdc5-14d0-4d55-836f-4ac0bdbb3d08',
      authority: 'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad',
      knownAuthorities: ['login.microsoftonline.com'],
      redirectUri: '/', 
    }
  },
  apiConfig: {
    scopes: ['api://<tu-api-client-id>/access_as_user'],
    uri: 'https://...'
  }
};
