import { prisma } from "../../database/prisma"


class Habito_Model {

  async Create(name: string, provinceId: number, description?: string, type?: "CULTURA" | "ALIMENTACAO", photos?: string[]) {

    const result = await prisma.provinceHabitat.create({
      data: {
        name,
        provinceId,
        description,
        type: type,
        photos: photos || []
      }
    })


    return result
  }
  async getProvinceHabitatsById(id: number) {
    try {
      const habitats = await prisma.provinceHabitat.findFirst({
        where: {
          id
        },

      });
      return habitats;
    } catch (error) {
      console.error('Error retrieving province habitats by type:', error);
      throw new Error('Error retrieving province habitats by type');
    }
  }

  async getAllProvinceHabitatsByProvince(provinceId: number) {
    try {
      const habitats = await prisma.provinceHabitat.findMany({
        where: {
          provinceId
        },
        include: {
          province: true,
        },
      });
      return habitats;
    } catch (error) {
      console.error('Error retrieving province habitats:', error);
      throw new Error('Error retrieving province habitats');
    }
  }

  // Pesquisar hábitos de província por tipo
  async getProvinceHabitatsByType(type: "CULTURA" | "ALIMENTACAO") {
    try {
      const habitats = await prisma.provinceHabitat.findMany({
        where: {
          type: type,
        },
        include: {
          province: true,
        },
      });
      return habitats;
    } catch (error) {
      console.error('Error retrieving province habitats by type:', error);
      throw new Error('Error retrieving province habitats by type');
    }
  }

  // Pesquisar hábitos de província por província
  async SearchProvinceHabitatsByProvince(query: string) {
    try {
      const habitats = await prisma.provinceHabitat.findMany({
        where: {
          OR: [
            { province: { name: { contains: query, mode: "insensitive" } } }
          ]
        },
        include: {
          province: true,
        },
      });
      return habitats;
    } catch (error) {
      console.error('Error retrieving province habitats by province:', error);
      throw new Error('Error retrieving province habitats by province');
    }
  }


  async updateProvinceHabitat(id: number, data: { name?: string, provinceId: number, description?: string, type?: "CULTURA" | "ALIMENTACAO" }) {
    try {
      const result = await prisma.provinceHabitat.update({
        where: { id },
        data,
      });
      return result;
    } catch (error) {
      console.error('Error updating province habitat:', error);
      throw new Error('Error updating province habitat');
    }
  }

  async deleteProvinceHabitat(id: number) {
    try {
      const result = await prisma.provinceHabitat.delete({
        where: { id },
      });
      return result;
    } catch (error) {
      console.error('Error deleting province habitat:', error);
      throw new Error('Error deleting province habitat');
    }
  }
}



export const habito = new Habito_Model()