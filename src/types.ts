export enum Products {
    Gruffle = "gruffle",
    Druffle = "druffle",
    Klintzpaw = "klintzpaw",
    Grogin = "grogin",
    Fizz = "fizz",
}

export enum Resources {
    Ore = "ore",
    Money = "money",
    Treasure = "treasure",
}

export type GoodType = Products | Resources;
export type Goods = Record<Products | Resources, number>;

