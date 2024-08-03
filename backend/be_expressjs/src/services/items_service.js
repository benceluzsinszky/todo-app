const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class ItemsService {

    async getItemsOfUser(currentUser) {
        return await prisma.todo_item.findMany({
            where: {
                user_id: currentUser.id
            }
        });
    };

    async getItem(id) {
        return await prisma.todo_item.findUniqueOrThrow({
            where: {
                id: id
            }
        });
    };

    async createItem(item) {
        return await prisma.todo_item.create({
            data: {
                ...item
            }
        });
    };

    async updateItem(updated_item) {
        let item = await this.getItem(updated_item.id);
        if (!item.completed && updated_item.completed) {
            updated_item.date_completed = new Date(new Date().toUTCString());
        }
        return await prisma.todo_item.update({
            where: {
                id: updated_item.id
            },
            data: {
                ...updated_item
            }
        });
    };

    async deleteItem(id) {
        return await prisma.todo_item.delete({
            where: {
                id: id
            }
        });
    };
};

module.exports = ItemsService;