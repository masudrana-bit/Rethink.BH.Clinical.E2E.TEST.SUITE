import { test } from '../../src/fixtures/test';

test.describe('Seed', () => {
  test('seed - signed in as BCBA on the seeded client', async ({ flows, testData }) => {
    await flows.signInAs('bcba');
    await flows.openClient(testData.clients.seeded);
  });
});
