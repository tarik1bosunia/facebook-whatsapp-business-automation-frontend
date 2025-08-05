
import { useState } from "react";
import { Plus, Edit, Trash2, Users, Shield, Settings, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

const RoleManagementTab = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access with all permissions",
      permissions: ["users.create", "users.read", "users.update", "users.delete", "roles.manage", "audit.view", "system.configure"],
      userCount: 1,
      isSystem: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Admin",
      description: "Administrative access with user management",
      permissions: ["users.create", "users.read", "users.update", "audit.view"],
      userCount: 2,
      isSystem: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      name: "Business Owner",
      description: "Access to business-related features",
      permissions: ["users.read", "business.manage", "reports.view"],
      userCount: 5,
      isSystem: false,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  });

  const availablePermissions = [
    { id: "users.create", name: "Create Users", category: "User Management" },
    { id: "users.read", name: "View Users", category: "User Management" },
    { id: "users.update", name: "Update Users", category: "User Management" },
    { id: "users.delete", name: "Delete Users", category: "User Management" },
    { id: "roles.manage", name: "Manage Roles", category: "Role Management" },
    { id: "audit.view", name: "View Audit Logs", category: "System" },
    { id: "business.manage", name: "Manage Business", category: "Business" },
    { id: "reports.view", name: "View Reports", category: "Reports" },
    { id: "system.configure", name: "System Configuration", category: "System" }
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      permissions: []
    });
  };

  const handleAddRole = () => {
    if (!formData.name.trim()) {
      toast.error("Role name is required");
      return;
    }

    const newRole: Role = {
      id: Math.max(...roles.map(r => r.id)) + 1,
      name: formData.name,
      description: formData.description,
      permissions: formData.permissions,
      userCount: 0,
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRoles([...roles, newRole]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Role created successfully");
  };

  const handleEditRole = (role: Role) => {
    if (role.isSystem) {
      toast.error("System roles cannot be modified");
      return;
    }
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateRole = () => {
    if (!editingRole) return;

    const updatedRole: Role = {
      ...editingRole,
      name: formData.name,
      description: formData.description,
      permissions: formData.permissions,
      updatedAt: new Date().toISOString()
    };

    setRoles(roles.map(r => r.id === editingRole.id ? updatedRole : r));
    setIsEditDialogOpen(false);
    setEditingRole(null);
    resetForm();
    toast.success("Role updated successfully");
  };

  const handleDeleteRole = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      toast.error("System roles cannot be deleted");
      return;
    }
    if ((role?.userCount ?? 0) > 0) {
      toast.error("Cannot delete role with assigned users");
      return;
    }
    setRoles(roles.filter(r => r.id !== roleId));
    toast.success("Role deleted successfully");
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permissionId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permissionId)
      }));
    }
  };

  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof availablePermissions>);

  const RoleFormDialog = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    title 
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title: string;
  }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Configure role details and permissions</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter role name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this role"
            />
          </div>
          <div className="grid gap-4">
            <Label>Permissions</Label>
            {Object.entries(groupedPermissions).map(([category, permissions]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-sm">{category}</h4>
                <div className="grid gap-2 pl-4">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                      />
                      <Label htmlFor={permission.id} className="text-sm">{permission.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit}>Save Role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role Management
            </CardTitle>
            <CardDescription>
              Define and manage user roles and their permissions
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {roles.map((role) => (
            <Card key={role.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{role.name}</h3>
                    {role.isSystem && (
                      <Badge variant="secondary">System Role</Badge>
                    )}
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {role.userCount} users
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{role.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {availablePermissions.find(p => p.id === permission)?.name || permission}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditRole(role)}
                    disabled={role.isSystem}
                    className="gap-1"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={role.isSystem || role.userCount > 0}
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Role</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this role? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteRole(role.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>

      <RoleFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          resetForm();
        }}
        onSubmit={handleAddRole}
        title="Create New Role"
      />

      <RoleFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingRole(null);
          resetForm();
        }}
        onSubmit={handleUpdateRole}
        title="Edit Role"
      />
    </Card>
  );
};

export default RoleManagementTab;