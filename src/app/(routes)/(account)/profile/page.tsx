"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import {
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

import { useAccount } from "@/hooks/useAccount";
import { useUpdateAccount } from "@/hooks/useUpdateAccount";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UpdateAccountInput } from "@/types/account-user.type";
import { updateAccountSchema } from "@/schema/account.schema";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const { data: account, isLoading, isError, error } = useAccount(userId);

  const updateMutation = useUpdateAccount();

  const user = account?.user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<UpdateAccountInput>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Populate form when account data becomes available
  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user, reset]);

  const initials =
    user?.name?.trim().charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  const memberSince = user?.createdAt
    ? format(new Date(user.createdAt), "MMMM yyyy")
    : "";
  const onSubmit = async (values: UpdateAccountInput) => {
    if (!userId) return;

    try {
      const updatedUser = await updateMutation.mutateAsync({
        userId,
        payload: values,
      });

      reset({
        name: updatedUser.name ?? "",
        phone: updatedUser.phone ?? "",
      });

      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    }
  };

  if (!userId || isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError || !user) {
    return (
      <Card>
        <CardContent className="space-y-3 p-6">
          <p className="font-medium">Unable to load profile</p>
          <p className="text-sm text-muted-foreground">
            {error?.message || "Something went wrong. Please try again."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <Avatar className="size-20">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? "User"}
            />
            <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">
                {user.name || "Welcome!"}
              </h2>

              <Badge variant="secondary">
                <ShieldCheck className="mr-1 size-3" />
                {user.role === "ADMIN" ? "Admin" : "Customer"}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">{user.email}</p>

            <p className="text-xs text-muted-foreground">
              {memberSince && `Member since ${memberSince}`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserRound className="size-5 text-primary" />
            <CardTitle>Personal Information</CardTitle>
          </div>

          <CardDescription>
            Update your personal details and contact information.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>

                <Input
                  id="name"
                  placeholder="Enter your full name"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />

                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    readOnly
                    className="bg-muted/50 pl-9"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed here.
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+8801XXXXXXXXX"
                    className="pl-9"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                  />
                </div>

                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {updateMutation.isError && (
              <p className="text-sm text-destructive">
                {updateMutation.error.message}
              </p>
            )}

            <Separator />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting || updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Basic information about your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <CalendarDays className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-xs text-muted-foreground">
                  Account creation date
                </p>
              </div>
            </div>

            <span className="text-right text-sm text-muted-foreground">
              {memberSince}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <ShieldCheck className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-sm font-medium">Account Role</p>
                <p className="text-xs text-muted-foreground">
                  Your current account role
                </p>
              </div>
            </div>

            <Badge variant="secondary">
              {user.role === "ADMIN" ? "Admin" : "Customer"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
