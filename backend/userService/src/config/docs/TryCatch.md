## TryCatch

`TryCatch` is a higher-order function that wraps an Express route handler with a try-catch block to handle asynchronous errors gracefully. It helps to avoid repetitive try-catch logic in each route handler.

- Parameters
  - `handler`: `RequestHandler` – An Express-compatible route handler function to be wrapped.

- Returns
  - `RequestHandler`: A new route handler function that wraps the original one and catches any thrown errors, returning a 500 Internal Server Error response with the error message.
