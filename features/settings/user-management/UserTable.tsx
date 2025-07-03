// src/components/UserTable.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, X, Edit, Trash2 } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User } from "@/lib/redux/features/superadmin/userApi";


interface UserTableProps {
  users: User[];
  getRoleConfig: (role: string) => { label: string; color: string };
  getInitials: (firstName: string | null, lastName: string | null, email: string) => string;
  getDisplayName: (firstName: string | null, lastName: string | null, email: string) => string;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => Promise<boolean>;
  onToggleStatus: (userId: number, is_active: boolean) => Promise<boolean>;
}

export const UserTable = ({ 
  users, 
  getRoleConfig, 
  getInitials, 
  getDisplayName,
  onEdit,
  onDelete,
  onToggleStatus
}: UserTableProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">User</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Email Status</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getInitials(user.first_name, user.last_name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{getDisplayName(user.first_name, user.last_name, user.email)}</p>
                      <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-mono text-sm">{user.email}</p>
                </td>
                <td className="p-4">
                  <Badge className={getRoleConfig(user.role).color}>
                    {getRoleConfig(user.role).label}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Switch
                      checked={user.is_active}
                      onCheckedChange={async () => {
                        await onToggleStatus(user.id, !user.is_active);
                      }}
                    />
                  </div>
                </td>
                <td className="p-4">
                  <Badge 
                    variant="outline" 
                    className={user.is_email_verified ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
                  >
                    {user.is_email_verified ? (
                      <><Check className="h-3 w-3 mr-1" /> Verified</>
                    ) : (
                      <><X className="h-3 w-3 mr-1" /> Unverified</>
                    )}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(user)}
                      className="gap-1"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1 text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={async () => {
                              await onDelete(user.id);
                            }}
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
  );
};