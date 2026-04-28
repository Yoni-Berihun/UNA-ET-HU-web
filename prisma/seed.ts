import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const teams = [
  { name: 'Model UN Team', slug: 'mun', description: null, image: null },
  { name: 'SDG Ambassadors', slug: 'sdg', description: null, image: null },
  { name: 'Innovation Team', slug: 'innovation', description: null, image: null },
  { name: 'Debate Team', slug: 'debate', description: null, image: null },
  { name: 'Project Team', slug: 'projects', description: null, image: null },
] as const;

async function main() {
  for (const team of teams) {
    await prisma.team.upsert({
      where: { slug: team.slug },
      update: { name: team.name, description: team.description, image: team.image },
      create: { name: team.name, slug: team.slug, description: team.description, image: team.image },
    });
  }

  const count = await prisma.team.count();
  console.log(`Seeded teams. team.count=${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
