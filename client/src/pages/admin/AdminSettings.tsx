"use client";

import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";

import { useState } from "react";
import {
    User,
    Bell,
    Shield,
    Mail,
    Smartphone,
    Save,
    Clock,
    Palette,
    Moon,
    Sun,
    Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [theme, setTheme] = useState("system");
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        maintenanceAlerts: true,
        vehicleUpdates: true,
        marketingEmails: false,
    });

    const handleSaveProfile = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
        }, 1000);
    };

    const handleNotificationChange = (setting: string, value: boolean) => {
        setNotificationSettings((prev) => ({
            ...prev,
            [setting]: value,
        }));
    };

    return (
        <>
            <Helmet>
                <title>Admin Settings | Atta Motors</title>
            </Helmet>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>

                <Tabs
                    defaultValue="profile"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-4 lg:w-auto">
                        <TabsTrigger
                            value="profile"
                            className="flex items-center gap-2"
                        >
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="notifications"
                            className="flex items-center gap-2"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                Notifications
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="appearance"
                            className="flex items-center gap-2"
                        >
                            <Palette className="h-4 w-4" />
                            <span className="hidden sm:inline">Appearance</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="security"
                            className="flex items-center gap-2"
                        >
                            <Shield className="h-4 w-4" />
                            <span className="hidden sm:inline">Security</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your account profile information and
                                    preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex flex-col items-center">
                                        <Avatar className="h-24 w-24 mb-4">
                                            <AvatarImage
                                                src="/placeholder.svg"
                                                alt="Admin"
                                            />
                                            <AvatarFallback>AD</AvatarFallback>
                                        </Avatar>
                                        <Button variant="outline" size="sm">
                                            Change Avatar
                                        </Button>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Full Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    defaultValue="Admin User"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">
                                                    Email Address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    defaultValue="admin@example.com"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">
                                                    Phone Number
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    defaultValue="(555) 123-4567"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="role">
                                                    Role
                                                </Label>
                                                <Input
                                                    id="role"
                                                    defaultValue="Administrator"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Preferences
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="language">
                                                Language
                                            </Label>
                                            <Select defaultValue="en">
                                                <SelectTrigger id="language">
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">
                                                        English
                                                    </SelectItem>
                                                    <SelectItem value="es">
                                                        Spanish
                                                    </SelectItem>
                                                    <SelectItem value="fr">
                                                        French
                                                    </SelectItem>
                                                    <SelectItem value="de">
                                                        German
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="timezone">
                                                Timezone
                                            </Label>
                                            <Select defaultValue="america_los_angeles">
                                                <SelectTrigger id="timezone">
                                                    <SelectValue placeholder="Select timezone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="america_los_angeles">
                                                        Pacific Time (US &
                                                        Canada)
                                                    </SelectItem>
                                                    <SelectItem value="america_denver">
                                                        Mountain Time (US &
                                                        Canada)
                                                    </SelectItem>
                                                    <SelectItem value="america_chicago">
                                                        Central Time (US &
                                                        Canada)
                                                    </SelectItem>
                                                    <SelectItem value="america_new_york">
                                                        Eastern Time (US &
                                                        Canada)
                                                    </SelectItem>
                                                    <SelectItem value="europe_london">
                                                        London
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Settings</CardTitle>
                                <CardDescription>
                                    Configure how and when you receive
                                    notifications
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Notification Channels
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <Label htmlFor="emailNotifications">
                                                    Email Notifications
                                                </Label>
                                            </div>
                                            <Switch
                                                id="emailNotifications"
                                                checked={
                                                    notificationSettings.emailNotifications
                                                }
                                                onCheckedChange={(checked) =>
                                                    handleNotificationChange(
                                                        "emailNotifications",
                                                        checked
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Smartphone className="h-4 w-4 text-gray-500" />
                                                <Label htmlFor="smsNotifications">
                                                    SMS Notifications
                                                </Label>
                                            </div>
                                            <Switch
                                                id="smsNotifications"
                                                checked={
                                                    notificationSettings.smsNotifications
                                                }
                                                onCheckedChange={(checked) =>
                                                    handleNotificationChange(
                                                        "smsNotifications",
                                                        checked
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Notification Types
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">
                                                    Maintenance Alerts
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Notifications about
                                                    maintenance requests and
                                                    updates
                                                </p>
                                            </div>
                                            <Switch
                                                id="maintenanceAlerts"
                                                checked={
                                                    notificationSettings.maintenanceAlerts
                                                }
                                                onCheckedChange={(checked) =>
                                                    handleNotificationChange(
                                                        "maintenanceAlerts",
                                                        checked
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">
                                                    Vehicle Updates
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Notifications about vehicle
                                                    inventory changes
                                                </p>
                                            </div>
                                            <Switch
                                                id="vehicleUpdates"
                                                checked={
                                                    notificationSettings.vehicleUpdates
                                                }
                                                onCheckedChange={(checked) =>
                                                    handleNotificationChange(
                                                        "vehicleUpdates",
                                                        checked
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">
                                                    Marketing Emails
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Promotional emails and
                                                    newsletters
                                                </p>
                                            </div>
                                            <Switch
                                                id="marketingEmails"
                                                checked={
                                                    notificationSettings.marketingEmails
                                                }
                                                onCheckedChange={(checked) =>
                                                    handleNotificationChange(
                                                        "marketingEmails",
                                                        checked
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Preferences
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance Settings</CardTitle>
                                <CardDescription>
                                    Customize the look and feel of the admin
                                    dashboard
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Theme
                                    </h3>
                                    <RadioGroup
                                        value={theme}
                                        onValueChange={setTheme}
                                        className="grid grid-cols-3 gap-4"
                                    >
                                        <div>
                                            <RadioGroupItem
                                                value="light"
                                                id="theme-light"
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor="theme-light"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-black [&:has([data-state=checked])]:border-black"
                                            >
                                                <Sun className="h-6 w-6 mb-2" />
                                                <span className="text-sm font-medium">
                                                    Light
                                                </span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem
                                                value="dark"
                                                id="theme-dark"
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor="theme-dark"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gray-950 p-4 hover:bg-gray-900 hover:border-gray-700 peer-data-[state=checked]:border-black [&:has([data-state=checked])]:border-black"
                                            >
                                                <Moon className="h-6 w-6 mb-2 text-white" />
                                                <span className="text-sm font-medium text-white">
                                                    Dark
                                                </span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem
                                                value="system"
                                                id="theme-system"
                                                className="peer sr-only"
                                            />
                                            <Label
                                                htmlFor="theme-system"
                                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gradient-to-br from-white to-gray-900 p-4 hover:border-gray-300 peer-data-[state=checked]:border-black [&:has([data-state=checked])]:border-black"
                                            >
                                                <Monitor className="h-6 w-6 mb-2" />
                                                <span className="text-sm font-medium">
                                                    System
                                                </span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Dashboard Layout
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="sidebar">
                                                Sidebar Position
                                            </Label>
                                            <Select defaultValue="left">
                                                <SelectTrigger id="sidebar">
                                                    <SelectValue placeholder="Select position" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="left">
                                                        Left
                                                    </SelectItem>
                                                    <SelectItem value="right">
                                                        Right
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="density">
                                                Content Density
                                            </Label>
                                            <Select defaultValue="comfortable">
                                                <SelectTrigger id="density">
                                                    <SelectValue placeholder="Select density" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="comfortable">
                                                        Comfortable
                                                    </SelectItem>
                                                    <SelectItem value="compact">
                                                        Compact
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Appearance
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>
                                    Manage your account security and
                                    authentication options
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Change Password
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">
                                                Current Password
                                            </Label>
                                            <Input
                                                id="current-password"
                                                type="password"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">
                                                New Password
                                            </Label>
                                            <Input
                                                id="new-password"
                                                type="password"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">
                                                Confirm New Password
                                            </Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                            />
                                        </div>
                                    </div>
                                    <Button>Update Password</Button>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Two-Factor Authentication
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">
                                                Enable Two-Factor Authentication
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Add an extra layer of security
                                                to your account by requiring a
                                                verification code
                                            </p>
                                        </div>
                                        <Switch id="twoFactor" />
                                    </div>
                                    <Button variant="outline">
                                        Set Up Two-Factor Authentication
                                    </Button>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Session Management
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">
                                                    Current Session
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Chrome on Windows • IP:
                                                    192.168.1.1
                                                </p>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                Active
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="text-red-600"
                                    >
                                        Sign Out of All Sessions
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};
