-- CreateEnum
CREATE TYPE "typeEmergency" AS ENUM ('Policia', 'hospital', 'Faa', 'Bombeiros');

-- AlterTable
ALTER TABLE "Emergencia" ADD COLUMN     "type" "typeEmergency" DEFAULT 'Policia';
