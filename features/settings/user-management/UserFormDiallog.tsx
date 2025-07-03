// UserFormDialog.tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: any;
  setFormData: (data: any) => void;
  title: string;
  description: string;
  roleOptions: { value: string; label: string }[];
}

const UserFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  title,
  description,
  roleOptions,
}: Props) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {['email', 'first_name', 'last_name'].map((field, index) => (
          <div className="grid grid-cols-4 items-center gap-4" key={index}>
            <Label htmlFor={field} className="text-right">
              {field.replace('_', ' ').replace(/^./, s => s.toUpperCase())}
            </Label>
            <Input
              id={field}
              type={field === 'email' ? 'email' : 'text'}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className="col-span-3"
              placeholder={field === 'email' ? 'user@example.com' : ''}
            />
          </div>
        ))}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="role" className="text-right">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger className="col-span-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {['is_active', 'is_email_verified'].map((field, index) => (
          <div className="grid grid-cols-4 items-center gap-4" key={index}>
            <Label htmlFor={field} className="text-right">
              {field.replace('_', ' ').replace(/^./, s => s.toUpperCase())}
            </Label>
            <div className="col-span-3">
              <Switch
                id={field}
                checked={formData[field]}
                onCheckedChange={(checked) => setFormData({ ...formData, [field]: checked })}
              />
            </div>
          </div>
        ))}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit}>Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default UserFormDialog;