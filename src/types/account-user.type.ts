export interface AccountUserType {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    image: string | null;
    role: "USER" | "ADMIN";
    createdAt: string;
  };

  orderSummary: {
    total: number;
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    returned: number;
  };
}

export interface UpdateAccountInput {
  name: string;
  phone: string;
}

export interface AccountApiResponse {
  success: boolean;
  message: string;
  data: AccountUserType;
}

export interface UpdateAccountApiResponse {
  success: boolean;
  message: string;
  data: {
    user: AccountUserType["user"];
  };
}
