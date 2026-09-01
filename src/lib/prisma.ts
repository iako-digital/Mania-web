import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: any;
}

let prismaInstance: any;

try {
  prismaInstance = global.prisma || new PrismaClient({ accelerateUrl: 'https://dummy.prisma-data.net' } as any);
} catch (e) {
  prismaInstance = new Proxy({}, { get: () => () => Promise.resolve(null) });
}

export const prisma = prismaInstance;
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
export default prisma;
