## APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/forgotPassword

## connectionRequestRouter
- POST /request/send/:status/:toUserId
<!-- - POST /request/send/interested/:toUserId
- POST /request/send/ignored/:userId -->

- POST /request/review/:status/:requestId
<!-- - POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId -->

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed

status: interested, ignored, accepted, rejected


