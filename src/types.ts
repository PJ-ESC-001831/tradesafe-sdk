export interface TokenInput {
  user: {
    givenName: string;
    familyName: string;
    email: string;
    mobile: string;
    idNumber: string;
    idType: string;
    idCountry: string;
  };
  organization?: {
    name: string;
    tradeName?: string;
    type: string;
    registrationNumber: string;
    taxNumber?: string;
  };
  bankAccount?: {
    bank: string;
    accountNumber: string;
    accountType: string;
  };
}

export interface Token {
  id?: string;
  name?: string;
  reference?: string;
  user: {
    givenName?: string;
    familyName?: string;
    email: string;
    mobile?: string;
    idNumber?: string;
  };
  organization?: {
    name: string;
    tradeName?: string;
    type: string;
    registration: string;
    taxNumber?: string;
  };
}

export interface TransactionInput {
  title: string;
  description: string;
  industry: string;
  currency: string;
  feeAllocation: string;
  allocations: AllocationInput[];
  parties: PartyInput[];
}

export interface Transaction {
  id: string;
  title: string;
  createdAt: string;
}

interface AllocationInput {
  title: string;
  description: string;
  value: number;
  daysToDeliver: number;
  daysToInspect: number;
}

interface PartyInput {
  token: string;
  role: string;
  fee?: number;
  feeType?: string;
  feeAllocation?: string;
}
