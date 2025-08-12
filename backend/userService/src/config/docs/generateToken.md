## generateToken
`generateToken` is a function that generates a signed JSON Web Token (JWT) for a given user object. The token is valid for 15 days and is signed using a secret key from the environment variable.

- Parameters
  - `user`: `any` – The user object or data to be embedded inside the token payload.

- Returns
  - `string`: A signed JWT string that can be used for user authentication.
