export interface MenuDTO {
    idFoodMenu: number;
    typeMenu: string;
    size: string;
    price: number;
    description: string;
    isSpecial: boolean;
}

export interface WeeklyMenuDTO {
    idWeeklyMenu: number;
    dailyMenu: Array<DailyMenuDTO>;
    startDate: string;
}

export interface DailyMenuDTO {
    idDailyMenu: number;
    dateMenu: string;
    regular: MealsDTO;
    fit: MealsDTO;
    soup: ExtraDTO;
    dessert: ExtraDTO;
}

export interface ExtraDTO {
    idExtra: number;
    name: string;
    description: string;
    extraType: string;
    price: number;
}

export interface MealsDTO {
    idFoodMenu: number;
    name: string;
    typeMenu: string;
    size: string;
}