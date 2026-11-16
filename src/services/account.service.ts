import { AccountUserType, UpdateAccountInput } from "@/types/account-user.type";

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

export async function updateAccount(
  userId: string,
  payload: UpdateAccountInput,
): Promise<AccountUserType["user"]> {
  const response = await fetch(`/api/account/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result: ApiResponse<AccountUserType> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update profile.");
  }

  return result.data.user;
}
