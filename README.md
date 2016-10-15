# Anonypost

An anonymous location-based posting site for links and discussion.

Uses React.js, Node.js, Express.js and MongoDB

## Development

Set up databases and indexes on MongoDB

```
mongo
use anonypost
db.posts.createIndex({loc: '2dsphere'})
use anonypost_test
db.posts.createIndex({loc: '2dsphere'})
```

Set up environment variables:

```
export ACME_VERIFICATION_URL=/jirblytoon
export RECAPTCHA_SECRET=shhhhhhh
export PORT=3000
export ANONYPOST_SECRET_KEY=secret
export MONGODB_URI='mongodb://localhost:27017/anonypost'
```
