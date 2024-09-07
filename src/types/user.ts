export interface UserObject {
    _id: string;
    username: string;
    email: string;
    password: string;
    updatedAt: Date;
    createdAt: Date;
    isAdmin: boolean;
}

export interface UserCreateObject {
    username: string;
    email: string;
    password: string;
}
