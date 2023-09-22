
const AUTH0_SECRET = process?.env?.SECRET;

export const config = {
    authRequired: false,
    auth0Logout: true,
    secret: String(process.env.SECRET),
    baseURL: 'http://localhost:9000',
    clientID: 'ekVgETOdR2XWhAYnT9sVFloWZDx2dfs2',
    issuerBaseURL: 'https://dev-atfwayiwbxrtxo0y.us.auth0.com'
  };