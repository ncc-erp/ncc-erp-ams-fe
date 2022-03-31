export interface IDashboard {
    status: string;
    messages: string;
}


export interface IStatusAsset  {
    id: number;
    name: string;
    assets_count: number;
}

export interface ICategoryAsset  {
    id: number;
    name: StatusAsset;
    assets_count: number;
    status_labels: IStatusAsset[];
}

export interface ILocation {
    id: number;
    name: string;
    assets_count: number;
    categories: ICategoryAsset[]
}

