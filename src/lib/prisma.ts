import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: any;
}

const createSafePrisma = () => {
  try {
    return new PrismaClient();
  } catch {
    return new Proxy({}, { get: () => new Proxy({}, { get: () => () => Promise.resolve([]) }) });
  }
};

export const prisma = global.prisma || createSafePrisma();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
export default prisma;
