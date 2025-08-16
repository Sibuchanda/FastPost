# upload (Multer + Cloudinary Image Upload Middleware)

`upload` is a configured instance of Multer middleware used to handle image uploads in an Express application.  
It stores files directly on **Cloudinary** using `multer-storage-cloudinary` with specific constraints such as file size, type, and transformation.



### Configuration Details

#### Storage
- **Type**: `CloudinaryStorage`
- **Cloudinary Instance**: Imported from `../config/cloudinary.js`.
- **Folder**: `"chat-images"`
- **Allowed Formats**: `jpg`, `jpeg`, `png`, `gif`, `webp`
- **Transformations**:
  1. Resize: Width = `800px`, Height = `600px`, Crop = `"limit"` (prevents upscaling).
  2. Quality: `"auto"` (Cloudinary automatically chooses optimal quality).

#### Limits
- **File Size**: Maximum `5MB` (`5 * 1024 * 1024` bytes).

#### File Filter
- Accepts only files where the `mimetype` starts with `"image/"`.
- Rejects any non-image file with an error: `"Only image allowed"`.



### Parameters
- `req`: `Request` – Incoming HTTP request object.
- `file`: Uploaded file object containing metadata (name, size, mimetype).
- `cb`: Callback function for Multer’s file filter.


### Returns
- Multer middleware that can be used directly in Express routes for handling single or multiple image uploads.
- If the file is valid, it is uploaded to Cloudinary in the `"chat-images"` folder.
- If invalid, an error is thrown and sent as a response.


