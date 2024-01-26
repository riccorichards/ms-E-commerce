export interface DeliveryType {
  name: string;
  email: string;
  password: string;
  image: string;
  url: string | null;
  isValid: boolean;
  currentAddress: string;
}

export interface DeliveryDocsType extends DeliveryType {
  id: number;
  createdAt: Date;
}
