
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";
// import { Contact } from "@/types/conversation";

export interface Contact {
  name?: string;
  phones?: Array<{
    phone: string;
    type?: string;
  }>;
  emails?: Array<{
    email: string;
    type?: string;
  }>;
}

interface ContactsMessageProps {
  contacts: Contact[];
}

const ContactsMessage = ({ contacts }: ContactsMessageProps) => {
  if (!contacts || contacts.length === 0) return null;

  return (
    <div className="space-y-2">
      {contacts.map((contact, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 max-w-xs shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {contact.name?.charAt(0) || 'C'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{contact.name || 'Unknown Contact'}</div>
              <div className="text-sm text-gray-500">Contact</div>
            </div>
          </div>
          
          {contact.phones && contact.phones.length > 0 && (
            <div className="space-y-1 mb-2">
              {contact.phones.map((phone, phoneIndex) => (
                <div key={phoneIndex} className="flex items-center space-x-2 text-sm">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{phone.phone}</span>
                  {phone.type && (
                    <Badge variant="outline" className="text-xs">{phone.type}</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {contact.emails && contact.emails.length > 0 && (
            <div className="space-y-1">
              {contact.emails.map((email, emailIndex) => (
                <div key={emailIndex} className="flex items-center space-x-2 text-sm">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{email.email}</span>
                  {email.type && (
                    <Badge variant="outline" className="text-xs">{email.type}</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContactsMessage;