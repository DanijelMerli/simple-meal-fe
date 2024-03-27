export interface ChosenOneDTO {
  users: ChecksListUserDTO[];
  totalPrice: number;
}

export interface ChecksListUserDTO {
  id: number;
  paid: boolean;
  firstName: string;
  lastName: string;
  email: string;
  priceForOrder: number;
}

