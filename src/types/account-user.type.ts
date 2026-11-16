export interface AccountUserType {
  user: {
    id: string;
    name: string | null;
    email: string;
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
