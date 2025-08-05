// src/components/users/DeleteUserModal.tsx
import { useDeleteUserMutation } from '@/lib/redux/features/superadmin/userApi';
import Spinner from '../ui/Spinner';
import { FaTimes, FaTrash } from 'react-icons/fa';

interface DeleteUserModalProps {
  userId: number | null;
  onClose: () => void;
}

const DeleteUserModal = ({ userId, onClose }: DeleteUserModalProps) => {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleDelete = async () => {
    if (!userId) return;
    try {
      await deleteUser(userId).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Delete User</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          <p className="mb-6">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <Spinner size="sm" /> : <FaTrash />}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;