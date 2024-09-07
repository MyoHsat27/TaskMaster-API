export interface UserObject {
    _id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    isAdmin: boolean;
    _v: number;
}

export interface UserCreateObject {
    username: string;
    email: string;
    password: string;
}
