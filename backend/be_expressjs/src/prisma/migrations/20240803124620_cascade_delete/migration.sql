-- DropForeignKey
ALTER TABLE "todo_item" DROP CONSTRAINT "todo_item_user_id_fkey";

-- AddForeignKey
ALTER TABLE "todo_item" ADD CONSTRAINT "todo_item_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
