
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, X, Phone} from "lucide-react";

interface Phone {
  phone: string;
  type: "mobile" | "work" | "home";
}

interface Email {
  email: string;
  type: "personal" | "work";
}

interface Contact {
  name: string;
  phones: Phone[];
  emails: Email[];
}

interface ContactPickerProps {
  onContactSelect: (contact: Contact) => void;
}

const ContactPicker = ({ onContactSelect }: ContactPickerProps) => {
  const [contactName, setContactName] = useState("");
  const [phones, setPhones] = useState([{ phone: "", type: "mobile" }]);
  const [emails, setEmails] = useState([{ email: "", type: "personal" }]);

  // Mock contacts for demonstration
  const [savedContacts] = useState<Contact[]>([
    {
      name: "John Doe",
      phones: [{ phone: "+1234567890", type: "mobile" }],
      emails: [{ email: "john@example.com", type: "personal" }]
    },
    {
      name: "Jane Smith",
      phones: [{ phone: "+0987654321", type: "work" }],
      emails: [{ email: "jane@company.com", type: "work" }]
    }
  ]);

  const addPhone = () => {
    setPhones([...phones, { phone: "", type: "mobile" }]);
  };

  const removePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const updatePhone = (index: number, field: keyof Phone, value: string) => {
    const updated = phones.map((phone, i) => {
      if (i === index) {
        if (field === "type") {
          return { ...phone, type: value as Phone['type'] };
        }
        return { ...phone, [field]: value };
      }
      return phone;
    });
    setPhones(updated);
  };

  const addEmail = () => {
    setEmails([...emails, { email: "", type: "personal" }]);
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, field: keyof Email, value: string) => {
    const updated = emails.map((email, i) => {
      if (i === index) {
        if (field === "type") {
          return { ...email, type: value as Email['type'] };
        }
        return { ...email, [field]: value };
      }
      return email;
    });
    setEmails(updated);
  };

  const handleCreateContact = () => {
    if (!contactName.trim()) return;

    const contact: Contact = {
      name: contactName,
      phones: phones.filter(p => p.phone.trim()) as Phone[],
      emails: emails.filter(e => e.email.trim()) as Email[]
    };

    onContactSelect(contact);
  };

  const handleSelectSavedContact = (contact: Contact) => {
    onContactSelect(contact);
  };

  return (
    <div className="space-y-6">
      {/* Saved Contacts */}
      <div>
        <h3 className="text-sm font-medium mb-3">Recent Contacts</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {savedContacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer border"
              onClick={() => handleSelectSavedContact(contact)}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                  {contact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-sm">{contact.name}</div>
                <div className="text-xs text-gray-500">
                  {contact.phones[0]?.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-3">Create New Contact</h3>
        
        {/* Contact Name */}
        <div className="space-y-2 mb-4">
          <Label htmlFor="contactName">Name</Label>
          <Input
            id="contactName"
            placeholder="Enter contact name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>

        {/* Phone Numbers */}
        <div className="space-y-2 mb-4">
          <Label>Phone Numbers</Label>
          {phones.map((phone, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Phone number"
                value={phone.phone}
                onChange={(e) => updatePhone(index, "phone", e.target.value)}
                className="flex-1"
              />
              <select
                value={phone.type}
                onChange={(e) => updatePhone(index, "type", e.target.value as Phone['type'])}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="mobile">Mobile</option>
                <option value="work">Work</option>
                <option value="home">Home</option>
              </select>
              {phones.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePhone(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addPhone}>
            <Plus className="w-3 h-3 mr-1" />
            Add Phone
          </Button>
        </div>

        {/* Email Addresses */}
        <div className="space-y-2 mb-4">
          <Label>Email Addresses</Label>
          {emails.map((email, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Email address"
                type="email"
                value={email.email}
                onChange={(e) => updateEmail(index, "email", e.target.value)}
                className="flex-1"
              />
              <select
                value={email.type}
                onChange={(e) => updateEmail(index, "type", e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
              </select>
              {emails.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEmail(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addEmail}>
            <Plus className="w-3 h-3 mr-1" />
            Add Email
          </Button>
        </div>

        <Button 
          onClick={handleCreateContact}
          disabled={!contactName.trim()}
          className="w-full"
        >
          Share Contact
        </Button>
      </div>
    </div>
  );
};

export default ContactPicker;