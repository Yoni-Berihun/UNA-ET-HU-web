
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.create({
            data: {
                email: 'testuser_' + Date.now() + '@example.com',
                fullName: 'Test User',
                password: 'password123', // In real app this should be hashed
                role: 'MEMBER',
            },
        });
        console.log('User created successfully:', user);
    } catch (error) {
        console.error('Error creating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
