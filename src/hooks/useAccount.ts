import { useQuery } from "@tanstack/react-query";
import { getAccount } from "@/services/account.service";

export function useAccount(userId?: string) {
  return useQuery({
    queryKey: ["account", userId],
    queryFn: () => getAccount(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}
