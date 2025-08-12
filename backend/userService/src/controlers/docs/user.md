## loginUser

`loginUser` is an asynchronous function (wrapped with `TryCatch`) that handles OTP generation and sending for user login. It uses Redis to store OTPs and rate-limit requests, then publishes the OTP email message to a RabbitMQ queue.

- Parameters
  - `req`: `Request` – Express request object containing the user’s email in `req.body`.
  - `res`: `Response` – Express response object used to send the HTTP response.

- Returns
  - `Promise<void>` : Sends an HTTP response with status code `200` if OTP is sent successfully. Returns `429` for too many requests and `400` for missing/invalid parameters.

---

## verifyUser

`verifyUser` is an asynchronous function (wrapped with `TryCatch`) that verifies a user’s OTP. It checks the stored OTP in Redis, deletes it upon successful match, creates the user if not found in the database, and generates an authentication token.

- Parameters
  - `req`: `Request` – Express request object containing `email` and `otp` in `req.body`.
  - `res`: `Response` – Express response object used to send the HTTP response.

- Returns
  - `Promise<void>` : Sends `200` status with user data and token upon successful verification, or `400` if OTP is invalid/expired.

---

## myProfile

`myProfile` is an asynchronous function (wrapped with `TryCatch`) that returns the authenticated user’s profile.

- Parameters
  - `req`: `AuthenticatedRequest` – Express request object containing `user` from authentication middleware.
  - `res`: `Response` – Express response object used to send the user profile.

- Returns
  - `Promise<void>` : Sends the authenticated user object in JSON format.

---

## updateName

`updateName` is an asynchronous function (wrapped with `TryCatch`) that updates the logged-in user’s name and returns a new token.

- Parameters
  - `req`: `AuthenticatedRequest` – Express request object containing the authenticated user ID and new name in `req.body`.
  - `res`: `Response` – Express response object used to send the updated user.

- Returns
  - `Promise<void>` : Sends updated user data and a refreshed token.

---

## getAllUsers

`getAllUsers` is an asynchronous function (wrapped with `TryCatch`) that retrieves all users from the database.

- Parameters
  - `req`: `AuthenticatedRequest` – Express request object.
  - `res`: `Response` – Express response object used to send the user list.

- Returns
  - `Promise<void>` : Sends an array of all users.

---

## getAUser

`getAUser` is an asynchronous function (wrapped with `TryCatch`) that retrieves a specific user by their ID.

- Parameters
  - `req`: `Request` – Express request object containing the user ID in `req.params.id`.
  - `res`: `Response` – Express response object used to send the user data.

- Returns
  - `Promise<void>` : Sends the user object in JSON format.
