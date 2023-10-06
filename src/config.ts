// config.js
import dotenv from "dotenv"

dotenv.config()

const developmentConfig = {
    dbUri: `${process.env.MONGO_DATABASE_URL}${process.env.MONGO_DEV_DATABASE_NAME}`, // Development database URI
    appPort: 9000, // Development port
  };
  
  const testingConfig = {
    dbUri: `${process.env.MONGO_DATABASE_URL}${process.env.MONGO_TESTING_DATABASE_NAME}`, // Testing database URI
    appPort: 9001, // Testing port
  };
  
  const productionConfig = {
    dbUri: `${process.env.MONGO_DATABASE_URL}${process.env.MONGO_PROD_DATABASE_NAME}`, // Production database URI
    appPort: 80, // Production port
  };
  
  const environment = process.env.NODE_ENV || 'development';
  
  let envconfig: { dbUri: string | undefined; appPort: number; };
  
  switch (environment) {
    case 'development':
      envconfig = developmentConfig;
      break;
    case 'testing':
      envconfig = testingConfig;
      break;
    case 'production':
      envconfig = productionConfig;
      break;
    default:
      envconfig = developmentConfig; // Default to development
    }

    export default envconfig;
    
    