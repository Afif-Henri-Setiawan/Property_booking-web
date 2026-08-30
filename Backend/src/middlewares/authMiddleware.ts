import { Request, Response, NextFunction } from 'express';
import { verifyToken, createClerkClient } from '@clerk/clerk-sdk-node';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

export interface AuthRequest extends Request {
  pengguna?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logger.warn('Akses ditolak: Tidak ada token');
    return res.status(401).json({ status: 'error', message: 'Tidak diotorisasi, tidak ada token' });
  }

  try {
    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    } as any);
    
    // Get full user details from Clerk
    const clerkUser = await clerk.users.getUser(decoded.sub);
    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    if (!primaryEmail) {
      throw new Error("No primary email found for Clerk user");
    }

    // Find or create user in our DB
    let pengguna = await prisma.pengguna.findUnique({
      where: { email: primaryEmail }
    });

    if (!pengguna) {
      const nama = clerkUser.firstName ? (clerkUser.firstName + ' ' + (clerkUser.lastName || '')).trim() : "Tamu";
      pengguna = await prisma.pengguna.create({
        data: {
          email: primaryEmail,
          nama: nama,
          kataSandi: "CLERK_MANAGED_OAUTH",
          peran: 'GUEST'
        }
      });
    }

    req.pengguna = pengguna;
    next();
  } catch (error) {
    logger.error({ err: error }, 'Akses ditolak: Token Clerk tidak valid');
    res.status(401).json({ status: 'error', message: 'Tidak diotorisasi, token tidak valid' });
  }
};
