type TOrder = {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    items: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    totalAmount: number;
    note?: string;
    deliveryDate: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    location?: string;     
    deliveryFee?: number;
}