const request = require('supertest');

describe('ENDPOINT: GET /api/alive', function () {
  const endpoint = '/api/alive';
  it(`GET ${endpoint} - Health check succeeded`, function (done) {
    request(app).get(endpoint).expect(200).expect({ status: 'pass' }, done);
  });
});
