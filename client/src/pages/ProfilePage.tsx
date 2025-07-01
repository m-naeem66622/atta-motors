import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Upload } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Avatar,
    AvatarFallback,
    AvatarImage,
    LoadingButton,
} from "@/components";
import { useAppDispatch, useAppState } from "@/hooks";
import { updateProfile } from "@/redux/store";
import { Helmet } from "react-helmet-async";

const formSchema = z
    .object({
        file: z.instanceof(File).optional(),
        name: z.string().trim().min(1, { message: "Name is required" }),
        phone: z.string().trim().min(1, { message: "Phone is required" }),
        address: z.string().trim().min(1, { message: "Address is required" }),
        password: z.string().optional(),
        confirmPassword: z.string().optional(),
        oldPassword: z
            .string()
            .trim()
            .min(1, { message: "Old password is required" }),
    })
    .refine(
        (data) => {
            if (data.password) {
                return (
                    data.confirmPassword &&
                    data.password === data.confirmPassword
                );
            }
            return true;
        },
        {
            message: "Passwords must match",
            path: ["confirmPassword"],
        }
    )
    .refine(
        (data) => {
            if (data.password) {
                return data.password !== data.oldPassword;
            }
            return true;
        },
        {
            message: "New password must not be the same as old password",
            path: ["password"],
        }
    );

type FormValues = z.infer<typeof formSchema>;

interface ProfilePageProps {}

export const ProfilePage: FC<ProfilePageProps> = () => {
    const { authenticate } = useAppState();
    const dispatch = useAppDispatch();
    const [previewImage, setPreviewImage] = useState<string | null>(
        authenticate.user?.avatar || null
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: authenticate.user!.name,
            phone: authenticate.user!.phone,
            address: authenticate.user?.address,
            password: "",
            confirmPassword: "",
            oldPassword: "",
        },
    });

    const onSubmit = (values: FormValues) => {
        dispatch(updateProfile({ ...values, avatar: values.file }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            form.setValue("file", file);
        }
    };

    return (
        <>
            <Helmet>
                <title>Profile | Atta Motors</title>
            </Helmet>
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden z-10 mx-auto">
                    <div className="bg-gradient-to-r from-gray-500 to-zinc-900 px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-white">
                            Profile
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-white opacity-80">
                            Update your personal information
                        </p>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex flex-col items-center mb-6">
                            <Avatar className="w-24 h-24 mb-4">
                                <AvatarImage src={previewImage || undefined} />
                                <AvatarFallback>
                                    <User className="w-12 h-12" />
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="profilePicture"
                                className="cursor-pointer"
                            >
                                <div className="flex items-center space-x-2 text-sm text-blue-500 hover:text-blue-600">
                                    <Upload size={16} />
                                    <span>Change Profile Picture</span>
                                </div>
                                <input
                                    id="profilePicture"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={
                                                    authenticate.user?.username
                                                }
                                                type="text"
                                                readOnly
                                                disabled
                                                placeholder="Enter your username"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                value={authenticate.user?.email}
                                                type="email"
                                                readOnly
                                                disabled
                                                placeholder="Enter your email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your address"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    New Password
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Confirm New Password
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="oldPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Old Password (required to
                                                    update)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <LoadingButton
                                    type="submit"
                                    className="w-full"
                                    isLoading={authenticate.isUpdateLoading}
                                >
                                    Update Profile
                                </LoadingButton>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};
