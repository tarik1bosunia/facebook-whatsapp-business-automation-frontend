'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  CreateUserRequest,
} from '@/lib/redux/features/superadmin/userApi';
import Spinner from '@/components/ui/Spinner';

interface UserFormProps {
  userId?: number | null;
  onClose: () => void;
}

// 👇 Define form-specific type
type UserFormValues = {
  email: string;
  first_name: string | null;
  last_name: string | null;
  password?: string;
  is_active: boolean;
  is_email_verified: boolean;
};

const userSchema: yup.ObjectSchema<UserFormValues> = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  first_name: yup
    .string()
    .nullable()
    .transform((val) => (val === '' ? null : val))
    .required('First name is required'),
  last_name: yup
    .string()
    .nullable()
    .transform((val) => (val === '' ? null : val))
    .required('Last name is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .when('$isEdit', {
      is: false,
      then: (schema) => schema.required('Password is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  is_active: yup.boolean().required(),
  is_email_verified: yup.boolean().required(),
});

const UserForm = ({ userId, onClose }: UserFormProps) => {
  const isEdit = !!userId;

  const { data: userData, isLoading: isUserLoading } = useGetUserQuery(userId as number, {
    skip: !userId,
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: yupResolver(userSchema, { context: { isEdit } }),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      is_active: true,
      is_email_verified: false,
    },
  });

  useEffect(() => {
    if (userData && isEdit) {
      reset({
        email: userData.email,
        first_name: userData.first_name ?? '',
        last_name: userData.last_name ?? '',
        is_active: userData.is_active,
        is_email_verified: userData.is_email_verified,
      });
    }
  }, [userData, isEdit, reset]);

  const onSubmit = async (data: UserFormValues) => {
    const payload: CreateUserRequest = {
      email: data.email,
      first_name: data.first_name ?? undefined,
      last_name: data.last_name ?? undefined,
      password: data.password,
      is_active: data.is_active,
      is_email_verified: data.is_email_verified,
    };

    try {
      if (isEdit) {
        await updateUser({ id: userId!, ...payload }).unwrap();
      } else {
        await createUser(payload).unwrap();
      }
      onClose();
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };

  const isLoading = isUserLoading || isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEdit ? 'Edit User' : 'Create User'}
          </h2>
          {isLoading ? (
            <Spinner />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full border px-3 py-2 rounded-md ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-1">First Name</label>
                  <input
                    type="text"
                    {...register('first_name')}
                    className={`w-full border px-3 py-2 rounded-md ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Last Name</label>
                  <input
                    type="text"
                    {...register('last_name')}
                    className={`w-full border px-3 py-2 rounded-md ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              {!isEdit && (
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-1">Password</label>
                  <input
                    type="password"
                    {...register('password')}
                    className={`w-full border px-3 py-2 rounded-md ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>
              )}

              <div className="mb-4 flex items-center">
                <input type="checkbox" {...register('is_active')} id="is_active" className="mr-2" />
                <label htmlFor="is_active" className="text-sm">Active</label>
              </div>

              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  {...register('is_email_verified')}
                  id="is_email_verified"
                  className="mr-2"
                />
                <label htmlFor="is_email_verified" className="text-sm">Email Verified</label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {isEdit ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserForm;
