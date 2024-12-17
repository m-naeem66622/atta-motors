import { FC, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Particles,
} from "@/components";
import { User, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const formSchema = z
  .object({
    avatar: z.instanceof(File).optional(),
    username: z
      .string()
      .trim()
      .min(1, { message: "Username is required" })
      .refine((val) => !/\.\./.test(val), {
        message: "Username must not contain consecutive dots.",
      })
      .refine((val) => !/\.$/.test(val), {
        message: "Username must not end with a dot.",
      })
      .refine((val) => val.length <= 30, {
        message: "Username must be at most 30 characters long.",
      })
      .refine((val) => /^[a-zA-Z0-9_.]+$/.test(val), {
        message:
          "Username can only contain letters, numbers, underscores, and dots.",
      })
      .refine((val) => /^[^\W]/.test(val), {
        message: "Username must start with a letter or number.",
      }),
    name: z.string().trim().min(1, { message: "Name is required" }),
    phone: z.string().trim().min(1, { message: "Phone is required" }),
    email: z.string().trim().email().min(1, { message: "Email is required" }),
    address: z.string().trim().min(1, { message: "Address is required" }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

interface RegisterPageProps {}

export const RegisterPage: FC<RegisterPageProps> = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Here you would typically handle the registration process
    console.log(values);
  };

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        form.setValue("avatar", file);
      }
    },
    [form]
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-zinc-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden z-10">
        <div className="bg-gradient-to-r from-gray-500 to-zinc-900 p-4 text-white text-center">
          <h2 className="text-2xl font-bold">Join Atta Motors Today</h2>
          <p className="text-sm opacity-75">Start your journey with us</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-6"
          >
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={previewImage || undefined} />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <label htmlFor="profilePicture" className="cursor-pointer">
                <div className="flex items-center space-x-2 text-sm text-blue-500 hover:text-blue-600">
                  <Upload size={16} />
                  <span>Upload Profile Picture</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your address" {...field} />
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
                        placeholder="Create a password"
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
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
