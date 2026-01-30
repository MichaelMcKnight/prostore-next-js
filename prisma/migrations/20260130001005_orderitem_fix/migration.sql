/*
  Warnings:

  - You are about to drop the column `orderItems` on the `Order` table. All the data in the column will be lost.
  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `OrderItem` table. All the data in the column will be lost.

*/

-- DropIndex
DROP INDEX IF EXISTS "orderitem_orderid_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN IF EXISTS "orderItems";

-- OrderItem: change PK to (orderId, productId) and drop old id column

-- 1) Drop the old primary key constraint (named OrderItem_pkey in your file)
ALTER TABLE "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_pkey";

-- 2) Drop the old id column
ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "id";

-- 3) Add the new composite primary key constraint
ALTER TABLE "OrderItem"
  ADD CONSTRAINT "orderitems_orderId_productId_pkey"
  PRIMARY KEY ("orderId", "productId");
