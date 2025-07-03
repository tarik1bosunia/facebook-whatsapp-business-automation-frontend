'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { UserManagementTab } from "@/features/settings";
import RoleManagementTab from "@/features/settings/RoleManagementTab";
import PermissionManagementTab from "@/features/settings/PermissionManagementTab";
import AuditLogTab from "@/features/settings/AuditLogTab";

const AdminUsers = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage users, roles and permissions
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit">SuperAdmin Only</Badge>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-6 bg-background border">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagementTab />
        </TabsContent>
        
        <TabsContent value="roles" className="space-y-4">
          <RoleManagementTab />
        </TabsContent>
        
        <TabsContent value="permissions" className="space-y-4">
          <PermissionManagementTab />
        </TabsContent>
        
        <TabsContent value="audit" className="space-y-4">
          <AuditLogTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsers;
