import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAccount } from "@/services/account.service";
import type {
  AccountUserType,
  UpdateAccountInput,
} from "@/types/account-user.type";

interface UpdateAccountVariables {
  userId: string;
  payload: UpdateAccountInput;
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: UpdateAccountVariables) =>
      updateAccount(userId, payload),

    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData<AccountUserType>(
        ["account", variables.userId],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            user: updatedUser,
          };
        },
      );
    },
  });
}
