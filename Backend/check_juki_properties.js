const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const juki = await prisma.pengguna.findUnique({
    where: { email: 'juki180506@gmail.com' }
  });
  console.log("Juki ID:", juki?.id);
  
  if (juki) {
    const staffProps = await prisma.propertyStaff.findMany({
      where: { penggunaId: juki.id },
      include: { properti: true }
    });
    console.log("Juki's Staff Properties:", JSON.stringify(staffProps, null, 2));
    
    // Also check if juki has any properties as tuanRumah
    const hostedProps = await prisma.properti.findMany({
      where: { tuanRumahId: juki.id }
    });
    console.log("Juki's Hosted Properties:", JSON.stringify(hostedProps, null, 2));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
