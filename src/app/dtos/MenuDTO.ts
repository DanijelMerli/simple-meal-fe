export interface WeeklyMenuDTO {
    idWeeklyMenu: number;
    dailyMenu: Array<DailyMenuDTO>;
    startDate: string;
}

export interface DailyMenuDTO {
    idDailyMenu: number;
    dateMenu: string;
    regular: RegularMealDTO;
    fit: FitMealDTO;
    soup: ExtraDTO;
    dessert: ExtraDTO;
}

export interface ExtraDTO {
    id: number;
    name: string;
    description: string;
    extraType: string;
    price: number;
}

export interface CreateExtraDTO {
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

export interface CreateRegularMealDTO {
    name: string;
    description: string;
    largePrice: number;
    smallPrice: number;
}

export interface FitMealDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    shouldOrderEarly: boolean;
}

export interface CreateFitMealDTO {
    name: string;
    description: string;
    price: number;
    shouldOrderEarly: boolean;
}
