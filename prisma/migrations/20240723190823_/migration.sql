/*
  Warnings:

  - The values [hospital] on the enum `typeEmergency` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "typeEmergency_new" AS ENUM ('Policia', 'Hospital', 'Faa', 'Bombeiros');
ALTER TABLE "Emergencia" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Emergencia" ALTER COLUMN "type" TYPE "typeEmergency_new" USING ("type"::text::"typeEmergency_new");
ALTER TYPE "typeEmergency" RENAME TO "typeEmergency_old";
ALTER TYPE "typeEmergency_new" RENAME TO "typeEmergency";
DROP TYPE "typeEmergency_old";
ALTER TABLE "Emergencia" ALTER COLUMN "type" SET DEFAULT 'Policia';
COMMIT;
