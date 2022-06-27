export interface ICategory {
    id: number;
    name: string;
}
export interface ICategoryResponse {
    id: number;
    name: string;
    category_type: {
        id: number;
        name: string;
    };
    require_acceptance: boolean;
    checkin_email : boolean;
    eula: string;
    use_default_eula: boolean;
    image: string;
    assets_count: number;
}
export interface ICategoryRequest {
    id: number;
    name: string;
    category_type: number;
    require_acceptance: boolean;
    checkin_email : boolean;
    eula_text: string;
    use_default_eula: boolean;
    image: string;
}