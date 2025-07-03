// File: components/user-management/utils.ts
export const roleOptions = [
  { value: "superadmin", label: "Super Admin", color: "bg-red-100 text-red-800" },
  { value: "admin", label: "Admin", color: "bg-blue-100 text-blue-800" },
  { value: "businessman", label: "Business Owner", color: "bg-green-100 text-green-800" },
  { value: "support", label: "Support", color: "bg-yellow-100 text-yellow-800" },
];

export const getRoleConfig = (role: string) => {
  return roleOptions.find(r => r.value === role) || roleOptions[2];
};

export const getInitials = (
  firstName: string | null,
  lastName: string | null,
  email: string
) => {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  return email.substring(0, 2).toUpperCase();
};

export const getDisplayName = (
  firstName: string | null,
  lastName: string | null,
  email: string
) => {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  return email;
};