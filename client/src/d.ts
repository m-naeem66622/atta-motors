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

export type MaintenanceAppointment = {
    _id: string;
    userId: string;
    maintenanceType: string;
    specificService: string;
    appointmentDate: string;
    appointmentTime: string;
    status: "Scheduled" | "Completed" | "Cancelled";
    vehicle: {
        make: string;
        model: string;
        year: string;
        registration: string;
    };
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    technician: string | null;
    cost: string | null;
    notes: string;
    additionalNotes: string;
    createdAt: string;
    updatedAt: string;
    formattedDate?: string;
};

export type TimeSlot = {
    time: string;
    available: boolean;
};

export interface MaintenanceResponse
    extends BasicResponse<MaintenanceAppointment> {}
export interface MaintenanceHistoryResponse
    extends BasicResponse<MaintenanceAppointment[]> {}
export interface MaintenanceAvailabilityResponse
    extends BasicResponse<{
        date: string;
        availability: {
            morning: TimeSlot[];
            afternoon: TimeSlot[];
            evening: TimeSlot[];
        };
    }> {}

export interface MaintenanceState extends BasicState {
    isUpdating: boolean;
    isCreating: boolean;
    appointments: MaintenanceAppointment[];
    currentAppointment: MaintenanceAppointment | null;
    availability: {
        date: string;
        slots: Record<string, TimeSlot[]>;
    } | null;
}

export type Vehicle = {
    _id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage?: number;
    fuelType?: string;
    transmission?: string;
    condition?: string;
    exteriorColor?: string;
    interiorColor?: string;
    description?: string;
    images?: string[];
    location?: string;
    contactNumber?: string;
    contactEmail?: string;
    owner: string; // User ID of seller
    status: "available" | "sold" | "reserved";
    createdAt: string;
    updatedAt: string;
};

export type SearchParams = {
    page?: number;
    limit?: number;
    make?: string;
    model?: string;
    minYear?: number;
    maxYear?: number;
    minPrice?: number;
    maxPrice?: number;
    transmission?: string;
    fuelType?: string;
    bodyType?: string;
    condition?: string;
    sort?: string;
};

export interface VehicleResponse extends BasicResponse<Vehicle> {}

export interface VehiclesResponse extends BasicResponse<Vehicle[]> {}

export interface VehiclesState extends BasicState {
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    vehicles: Vehicle[];
    foundVehicle: Vehicle | null;
    searchParams?: SearchParams;
}
