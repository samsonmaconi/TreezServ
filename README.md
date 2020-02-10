# TreezServ

Treez service to model the current inventory, deducting from inventory as orders are created, and adding inventory back if orders are canceled

## Documentation
Kindly review the [Postman Documentation](https://documenter.getpostman.com/view/5377031/SWTK2syr?version=latest) for more insight into the API.

## Frameworks and Libraries
- **Framework Used**: sails.js
  - **ORM**: Waterline
  - **DB Storage**: sailsdisk
- **Testing**: [Mocha](https://mochajs.org/), [supertest (HTTP assertions)](https://github.com/visionmedia/supertest), [Joi (Schema Validation)](https://hapi.dev/family/joi/)  

## Installation Instructions
- run <code>cd service</code> to navigate to the service root directory
- run <code>npm i</code> to install the required packages

## Testing Instructions
- run <code>npm test</code> to execute the tests

## Server Startup Instructions
- run <code>npm start</code> to start the server at <code>http://localhost:1337</code>

## The more relevant Files and Directories
- <code>service/api/models</code> - Model definitions representing database tables/collections. Showing their *attributes* incuding *relationships* to other *models*.
- <code>service/api/controllers</code> - Server-side actions for handling incoming requests. Showing validation *schemas* and requests handling.
- <code>service/tests</code> - Tests directory
- <code>service/config/bootstrap.js</code> - For seeding the app with fake data before sails is lifted.
- <code>service/config/routes.js</code> - API Endpoints config


## NOTE
I made a compromise on the choice of **datastore**. I chose to use **sails-disk** (more ideal for Development env not Production) to allow easier evaluation setup as no extra DB setup is nessary. However, the datastore of your choice can be used by simply specifying the adapter and url of your database within the <code>service/config/datastore.js</code> file by replacing the following block of code with your appropriate datastore parameters.    
```javascript
    // adapter: 'sails-mysql',
    // url: 'mysql://user:password@host:port/database',
```

The sercice could also benefit from detailed logging of all requests and responses to aid debugging process.

