// Types for vehicle and filters
export interface Vehicle {
    id: string;
    title: string;
    price: number;
    location: string;
    year: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    image: string;
    status: string;
    added: string;
}

export interface VehicleFilters {
    minPrice: string;
    maxPrice: string;
    minYear: string;
    maxYear: string;
    fuelType: string;
    status: string;
}

export type VehicleSortOrder = "newest" | "oldest" | "price_low" | "price_high";

export function filterAndSortVehicles(
    vehicles: Vehicle[],
    searchTerm: string,
    filters: VehicleFilters,
    sortOrder: VehicleSortOrder
): Vehicle[] {
    let result = vehicles.filter((vehicle: Vehicle) => {
        // Filter by search term
        if (
            searchTerm &&
            !vehicle.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
            return false;
        }
        // Filter by price range
        if (
            filters.minPrice &&
            vehicle.price < Number.parseInt(filters.minPrice)
        ) {
            return false;
        }
        if (
            filters.maxPrice &&
            vehicle.price > Number.parseInt(filters.maxPrice)
        ) {
            return false;
        }
        // Filter by year range
        if (
            filters.minYear &&
            vehicle.year < Number.parseInt(filters.minYear)
        ) {
            return false;
        }
        if (
            filters.maxYear &&
            vehicle.year > Number.parseInt(filters.maxYear)
        ) {
            return false;
        }
        // Filter by fuel type
        if (
            filters.fuelType &&
            filters.fuelType !== "any" &&
            vehicle.fuelType !== filters.fuelType
        ) {
            return false;
        }
        // Filter by status
        if (
            filters.status &&
            filters.status !== "any" &&
            vehicle.status !== filters.status
        ) {
            return false;
        }
        return true;
    });
    // Sorting
    switch (sortOrder) {
        case "newest":
            result = result.sort(
                (a, b) =>
                    new Date(b.added).getTime() - new Date(a.added).getTime()
            );
            break;
        case "oldest":
            result = result.sort(
                (a, b) =>
                    new Date(a.added).getTime() - new Date(b.added).getTime()
            );
            break;
        case "price_low":
            result = result.sort((a, b) => a.price - b.price);
            break;
        case "price_high":
            result = result.sort((a, b) => b.price - a.price);
            break;
        default:
            break;
    }
    return result;
}
