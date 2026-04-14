"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VAULT_FACTORY_ABI } from "@/lib/abis";
import { VAULT_FACTORY_ADDRESS } from "@/lib/constants";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;

export function useIsRegistered() {
  const { address } = useAccount();
  return useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VAULT_FACTORY_ABI,
    functionName: "isUserRegistered",
    args: [address ?? ZERO_ADDRESS],
    query: { enabled: !!address },
  });
}

export function useUserVaults() {
  const { address } = useAccount();
  const { data: isRegistered } = useIsRegistered();
  return useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VAULT_FACTORY_ABI,
    functionName: "getUserVaults",
    args: [address ?? ZERO_ADDRESS],
    query: { enabled: !!address && !!isRegistered },
  });
}

export function useUserInfo() {
  const { address } = useAccount();
  return useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VAULT_FACTORY_ABI,
    functionName: "getUserInfo",
    args: [address ?? ZERO_ADDRESS],
    query: { enabled: !!address },
  });
}

export function useRegisterUser() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const register = (username: string, bio: string) => {
    writeContract({
      address: VAULT_FACTORY_ADDRESS,
      abi: VAULT_FACTORY_ABI,
      functionName: "registerUser",
      args: [username, bio],
    });
  };

  return { register, isPending, isConfirming, isSuccess, hash, error };
}

export function useCreateVault() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createVault = (asset: `0x${string}`, name: string, symbol: string) => {
    writeContract({
      address: VAULT_FACTORY_ADDRESS,
      abi: VAULT_FACTORY_ABI,
      functionName: "createVault",
      args: [asset, name, symbol],
    });
  };

  return { createVault, isPending, isConfirming, isSuccess, hash, error };
}
