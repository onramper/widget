<img src="https://onramper.com/wp-content/uploads/2020/06/cropped-Onramper-Logo-2.png"
     alt="Onramper Logo"
     width="300"/>

# Currencies API
The currencies API provides information regarding all currencies within the system. This API is used to populate currency selection drop-downs, and query amount limits for each currency.


## Documentation

https://www.notion.so/onramper/Currencies-API-945773d7db3e4e4183f7d8322045f0f3

## Dependencies

The API requires ***server-currencies-db*** for data persistance. 

#### Database
- Type                - AWS DynamoDb Table
- Schema Repository   - <insert database schema repo server-currencies-db> 

# Deployment
1. Checkout the source from the relevant branch
2. Set environment variable NODE_TOKEN to a GitHub token for your account
3. Authenticate with OnRampers npm registry

##### For local
```shell
$ npm login --scope=@onramper --registry=https://npm.pkg.github.com
Username: <your GitHub username>
Password: <your GitHub access Token>
Email: <your onramper email address>
```
##### For Jenkins
```shell
$ npm config set "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}"
```

4. Build the project

```shell
$ npm install  
$ npm run build
```

5. All deployment assets will appear inside a folder named ~/dist
6. Zip all assets and upload to a AWS Lambda

#### Lambda Configuration
1. Set the Runtime Configuration **Handler** property to **index.handler**
2. Access the **Configurations** tab on the fuction page, and select **Environment** from the navigation on the left.
3. Click **Edit**
4. Click **Add Environment Variable**
5. Add the following environment variables

```shell
CURRENCIES_API_TABLE_NAME = <Name of DynamoDB table>
CURRENCIES_API_AWS_REGION = <The region the table is located in>
CURRENCIES_API_AWS_ENDPOINT_URL = (*optional*) <The endpoint URL if needed>
```

# Development

#### Mandatory Dependencies
- Node/Npm 16.x - https://nodejs.org/en/
- AWS CLI       - https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions

#### Optional Dependencies for Local Deployment
- SAM CLI   - https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html
- Docker    - https://www.docker.com/products/docker-desktop/

Follow the instruction below-

1. Create a feature branch from ***dev***
2. Checkout feature branch to your local machine 
2. Authenticate with OnRampers npm registry
```shell
$ npm login --scope=@onramper --registry=https://npm.pkg.github.com
Username: <your GitHub username>
Password: <your GitHub access Token>
Email: <your onramper email address>
```
3. Install dependencies. Execute the following from the root folder of your project.
```shell
$ npm install  
```

Happy Coding!
