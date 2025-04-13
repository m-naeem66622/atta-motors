import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface ErrorOptions {
    defaultMessage?: string;
    context?: string; // e.g., "create", "update", "fetch", "delete"
    resourceType?: string; // e.g., "vehicle", "user", "profile"
}

interface ErrorResult {
    title: string;
    description: string;
}

/**
 * Processes an API error and returns a formatted error result
 * @param error The error object from the API response
 * @param options Configuration options for the error message
 * @returns An object with title and description for the error
 */
export const processApiError = (
    error: any,
    options: ErrorOptions = {}
): ErrorResult => {
    const status = error.response?.status;
    const defaultContext = options.context || "perform this action";
    const resourceType = options.resourceType || "resource";
    const defaultMessage =
        options.defaultMessage || `Failed to ${defaultContext} ${resourceType}`;

    // Get error message from response if available
    const serverErrorMessage = error.response?.data?.error?.message;

    let title = "Error";
    let description = serverErrorMessage || defaultMessage;

    if (status) {
        switch (status) {
            case 401:
                title = "Authentication Required";
                break;
            case 403:
                title = "Access Denied";
                break;
            case 404:
                title = "Not Found";
                break;
            case 422:
                title = "Validation Error";
                break;
            default:
                title = "Error";
        }
    }

    return {
        title,
        description: getErrorMessage(description),
    };
};

/**
 * Handles an API error by processing it and showing a toast notification
 * @param error The error object from the API response
 * @param options Configuration options for the error message
 * @returns The original error object
 */
export const handleApiError = (error: any, options: ErrorOptions = {}) => {
    const { title, description } = processApiError(error, options);

    toast({
        title,
        description,
        variant: "destructive",
    });

    return error;
};

/**
 * Shows a success toast notification
 * @param title The title for the success message
 * @param description The description for the success message
 */
export const handleApiSuccess = (
    title: string = "Success",
    description: string
) => {
    toast({
        title,
        description,
    });
};
