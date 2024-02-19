/*
  Warnings:

  - Added the required column `author` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "author" TEXT NOT NULL;
