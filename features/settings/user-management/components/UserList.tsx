'use client';

import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import { useState } from 'react';
import UserForm from './UserForm';
import UserDetail from './UserDetail';
import { useGetUsersQuery } from '@/lib/redux/features/superadmin/userApi';
import DeleteUserModal from './DeleteUserModal';
import Spinner from '@/components/ui/Spinner';

const UserList = () => {
  const { data, isLoading, error } = useGetUsersQuery();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => {
            setSelectedUserId(null);
            setIsEditing(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaEdit /> Add New User
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.first_name ?? ''} {user.last_name ?? ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setIsViewing(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="View"
                    >
                      <FaEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setIsEditing(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Edit"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setDeletingUserId(user.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                    >
                      <FaTrashAlt className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isEditing && (
        <UserForm
          userId={selectedUserId}
          onClose={() => {
            setIsEditing(false);
            setSelectedUserId(null);
          }}
        />
      )}

      {/* View Detail Modal */}
      {isViewing && selectedUserId && (
        <UserDetail
          userId={selectedUserId}
          onClose={() => {
            setIsViewing(false);
            setSelectedUserId(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingUserId && (
        <DeleteUserModal
          userId={deletingUserId}
          onClose={() => setDeletingUserId(null)}
        />
      )}
    </div>
  );
};

export default UserList;
