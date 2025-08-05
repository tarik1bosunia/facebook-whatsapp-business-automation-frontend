// src/components/users/UserDetail.tsx
import { format } from 'date-fns';
import { FaTimes } from 'react-icons/fa';
import { useGetUserQuery } from '@/lib/redux/features/superadmin/userApi';
import Spinner from '@/components/ui/Spinner';
interface UserDetailProps {
    userId: number;
    onClose: () => void;
}

const UserDetail = ({ userId, onClose }: UserDetailProps) => {
    const { data: user, isLoading } = useGetUserQuery(userId);

    if (isLoading) return <Spinner />;


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold">User Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">
                                {user?.first_name} {user?.last_name}
                            </h3>
                            <p className="text-gray-600">{user?.email}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {user?.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Role</p>
                                <p>{user?.role}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Email Verified</p>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.is_email_verified
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {user?.is_email_verified ? 'Verified' : 'Not Verified'}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-sm text-gray-500">Created At</p>
                            <p>
                                {user?.created_at
                                    ? format(new Date(user.created_at), 'MMM dd, yyyy HH:mm')
                                    : '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Last Updated</p>
                            <p>
                                {user?.updated_at
                                    ? format(new Date(user.updated_at), 'MMM dd, yyyy HH:mm')
                                    : '-'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;