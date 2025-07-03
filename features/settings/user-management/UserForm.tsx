// src/components/UserForm.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";


interface User {
  id: number;
  email: string;
  first_name: string | undefined;
  last_name: string | undefined;
  is_active: boolean;
  is_email_verified: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}


interface UserFormProps {
  formData: Omit<User, 'id' | 'created_at' | 'updated_at'> & { 
    first_name: string; 
    last_name: string 
  };
  onFormChange: (field: string, value: string | boolean) => void;
  roleOptions: { 
    value: string; 
    label: string; 
    color: string 
  }[];
}

export const UserForm = ({ formData, onFormChange, roleOptions }: UserFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onFormChange('email', e.target.value)}
          className="col-span-3"
          placeholder="user@example.com"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="first_name" className="text-right">First Name</Label>
        <Input
          id="first_name"
          value={formData.first_name}
          onChange={(e) => onFormChange('first_name', e.target.value)}
          className="col-span-3"
          placeholder="John"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="last_name" className="text-right">Last Name</Label>
        <Input
          id="last_name"
          value={formData.last_name}
          onChange={(e) => onFormChange('last_name', e.target.value)}
          className="col-span-3"
          placeholder="Doe"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">Role</Label>
        <Select 
          value={formData.role} 
          onValueChange={(value) => onFormChange('role', value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="is_active" className="text-right">Active</Label>
        <div className="col-span-3">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => onFormChange('is_active', checked)}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="is_email_verified" className="text-right">Email Verified</Label>
        <div className="col-span-3">
          <Switch
            id="is_email_verified"
            checked={formData.is_email_verified}
            onCheckedChange={(checked) => onFormChange('is_email_verified', checked)}
          />
        </div>
      </div>
    </div>
  );
};