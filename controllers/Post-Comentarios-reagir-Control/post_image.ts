
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import * as toStream from "buffer-to-stream";
import { config } from "dotenv";

config()
v2.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

export class CloudinaryProvider {


  async upload(file: Express.Multer.File, folder: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const maxImageSize = 5 * 1024 * 1024; // Image  === 5MB
   
    if (file.fieldname === "image") {
      if (file.size > maxImageSize) {
        throw new Error("O tamanho da imagem é muito grande");
      }
    }
  
    
    
    
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.log(error);
            
            reject(error)};   
          resolve(result!);
        }
      );
      toStream.default(file.buffer).pipe(upload);
    });
  }

  async delete(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve();
      });
    });
  }

}

export const provider = new CloudinaryProvider();