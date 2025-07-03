
import { useState } from "react";
import { Shield, Search, Filter, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string;
  isSystem: boolean;
  rolesAssigned: string[];
  createdAt: string;
}

const PermissionManagementTab = () => {
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: "users.create",
      name: "Create Users",
      description: "Ability to create new user accounts",
      category: "User Management",
      resource: "users",
      action: "create",
      isSystem: true,
      rolesAssigned: ["Super Admin", "Admin"],
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "users.read",
      name: "View Users",
      description: "Ability to view user information",
      category: "User Management",
      resource: "users",
      action: "read",
      isSystem: true,
      rolesAssigned: ["Super Admin", "Admin", "Business Owner"],
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "users.update",
      name: "Update Users",
      description: "Ability to modify user accounts",
      category: "User Management",
      resource: "users",
      action: "update",
      isSystem: true,
      rolesAssigned: ["Super Admin", "Admin"],
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "business.manage",
      name: "Manage Business",
      description: "Access to business management features",
      category: "Business",
      resource: "business",
      action: "manage",
      isSystem: false,
      rolesAssigned: ["Business Owner"],
      createdAt: "2024-01-01T00:00:00Z"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    resource: "",
    action: ""
  });

  const categories = ["User Management", "Business", "Reports", "System", "Role Management"];
  const actions = ["create", "read", "update", "delete", "manage", "view"];

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || permission.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      resource: "",
      action: ""
    });
  };

  const handleAddPermission = () => {
    if (!formData.name.trim() || !formData.resource.trim() || !formData.action.trim()) {
      toast.error("Name, resource, and action are required");
      return;
    }

    const id = `${formData.resource}.${formData.action}`;
    if (permissions.find(p => p.id === id)) {
      toast.error("Permission with this resource and action already exists");
      return;
    }

    const newPermission: Permission = {
      id,
      name: formData.name,
      description: formData.description,
      category: formData.category || "Custom",
      resource: formData.resource,
      action: formData.action,
      isSystem: false,
      rolesAssigned: [],
      createdAt: new Date().toISOString()
    };

    setPermissions([...permissions, newPermission]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Permission created successfully");
  };

  const handleEditPermission = (permission: Permission) => {
    if (permission.isSystem) {
      toast.error("System permissions cannot be modified");
      return;
    }
    setEditingPermission(permission);
    setFormData({
      name: permission.name,
      description: permission.description,
      category: permission.category,
      resource: permission.resource,
      action: permission.action
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePermission = () => {
    if (!editingPermission) return;

    const updatedPermission: Permission = {
      ...editingPermission,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      resource: formData.resource,
      action: formData.action
    };

    setPermissions(permissions.map(p => p.id === editingPermission.id ? updatedPermission : p));
    setIsEditDialogOpen(false);
    setEditingPermission(null);
    resetForm();
    toast.success("Permission updated successfully");
  };

  const handleDeletePermission = (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    if (permission?.isSystem) {
      toast.error("System permissions cannot be deleted");
      return;
    }
    if ((permission?.rolesAssigned.length ?? 0) > 0) {
      toast.error("Cannot delete permission assigned to roles");
      return;
    }
    setPermissions(permissions.filter(p => p.id !== permissionId));
    toast.success("Permission deleted successfully");
  };

  const PermissionFormDialog = ({ 
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Configure permission details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Permission Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Create Users"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this permission allows"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="resource">Resource</Label>
              <Input
                id="resource"
                value={formData.resource}
                onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
                placeholder="e.g., users"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="action">Action</Label>
              <Select value={formData.action} onValueChange={(value) => setFormData({ ...formData, action: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {actions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit}>Save Permission</Button>
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
              Permission Management
            </CardTitle>
            <CardDescription>
              Configure fine-grained permissions for system resources
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Permission
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Permissions Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Permission</th>
                    <th className="text-left p-4 font-medium">Resource.Action</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Assigned Roles</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPermissions.map((permission) => (
                    <tr key={permission.id} className="border-t hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{permission.name}</p>
                          <p className="text-sm text-muted-foreground">{permission.description}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {permission.id}
                        </code>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{permission.category}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {permission.rolesAssigned.map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                          {permission.rolesAssigned.length === 0 && (
                            <span className="text-sm text-muted-foreground">No roles assigned</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={permission.isSystem ? "default" : "outline"}>
                          {permission.isSystem ? "System" : "Custom"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditPermission(permission)}
                            disabled={permission.isSystem}
                            className="gap-1"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                disabled={permission.isSystem || permission.rolesAssigned.length > 0}
                                className="gap-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Permission</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this permission? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeletePermission(permission.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredPermissions.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No permissions found</p>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </CardContent>

      <PermissionFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          resetForm();
        }}
        onSubmit={handleAddPermission}
        title="Create New Permission"
      />

      <PermissionFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingPermission(null);
          resetForm();
        }}
        onSubmit={handleUpdatePermission}
        title="Edit Permission"
      />
    </Card>
  );
};

export default PermissionManagementTab;