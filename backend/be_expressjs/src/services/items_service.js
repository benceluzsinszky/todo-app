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

    async updateItem(updatedItem) {
        let item = await this.getItem(updatedItem.id);
        if (!item.completed && updatedItem.completed) {
            updatedItem.date_completed = new Date(new Date().toUTCString());
        }
        return await prisma.todo_item.update({
            where: {
                id: updatedItem.id
            },
            data: {
                ...updatedItem
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