export interface Invoice{
    invoiceNumber: string
    clientName: string
    totalAmount: number
    dueDate: string
    id: number
    items:Items[]
    user?:User
    userId: number
}

export interface Items{
    name: string
    quantity: string
    price: string
    description: string
    id: number
    invoiceId: number
}

export interface User{
  name: string
  email: string
  role: string
  userId: number
  password: string
}

export type Pagination = {
    currentPage: number;
    invoicesPerPage: number;
  };

export interface TokenType{
    name: string,
    email: string,
    role: string,
    id: string
}