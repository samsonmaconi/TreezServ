var sails = require('sails');

// Before running any tests...
before(function(done) {

  // Increase the Mocha timeout so that Sails has enough time to lift, even if you have a bunch of assets.
  this.timeout(5000);

  sails.lift({
    // Your Sails app's configuration files will be loaded automatically,
    // but you can also specify any other special overrides here for testing purposes.

    // For example, we might want to skip the Grunt hook,
    // and disable all logs except errors and warnings:
    hooks: { grunt: false },
    log: { level: 'warn' },

  }, async (err)=> {
    if (err) { return done(err); }

    // here you can load fixtures, etc.

    await Customer.createEach([
      {id: 'test@samsonmaconi.com', firstName: 'Test', lastName: 'Mocha'}
    ])

    return done();
  });
});

// After all tests have finished...
after((done)=> {

  // here you can clear fixtures, etc.
  Customer.destroy({id: 'test@samsonmaconi.com'})
  .then(()=>{
    sails.lower(done);
  })
});
