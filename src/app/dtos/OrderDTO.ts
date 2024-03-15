export class DailyMenuDTO {
    idDailyMenu!: number;
    dateMenu!: string;
    regular!: RegularMealDTO;
    fit!: FitMealDTO;
    soup!: ExtraDTO;
    dessert!: ExtraDTO;
}

export interface ExtraDTO {
    id: number;
    name: string;
    description: string;
    extraType: string;
    price: number;
   
}


export interface RegularMealDTO {
    id: number;
    name: string;
    description: string;
    largePrice: number;
    smallPrice: number;
}

export interface FitMealDTO {
    id: number;
    name: string;
    price: number;
    description: string;
    shouldOrderEarly: boolean;
}

export class  OrderDTO {
    orderItems: OrderItemDTO[];
    forToday: boolean;

    constructor(orderItems: OrderItemDTO[],forToday: boolean) {
        this.orderItems=orderItems;
        this.forToday=forToday;
    }
}

export class OrderItemDTO{
    mealId: number;
    mealCount: number;
    mealSize: any;

    constructor(mealId: number,quantity: number, size: any) {
        this.mealId=mealId;
        this.mealCount=quantity;
        this.mealSize=size;
    }
}