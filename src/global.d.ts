import "express-serve-static-core";

export interface JwtUserData {
  username: string!;
}

declare module "express" {
  export interface Request {
    user?: JwtUserData;
  }
}
