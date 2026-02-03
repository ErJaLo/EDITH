export interface User {
    id: string;
    email: string;
    password_hash: string;
    name: string;
    number: number;
    role_id: string;
    active: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
}