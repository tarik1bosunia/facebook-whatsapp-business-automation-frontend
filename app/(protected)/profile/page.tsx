'use client'

import {  useState } from 'react'

export default function ProfilePage() {

  const [user] = useState({
    name: 'Foujia Tabassum',
    email: 'foujia@example.com',
    role: 'Business Owner',
    avatarUrl: 'https://i.pravatar.cc/100?u=foujia',
  })

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
        <img
          src={user.avatarUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <span className="inline-block mt-2 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full">
            {user.role}
          </span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-5 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Settings</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Change Email</li>
            <li>Update Password</li>
            <li>Two-Factor Authentication</li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Business Info</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Business Name: Tabassum Co.</li>
            <li>Account Type: Premium</li>
            <li>Status: Active</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
