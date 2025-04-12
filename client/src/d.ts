export type Meta = {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    itemCount: number;
    page: string;
    pageCount: number;
    limit: string;
};

interface BasicResponse<T> {
    status: string;
    data: T;
    meta?: Meta;
    error?: string;
}

export interface BasicPagination {
    page: number;
    limit: number;
    // sort?: SortingState;
}

export interface LoginResponse extends BasicResponse<User> {
    tokens: Tokens;
}

export interface UserResponse extends BasicResponse<User> {}

export interface UsersResponse extends BasicResponse<User[]> {}

interface BasicState {
    isLoading: boolean;
    error: unknown;
    meta?: Meta | null;
}

export interface AuthenticateState extends BasicState {
    isLoggedIn: boolean;
    isUpdateLoading: boolean;
    isCreating: boolean;
    isRefreshing: boolean;
    user: User | null;
    tokens: Tokens | null;
}

export type User = {
    _id: string;
    avatar?: string | null;
    username: string;
    name: string;
    phone: string;
    email: string;
    address?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
};

export type RegisterValues = Omit<
    User,
    "_id" | "avatar" | "role" | "createdAt" | "updatedAt"
> & { file?: File; password: string; confirmPassword: string };

// export type UpdateUserValues = Pick<
//   User,
//   "_id" | "username" | "name" | "phone" | "email"
// >;

export type LogInValues = {
    emailOrUsername: string;
    password: string;
};

export type UpdateUserValues = Pick<User, "name" | "phone" | "address"> & {
    avatar?: File;
    password?: string;
    confirmPassword?: string;
    oldPassword?: string;
};

export type Tokens = {
    accessToken: string;
};

export type SaveNavigationState = {
    saveRoute: string;
    haveModal?: boolean;
};
