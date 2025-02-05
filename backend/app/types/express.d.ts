import { Request } from "express";


// declare global {
//     namespace Express {
//         interface Request {
//             identity?: any;
//         }
//     }
// }
interface AuthRequest extends Request {
    // Use `user?:` here instead of `user:`.
    identity?: any;
  }
  