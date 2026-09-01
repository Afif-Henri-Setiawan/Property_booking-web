import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.pengguna.findMany({ select: { id: true, nama: true, email: true, role: true }});
  const props = await prisma.properti.findMany({ select: { id: true, nama: true, tuanRumahId: true }});
  const staff = await prisma.propertyStaff.findMany();
  console.log('Users:', users);
  console.log('Properties:', props);
  console.log('Staff:', staff);
}
main().catch(console.error).finally(() => prisma.$disconnect());
