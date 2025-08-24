import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getListings() {
  return await prisma.listing.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getListingById(id: string) {
  return await prisma.listing.findUnique({
    where: { id },
  });
}

export async function createListing(data: {
  owner: string;
  title: string;
  desc: string;
  price: number;
  lat: number;
  lng: number;
  house: string;
  images: string;
}) {
  return await prisma.listing.create({
    data,
  });
}

export async function updateListingStatus(id: string, status: string) {
  return await prisma.listing.update({
    where: { id },
    data: { status },
  });
}

export async function getAgent(address: string) {
  return await prisma.agent.findUnique({
    where: { address },
  });
}

export async function createAgent(address: string, house: string) {
  return await prisma.agent.create({
    data: { address, house, points: 0 },
  });
}

export async function updateAgentPoints(address: string, points: number) {
  return await prisma.agent.update({
    where: { address },
    data: { points: { increment: points } },
  });
}

export async function getLeaderboard() {
  return await prisma.agent.findMany({
    orderBy: { points: 'desc' },
    take: 10,
  });
}

export async function getHouseTotals() {
  const agents = await prisma.agent.findMany();
  const houseTotals = agents.reduce((acc: Record<string, number>, agent: { house: string; points: number }) => {
    acc[agent.house] = (acc[agent.house] || 0) + agent.points;
    return acc;
  }, {} as Record<string, number>);
  
  return houseTotals;
} 