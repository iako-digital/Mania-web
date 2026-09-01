import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: any;
}

let prismaInstance: any;

try {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ accelerateUrl: 'https://dummy.prisma-data.net' } as any);
  }
  prismaInstance = global.prisma;
} catch (e) {
  if (process.env.NODE_ENV === 'production') {
    prismaInstance = new Proxy({}, { get: () => () => Promise.resolve(null) });
  } else {
    throw e;
  }
}

export const prisma = prismaInstance;
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
export default prisma;
