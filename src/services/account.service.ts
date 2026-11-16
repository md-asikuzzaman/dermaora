import { AccountUserType } from "@/types/account-user.type";

export async function getAccount(userId: string): Promise<AccountUserType> {
  const response = await fetch(`/api/account/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result: ApiResponse<AccountUserType> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch account information.");
  }

  return result.data;
}
