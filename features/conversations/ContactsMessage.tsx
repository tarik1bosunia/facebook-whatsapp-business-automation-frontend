'use client';

import React, { useState } from 'react';

interface Contact {
  name: string;
  phones: string[];
}

interface ContactsMessageProps {
  contactsData: Contact[];
}

const ContactsMessage: React.FC<ContactsMessageProps> = ({ contactsData }) => {
  const [showContacts, setShowContacts] = useState(false);

  if (!contactsData || contactsData.length === 0) return null;

  return (
    <div className="bg-gray-100 p-3 rounded-lg shadow max-w-sm">
      {!showContacts ? (
        <button
          onClick={() => setShowContacts(true)}
          className="text-blue-600 underline font-medium text-sm hover:text-blue-800"
        >
          View {contactsData.length > 1 ? 'Contacts' : 'Contact'}
        </button>
      ) : (
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-blue-700">Shared Contact{contactsData.length > 1 ? 's' : ''}</h3>
          {contactsData.map((contact, idx) => (
            <div key={idx} className="bg-white p-2 rounded border border-gray-300">
              <div className="text-gray-800 font-medium">{contact.name}</div>
              <ul className="mt-1 text-sm text-gray-600">
                {contact.phones.map((phone, pidx) => (
                  <li key={pidx} className="flex items-center gap-1">
                    <span>📞</span>
                    <span>{phone}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button
            onClick={() => setShowContacts(false)}
            className="text-sm text-red-500 underline mt-2 hover:text-red-700"
          >
            Hide Contacts
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactsMessage;
