export class OrderDisplayItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
    type: string
    
    
    constructor (id:number, name:string,quantity:number=1, price:number, type: string) {
        this.id=id;
        this.name=name;
        this.quantity=quantity;
        this.price= price;
        this.type=type;
        this.totalPrice=price*quantity;
    }
    
}