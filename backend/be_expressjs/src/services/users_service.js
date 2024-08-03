const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();


class UsersService {

    async getUser(username) {
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        });
        return user;
    };

    async createUser(user) {
        const saltRounds = 12;
        const hash = await bcrypt.hash(user.password, saltRounds);
        user.password = hash;

        user = await prisma.user.create({
            data: {
                ...user
            }
        });
        return user;
    };

    async updateUser(currentUser, updatedUser) {
        user = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                ...updatedUser
            }
        });
        return user;
    };

    async deleteUser(user) {
        user = await prisma.user.delete({
            where: {
                id: user.id
            }
        });
        return user;
    };
};

module.exports = UsersService;