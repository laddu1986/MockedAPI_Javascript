# Mocked API

This server can mock the responses of an API with files on disk. Most likely to be used in automatic testing or in early development of a API-depending project.

## Usage

### From code
To use this in your test-suite, initialize it like this:

```js
const MockedApi = require('mocked-api');

const api = MockedApi.init({
  port: 3000,
  dir: './mocks'
}).then(() => {
  console.log('done');
});
```

### From CLI
You can also run it from your CLI:

```
$ node_modules/.bin/mocked-api --port 6000 --dir ./mocks
```

## Notes

- POST/PUT/DELETE are not yet implemented. If you need one of those, please ping me and give me some time to work it out.
