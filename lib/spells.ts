import { writeContract, readContract } from "viem/actions";
import { createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";
import abi from "@/contracts/abi.json";

const client = createPublicClient({
  chain: polygonAmoy,
  transport: http(),
});

export async function castSpellToggle(tokenId: bigint, visible: boolean) {
  return writeContract(client, {
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "toggleVisibility",
    args: [tokenId, visible],
  });
}

export async function castSpellSold(tokenId: bigint) {
  return writeContract(client, {
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "markSold",
    args: [tokenId],
  });
}

export async function isNftOwner(tokenId: bigint, address: string) {
  try {
    const owner = await readContract(client, {
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "ownerOf",
      args: [tokenId],
    });
    
    return owner.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return false;
  }
}

export async function getNftVisibility(tokenId: bigint) {
  try {
    return await readContract(client, {
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "visible",
      args: [tokenId],
    });
  } catch (error) {
    console.error("Error getting NFT visibility:", error);
    return false;
  }
}

export async function getNftSoldStatus(tokenId: bigint) {
  try {
    return await readContract(client, {
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "sold",
      args: [tokenId],
    });
  } catch (error) {
    console.error("Error getting NFT sold status:", error);
    return false;
  }
} 