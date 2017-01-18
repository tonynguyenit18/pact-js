let server = require('./provider.js');

server = server.listen(8081, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Animal Profile Service listening on http://${host}:${port}`);
});
