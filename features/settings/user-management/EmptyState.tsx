// src/components/EmptyState.tsx
import { User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddUser: () => void;
}

export const EmptyState = ({ onAddUser }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-lg font-medium text-muted-foreground">No users found</p>
      <p className="text-muted-foreground mb-4">Get started by adding your first user</p>
      <Button onClick={onAddUser} className="gap-2">
        <Plus className="h-4 w-4" />
        Add User
      </Button>
    </div>
  );
};