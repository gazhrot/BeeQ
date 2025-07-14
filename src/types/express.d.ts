import { User } from '@prisma/client';

// This uses a feature called "declaration merging" to add our custom property
// to the existing Request interface from the Express library.
declare global {
  namespace Express {
    export interface Request {
      // We define the user property as optional (?) because it only exists
      // on requests that have passed through the AuthGuard.
      user?: User;
    }
  }
}
