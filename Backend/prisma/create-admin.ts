import prisma from '../src/config/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const hash = await bcrypt.hash('password', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@factory.com' },
    update: { password: hash, name: 'Admin User', role: 'ADMIN' },
    create: { email: 'admin@factory.com', password: hash, name: 'Admin User', role: 'ADMIN' },
  });
  console.log('Done:', user.email, '| role:', user.role);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
