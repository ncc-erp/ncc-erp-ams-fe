export interface IRequest {
    name: string;
    branch_id: string;
    supplier_id: string;
    entry_id: number;
    note: string;
    asset_ids: {
        id: number;
        name: string;
    }
}