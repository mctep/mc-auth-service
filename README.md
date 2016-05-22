# Simple Auth Service [![Build Status](https://travis-ci.org/mctep/mc-auth-service.svg?branch=master)](https://travis-ci.org/mctep/mc-auth-service) [![Dependency Status](https://gemnasium.com/mctep/mc-auth-service.svg)](https://gemnasium.com/mctep/mc-auth-service) [![codecov](https://codecov.io/gh/mctep/mc-auth-service/branch/master/graph/badge.svg)](https://codecov.io/gh/mctep/mc-auth-service)

It is a simple back-end auth service for storing users, passwords and access tokens with [JSON API v1.0](http://jsonapi.org/). Here are no roles or privileges, it should be implemented at separate Access Control Level service.

It can be used for building applications based on [Microservices Architecture](http://microservices.io/patterns/microservices.html).

At the moment it uses the simplest token authorization. You create user, create access token for him and save it where you want (cookies or session). You can exchange token for user representation.

It is a back-end so it MUST be hidden by firewall and only trusted applications should have access to it.

## Dependencies

Service based on [Fortune.js](https://github.com/fortunejs/fortune) with [NeDB](https://github.com/louischatriot/nedb) [Adapter](https://github.com/fortunejs/fortune-nedb). Password hashes generates by [BcryptJS](https://github.com/dcodeIO/bcrypt.js).

## Endpoints

According to [JSON API v1.0](http://jsonapi.org/format/#content-negotiation-clients) specification for client responsibilities any request to a server must have headers:

```
Accept:application/vnd.api+json
Content-Type:application/vnd.api+json
```

All records have unique `uid` field.

### /users

#### Attributes

* `service` — *string* Required. Service name. Single user can to sign in many services.
* `username` — *string* Required. Unique string identificator.
* `password` — *string* Optional. Password.
* `hasPassword` — *boolean* Computed. Shows that user has password.
* `info` — *object* Optional. Any additional information for your needs. It can be used for making ACL or storing emails.

Has many `accessTokens`.

Acceptable methods: `POST`

### /access-tokens

#### Attributes

* `code` — *string* Computed. Random unique value of access token.
* `expiresAt` — *date* Optional.

Has one `user`.

Acceptable methods: `POST`
