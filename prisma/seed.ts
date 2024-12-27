import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

  async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('suzana', salt);


  const superAdminUser = await prisma.post.update({
    where:{
      id: 192
    },
   data:{
  postType: 'ANUNCIO'
   }
    
  });

  console.log({ superAdminUser });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }) 
  

  
/* 

 const businessAreas = [
    
    { name: "Educação", description: "Escolas, Cursos Online, Centros de Formação Profissional, Tutoria" },
    { name: "Alimentação e Bebidas", description: "Restaurantes, Cafeterias, Serviços de Catering, Distribuidores de Alimentos" },
    { name: "Serviços Financeiros", description: "Consultoria Financeira, Contabilidade, Seguros, Investimentos" },
    { name: "Comércio", description: "Varejo, Comércio Eletrônico, Distribuição, Comércio Atacadista" },
    { name: "Imobiliário", description: "Corretagem, Gestão de Propriedades, Desenvolvimento Imobiliário, Locação" },
    { name: "Indústria", description: "Manufatura, Engenharia, Automotivo, Química" },
    { name: "Transporte e Logística", description: "Transportadoras, Serviços de Entrega, Logística e Armazenagem, Gestão de Frotas" },
    { name: "Marketing e Publicidade", description: "Agências de Publicidade, Marketing Digital, Relações Públicas, Branding" },
    { name: "Turismo e Hospitalidade", description: "Hotéis, Agências de Viagem, Operadoras de Turismo, Serviços de Concierge" },
    { name: "Construção", description: "Construção Civil, Arquitetura e Design, Manutenção Predial, Engenharia Civil" }
  ];
  
  async function main1() {
    for (const area of businessAreas) {
      await prisma.businessArea.create({
        data: area,
      });
    }
  }
  
  main1()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    }); */
   /* 
 const emergencies = [
  { name: "Ambulância", description: "Emergências médicas.", telefone: "116" },
  { name: "Defesa Civil", description: "Emergências relacionadas a desastres naturais.", telefone: " " },
];

async function main2() {
  for (const emergency of emergencies) {
    await prisma.emergencia.create({
      data: emergency,
    });
  }
} 

main2()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 

 

   const touristSpots = [
    { name: "Ilha do Mussulo", provinceId: 1, latitude: -8.926592, longitude: 13.151194, endereco: "Ilha do Mussulo, Luanda", localType: "ZONA_TURISTICA" },
    { name: "Baía Azul", provinceId: 2, latitude: -12.546426, longitude: 13.399593, endereco: "Baía Azul, Benguela", localType: "ZONA_TURISTICA"  },
    // Adicione mais zonas turísticas conforme necessário
  ];

  async function main3() {
  for (const spot of touristSpots) {
    await prisma.touristSpot.create({
     data: {
      name: spot.name,
      provinceId: spot.provinceId,
      localType: 'ZONA_TURISTICA',
      latitude: spot.latitude,
      longitude: spot.longitude,
     address: spot.endereco,
     }
    });
  }
}

main3()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
 
 import {LocalType } from '@prisma/client';

async function main4() {
  

  const pontosTuristicos = [
  
    {
      id: 2,
      name: 'Praia Morena',
      latitude: -12.5789,
      longitude: 13.4070,
      endereco: 'Benguela',
      localType: LocalType.ZONA_TURISTICA,
          },
    {
      id: 1,
      name: 'Parque Nacional da Kissama',
      latitude: -9.7500,
      longitude: 13.3500,
      endereco: 'Luanda',
      localType: LocalType.ZONA_TURISTICA,
          },
    {
      id: 14,
      name: 'Tundavala Fissure',
      latitude: -14.9526,
      longitude: 13.5763,
      endereco: 'Lubango',
      localType: LocalType.ZONA_TURISTICA,
          },
    {
      id: 1,
      name: 'Cabo Ledo',
      latitude: -9.6333,
      longitude: 13.1500,
      endereco: 'Luanda',
      localType: LocalType.ZONA_TURISTICA,
          },
    {
      id: 10,
      name: 'Caves of Zenza',
      latitude: -10.7158,
      longitude: 15.1839,
      endereco: 'Cuanza Norte',
      localType: LocalType.ZONA_TURISTICA,
          },
    {
      id: 5,
      name: 'Pedras Negras de Pungo Andongo',
      latitude: -9.7282,
      longitude: 15.5564,
      endereco: 'Malanje',
      localType: LocalType.ZONA_TURISTICA,
          },
    {
      id: 8,
      name: 'Arco',
      latitude: -15.1961,
      longitude: 12.1528,
      endereco: 'Namibe',
      localType: LocalType.ZONA_TURISTICA,
          },
    {
      id: 1,
      name: 'Ilha do Mussulo',
      latitude: -8.9702,
      longitude: 13.2035,
      endereco: 'Luanda',
      localType: LocalType.ZONA_TURISTICA,
          },
    {
      id: 1,
      name: 'Palácio de Ferro',
      latitude: -8.8157,
      longitude: 13.2400,
      endereco: 'Luanda',
      localType: LocalType.ZONA_TURISTICA,
          },
  ];

  

    for (const ponto of pontosTuristicos) {
      await prisma.touristSpot.create({
        data: {
              name: ponto.name,
              address: ponto.endereco,
              latitude: ponto.latitude,
              localType: ponto.localType,
              longitude: ponto.longitude,
          province: {
            connect: { id:  ponto.id },
          },
        },
      });
    }
  }


main4()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 


async function main5() {
  await prisma.provinceHabitat.createMany({
    data: [
      
      {
        name: "Feira Gastronômica de Luanda",
        provinceId: 1, // Assumindo que a província de Luanda tem ID 2
        description: "A Feira Gastronômica de Luanda oferece uma variedade de pratos típicos angolanos, permitindo aos visitantes experimentar os sabores autênticos da culinária local.",
        type: "ALIMENTACAO",
      
      },
      {
        name: "Festival do Dundo",
        provinceId: 17, // Assumindo que a província de Lunda Norte tem ID 3
        description: "O Festival do Dundo celebra a diversidade cultural da província de Lunda Norte, destacando suas tradições e danças folclóricas.",
        type: "CULTURA",
        
      },
      {
        name: "Festa da Praia Morena",
        provinceId: 2, // Assumindo que a província de Benguela tem ID 4
        description: "A Festa da Praia Morena é um evento popular em Benguela, conhecido por suas atividades recreativas na praia e competições de natação.",
        type: "CULTURA",
        
      },
      {
        name: "Semana Gastronômica do Huambo",
        provinceId: 3, // Assumindo que a província de Huambo tem ID 5
        description: "A Semana Gastronômica do Huambo destaca a culinária local, oferecendo pratos tradicionais preparados por chefs renomados da região.",
        type: "ALIMENTACAO",
      }
    ]
  });
}

main5()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
  */