import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const tk = await prisma.tipeKamar.findMany({ select: { id: true, nama: true }});
  console.log('TipeKamar:', tk);
}
main().catch(console.error).finally(() => prisma.$disconnect());
