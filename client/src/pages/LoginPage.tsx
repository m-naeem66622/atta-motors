import { FC } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Particles,
    LoadingButton,
} from "@/components";
import { useAppDispatch, useAppState } from "@/hooks";
import { login, setRoute } from "@/redux/store";
import { AppRoutes } from "@/router";

const formSchema = z.object({
    emailOrUsername: z
        .string()
        .min(1, { message: "Email or username is required" }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginPageProps {}

export const LoginPage: FC<LoginPageProps> = () => {
    const { authenticate, saveNavigation } = useAppState();
    const dispatch = useAppDispatch();
    const navigation = useNavigate();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailOrUsername: "",
            password: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            // Here you would typically handle the login process
            const result = await dispatch(login(values)).unwrap();

            console.log("Result:", result);

            if (result.status === "SUCCESS") {
                if (saveNavigation.saveRoute !== "") {
                    setTimeout(() => {
                        navigation(`/${saveNavigation.saveRoute}`);
                        dispatch(setRoute({ saveRoute: "" }));
                    }, 0);
                } else if (result.data.role === "ADMIN") {
                    navigation(AppRoutes.admin);
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-[350px] z-10">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="emailOrUsername"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email or Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter email or username"
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
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <LoadingButton
                                type="submit"
                                className="w-full"
                                isLoading={authenticate.isLoading}
                            >
                                Login
                            </LoadingButton>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            to={AppRoutes.register}
                            className="text-primary hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </CardFooter>
            </Card>
            <Particles
                className="absolute inset-0"
                quantity={1000}
                ease={10}
                color="#000000"
                refresh
            />
        </div>
    );
};
