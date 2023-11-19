import dotenv from "dotenv"

dotenv.config()

const developmentConfig = {
    dbUri: `${process.env.MONGO_DATABASE_URL}${process.env.MONGO_DEV_DATABASE_NAME}`, // Development database URI
    appPort: 9000, 
  };
  
  const testingConfig = {
    dbUri: `${process.env.MONGO_DATABASE_URL}${process.env.MONGO_TESTING_DATABASE_NAME}`, // Testing database URI
    appPort: 9001,
  };
  
  const productionConfig = {
    dbUri: `${process.env.MONGO_DATABASE_URL}${process.env.MONGO_PROD_DATABASE_NAME}`, // Production database URI
    appPort: 80,
  };
  
  const environment = process.env.NODE_ENV || 'development';
  
  let configENV: { dbUri: string; appPort: number; };
  
  switch (environment) {
    case 'development':
      configENV = developmentConfig;
      break;
    case 'testing':
      configENV = testingConfig;
      break;
    case 'production':
      configENV = productionConfig;
      break;
    default:
      configENV = developmentConfig;
    }

    export default configENV;
    
    