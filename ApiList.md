# DevConnect APIs

## authUser
- POST /signup
- POST /login
- POST /logout

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connection Request Router
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review /accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets your profiles of others user on Platforms

Status: ignore, interested, accepted, rejected