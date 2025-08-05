'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { HiOutlineExclamationTriangle } from 'react-icons/hi2'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  message?: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  open,
  title = 'Delete Product',
  message = 'Are you sure you want to delete this product? This action cannot be undone.',
  onConfirm,
  onCancel
}: ConfirmDialogProps) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Panel */}
        <div className="fixed inset-0 flex items-center justify-center px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <HiOutlineExclamationTriangle className="w-6 h-6 text-red-500 mt-1" />
                <div>
                  <Dialog.Title className="text-lg font-semibold text-gray-800">
                    {title}
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-gray-600 mt-1">
                    {message}
                  </Dialog.Description>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
