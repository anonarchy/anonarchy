# Anonarchy

An anonymous location-based posting site for links and discussion.

Uses React.js, Node.js, Express.js and MongoDB

#### [Donate](https://github.com/anonypost/anonypost/blob/master/donate.md)

##FAQ

[Here!](https://github.com/anonarchy/anonarchy/blob/master/faq.md)

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

## Regnerating SSL Certs

```
sudo certbot certonly --manual
```

When prompted to make the magic strings appear at the magic URLs, do so by changing the `ACME_VERIFICATION_*` environment variables.
