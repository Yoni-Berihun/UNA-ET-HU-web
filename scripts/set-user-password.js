const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

function normalizeArgs(argv) {
  // Support users typing flags as: "-- email" instead of "--email".
  // E.g. ["--", "email", "a@b.com"] => ["--email", "a@b.com"]
  const merged = [];
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];

    if (token === '--') {
      const next = argv[i + 1];
      if (typeof next === 'string' && next.length > 0) {
        merged.push(`--${next}`);
        i += 1;
        continue;
      }
    }

    merged.push(token);
  }
  return merged;
}

function getArgValue(argv, flag) {
  const index = argv.indexOf(flag);
  if (index === -1) return undefined;
  return argv[index + 1];
}

function hasFlag(argv, flag) {
  return argv.includes(flag);
}

async function main() {
  const argv = normalizeArgs(process.argv);

  const email = getArgValue(argv, '--email');
  const password = getArgValue(argv, '--password');
  const role = getArgValue(argv, '--role');
  const createIfMissing = hasFlag(argv, '--create');

  if (!email || !password) {
    console.error(
      'Usage: node scripts/set-user-password.js --email <email> --password <newPassword> [--role SUPER_ADMIN|ADMIN|MEMBER|GUEST] [--create]'
    );
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('Password must be at least 6 characters.');
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser && !createIfMissing) {
      console.error(
        `User not found for email: ${email}. Re-run with --create to create the user.`
      );
      process.exit(1);
    }

    const data = {
      password: hashedPassword,
      ...(role ? { role } : {}),
    };

    const user = existingUser
      ? await prisma.user.update({ where: { email }, data })
      : await prisma.user.create({
          data: {
            email,
            fullName: email.split('@')[0],
            role: role || 'SUPER_ADMIN',
            password: hashedPassword,
          },
        });

    console.log(
      `✅ Password set successfully for ${user.email}. Role: ${user.role}. (Password is hashed in DB)`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Failed to set password:', err);
  process.exit(1);
});
