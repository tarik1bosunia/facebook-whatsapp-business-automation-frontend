// src/hooks/useUsers.ts
import { useMemo } from "react";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/lib/redux/features/superadmin/userApi";

export const useUsers = () => {
  // RTK Query hooks
  const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [toggleStatus] = useToggleUserStatusMutation();

  // Role configuration
  const roleOptions = useMemo(
    () => [
      {
        value: "superadmin",
        label: "Super Admin",
        color: "bg-red-100 text-red-800",
      },
      { value: "admin", label: "Admin", color: "bg-blue-100 text-blue-800" },
      {
        value: "businessman",
        label: "Business Owner",
        color: "bg-green-100 text-green-800",
      },
      {
        value: "support",
        label: "Support",
        color: "bg-yellow-100 text-yellow-800",
      },
    ],
    []
  );

  // Helper functions
  const getRoleConfig = (role: string) => {
    return roleOptions.find((r) => r.value === role) || roleOptions[2];
  };

  const getInitials = (
    firstName: string | null,
    lastName: string | null,
    email: string
  ) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const getDisplayName = (
    firstName: string | null,
    lastName: string | null,
    email: string
  ) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) {
      return firstName;
    }
    return email;
  };

  // API operations
  const handleAddUser = async (
    userData: Omit<User, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const requestData: CreateUserRequest = {
        email: userData.email,
        first_name: userData.first_name || undefined,
        last_name: userData.last_name || undefined,
        is_active: userData.is_active,
        is_email_verified: userData.is_email_verified,
        role: userData.role,
      };

      await createUser(requestData).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to add user:", error);
      return false;
    }
  };

  const handleUpdateUser = async (userData: User) => {
    try {
      // Convert null to undefined for the API request
      const requestData: UpdateUserRequest = {
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name || undefined,
        last_name: userData.last_name || undefined,
        is_active: userData.is_active,
        is_email_verified: userData.is_email_verified,
        role: userData.role,
      };
      await updateUser(requestData).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to update user:", error);
      return false;
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to delete user:", error);
      return false;
    }
  };

  const handleToggleStatus = async (userId: number, is_active: boolean) => {
    try {
      await toggleStatus({ id: userId, is_active }).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      return false;
    }
  };

  // Stats calculations
  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.is_active).length,
      verified: users.filter((u) => u.is_email_verified).length,
      admins: users.filter((u) => u.role.includes("admin")).length,
    }),
    [users]
  );

  return {
    users,
    isLoading,
    isError,
    refetch,
    roleOptions,
    stats,
    getRoleConfig,
    getInitials,
    getDisplayName,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    handleToggleStatus,
  };
};
