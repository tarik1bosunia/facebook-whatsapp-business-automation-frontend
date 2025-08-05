// src/components/UserManagementTab.tsx
import { useState } from "react";
import { Plus, User as UserIcon } from "lucide-react";
import { toast } from "react-toastify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/lib/redux/features/superadmin/userApi";
import { useUsers } from "./useUsers";
import { UserForm } from "./UserForm";
import { UserStats } from "./UserStats";
import { UserTable } from "./UserTable";
import { EmptyState } from "./EmptyState";


export const UserManagementTab = () => {
  const {
    users,
    isLoading,
    isError,
    stats,
    roleOptions,
    getRoleConfig,
    getInitials,
    getDisplayName,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    handleToggleStatus
  } = useUsers();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "businessman",
    is_active: true,
    is_email_verified: false
  });

  const resetForm = () => {
    setFormData({
      email: "",
      first_name: "",
      last_name: "",
      role: "businessman",
      is_active: true,
      is_email_verified: false
    });
  };

  const onFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSubmit = async () => {
    if (!formData.email) {
      toast.error("Email is required", { position: "bottom-right" });
      return;
    }

    const success = await handleAddUser({
      email: formData.email,
      first_name: formData.first_name || null,
      last_name: formData.last_name || null,
      role: formData.role,
      is_active: formData.is_active,
      is_email_verified: formData.is_email_verified
    });

    if (success) {
      setIsAddDialogOpen(false);
      resetForm();
      toast.success("User added successfully", { position: "bottom-right" });
    } else {
      toast.error("Failed to add user", { position: "bottom-right" });
    }
  };

  const handleEditSubmit = async () => {
    if (!editingUser) return;

    const success = await handleUpdateUser({
      ...editingUser,
      email: formData.email,
      first_name: formData.first_name || null,
      last_name: formData.last_name || null,
      role: formData.role,
      is_active: formData.is_active,
      is_email_verified: formData.is_email_verified
    });

    if (success) {
      setIsEditDialogOpen(false);
      setEditingUser(null);
      resetForm();
      toast.success("User updated successfully", { position: "bottom-right" });
    } else {
      toast.error("Failed to update user", { position: "bottom-right" });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      role: user.role,
      is_active: user.is_active,
      is_email_verified: user.is_email_verified
    });
    setIsEditDialogOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading users</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage users who can access the system
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <UserStats 
            total={stats.total} 
            active={stats.active} 
            verified={stats.verified} 
            admins={stats.admins} 
          />

          {users.length > 0 ? (
            <UserTable
              users={users}
              getRoleConfig={getRoleConfig}
              getInitials={getInitials}
              getDisplayName={getDisplayName}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onToggleStatus={handleToggleStatus}
            />
          ) : (
            <EmptyState onAddUser={() => setIsAddDialogOpen(true)} />
          )}
        </div>
      </CardContent>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={() => {
        setIsAddDialogOpen(false);
        resetForm();
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account for your system.</DialogDescription>
          </DialogHeader>
          <UserForm 
            formData={formData} 
            onFormChange={onFormChange} 
            roleOptions={roleOptions} 
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={() => {
        setIsEditDialogOpen(false);
        setEditingUser(null);
        resetForm();
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions.</DialogDescription>
          </DialogHeader>
          <UserForm 
            formData={formData} 
            onFormChange={onFormChange} 
            roleOptions={roleOptions} 
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserManagementTab;