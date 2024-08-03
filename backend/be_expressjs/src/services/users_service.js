const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();


class UsersService {

    async getUser(username) {
        return await prisma.user.findUniqueOrThrow({
            where: {
                username: username
            }
        });
    };

    async createUser(user) {
        let saltRounds = 12;
        const hash = await bcrypt.hash(user.password, saltRounds);
        user.password = hash;

        return await prisma.user.create({
            data: {
                ...user
            }
        });
    };

    async updateUser(currentUser, updatedUser) {
        return await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                ...updatedUser
            }
        });
    };

    async deleteUser(user) {
        return await prisma.user.delete({
            where: {
                id: user.id
            }
        });
    };
};

module.exports = UsersService;