## isAuth

`isAuth` is an asynchronous Express middleware function that authenticates a user based on a JWT token provided in the `Authorization` header.  
It verifies the token, decodes the payload, and attaches the authenticated user object to the request for further processing.

- Parameters
  - `req`: `AuthenticatedRequest` – Custom Express request type that may contain a `user` property of type `IUser`.
  - `res`: `Response` – Express response object used to send HTTP responses.
  - `next`: `NextFunction` – Function to pass control to the next middleware or route handler.

- Returns
  - `Promise<void>` : Calls `next()` if authentication is successful. Sends a `401` response if the `Authorization` header is missing, token is invalid, or verification fails.

