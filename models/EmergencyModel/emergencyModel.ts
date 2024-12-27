// src/models/EmergenciaModel.ts
import { PrismaClient,  typeEmergency} from '@prisma/client';

const prisma = new PrismaClient();

class EmergenciaModel {
  async createEmergencia(data: { name: string; telefone: string; description?: string , type:typeEmergency, latitude: number, longitude: number  }) {
    return prisma.emergencia.create({
      data
    });
  }

  async getEmergencias() {
    return prisma.emergencia.findMany();
  }
  async getEmergenciasByname(name: string) {
    return prisma.emergencia.findFirst({
      where:{
        name
      }
    });
  }

  async updateEmergencia(id: number, data: { name?: string; telefone?: string; description?: string, type:typeEmergency,latitude: number, longitude: number}) {
    return prisma.emergencia.update({
      where: { id },
      data,
    });
  }

  async deleteEmergencia(id: number) {
    return prisma.emergencia.delete({
      where: { id },
    });
  }

  async SearchEmergencia(query : string){
    return await prisma.emergencia.findMany({
      where: {
        OR: [
          {name: {contains: query, mode: 'insensitive'}}
        ]
      }
    })
  }
}

export const emergenciaModel = new EmergenciaModel();
