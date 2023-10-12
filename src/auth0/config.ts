import dotenv from "dotenv"

dotenv.config()

export const config = {
    authRequired: false,
    auth0Logout: true,
    secret: String(process.env.SECRET),
    baseURL: process.env.HEROKU_BASE_URL,
    clientID: 'ekVgETOdR2XWhAYnT9sVFloWZDx2dfs2',
    issuerBaseURL: 'https://dev-atfwayiwbxrtxo0y.us.auth0.com'
  };