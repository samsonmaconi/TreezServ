# TreezServ

Treez service to model the current inventory, deducting from inventory as orders are created, and adding inventory back if orders are canceled

## Documentation
- **API Documentation**: [Postman Documentation](https://documenter.getpostman.com/view/5377031/SWTK2syr?version=latest)

## Frameworks and Libraries
- **Framework Used**: sails.js
  - **ORM**: Waterline
  - **DB Storage**: sailsdisk
- **Testing**: [Mocha](https://mochajs.org/), [supertest](https://github.com/visionmedia/supertest)  

## Installation Instructions
- run <code>cd service</code> to navigate to the service root directory
- run <code>npm i</code> to install the required packages

## Testing Instructions
- run <code>npm test</code> to execute the tests

## Server Startup Instructions
- run <code>npm start</code> to start the server at <code>http://localhost:1337</code>
