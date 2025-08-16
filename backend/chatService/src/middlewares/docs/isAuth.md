## isAuth

`isAuth` is an asynchronous Express middleware function that authenticates a user based on a JWT token provided in the `Authorization` header.  
It verifies the token, decodes the payload, and attaches the authenticated user object to the request for further processing.



### Parameters
- `req`: `AuthenticatedRequest` – Custom Express request type that may contain a `user` property of type `IUser`.  
- `res`: `Response` – Express response object used to send HTTP responses.  
- `next`: `NextFunction` – Function to pass control to the next middleware or route handler.



### Returns
- `Promise<void>` – Calls `next()` if authentication is successful.  
- Sends a `401 Unauthorized` response if:
  - The `Authorization` header is missing or improperly formatted.  
  - The token is invalid or missing required user data.  
  - JWT verification fails.


### Flow
1. Check for the presence of the `Authorization` header.
2. Validate that it starts with `"Bearer "`.
3. Extract the token part from the header.
4. Verify the token using `jwt.verify()` and the `JWT_SECRET` environment variable.
5. Ensure the decoded token contains a valid `user` object.
6. Attach `decodeValue.user` to `req.user`.
7. Call `next()` to proceed to the next middleware or route.

