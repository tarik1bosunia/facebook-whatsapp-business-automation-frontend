'use client'
import { useState } from "react";


import { Facebook, MessageSquare, Settings as SettingsIcon, Users, Key, Plus } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/Badge";
import { AIConfigTab } from "@/features/settings/AIConfigTab";
import BusinessTab from "@/features/settings/BusinessTab";
import FacebookIntegrationCard from "@/features/settings/FacebookIntegrationCard";
import WhatsAppIntegrationCard from "@/features/settings/WhatsAppIntegrationCard";



const Settings = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your system settings and integrations
        </p>
      </div>

  

      <Tabs defaultValue="business" className="space-y-4">
        <TabsList>
          <TabsTrigger value="business">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Business Settings
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Facebook className="h-4 w-4 mr-2" />
            Platform Integrations
          </TabsTrigger>
          <TabsTrigger value="ai">
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Configuration
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
        </TabsList>

        <BusinessTab />

        {/* <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>Business Name</FormLabel>
                  <Input placeholder="Your Business Name" defaultValue="Style Boutique" />
                </div>
                <div className="space-y-2">
                  <FormLabel>Business Email</FormLabel>
                  <Input placeholder="contact@example.com" defaultValue="contact@styleboutique.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>Phone Number</FormLabel>
                  <Input placeholder="+1 (555) 123-4567" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <FormLabel>Website</FormLabel>
                  <Input placeholder="https://example.com" defaultValue="https://styleboutique.com" />
                </div>
              </div>
              <div className="space-y-2">
                <FormLabel>Business Description</FormLabel>
                <Textarea 
                  placeholder="Describe your business..." 
                  defaultValue="Style Boutique offers premium fashion products with a focus on sustainability and ethical production."
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={loading}>
                {loading && (
                  <svg className="animate-spin mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Set your regular business hours for customer support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <div key={day} className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <span>{day}</span>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="09:00">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Start" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select defaultValue="17:00">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="End" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                        <SelectItem value="19:00">7:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span>Saturday</span>
                <div className="flex items-center gap-2">
                  <Select defaultValue="10:00">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                  <span>to</span>
                  <Select defaultValue="15:00">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                <span>Sunday</span>
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground">Closed</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent> */}

        <TabsContent value="integrations" className="space-y-4">
          <FacebookIntegrationCard />
          <WhatsAppIntegrationCard />
        </TabsContent>

        {/* <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Facebook Integration</CardTitle>
              <CardDescription>
                Connect your Facebook Business Page to manage conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Facebook className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Facebook Page: <span className="font-normal">Style Boutique</span></p>
                    <p className="text-sm text-muted-foreground">Connected since May 1, 2023</p>
                  </div>
                </div>
                <Button variant="outline" className="text-red-500">Disconnect</Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Permissions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Access Messages</label>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Send Automated Replies</label>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Access Page Insights</label>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Manage Comments</label>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Integration</CardTitle>
              <CardDescription>
                Connect your WhatsApp Business account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp Business: <span className="font-normal">+1 (555) 123-4567</span></p>
                    <p className="text-sm text-muted-foreground">Connected since May 3, 2023</p>
                  </div>
                </div>
                <Button variant="outline" className="text-red-500">Disconnect</Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Permissions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Access Messages</label>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Send Automated Replies</label>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Send Notifications</label>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent> */}

        {/* <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Configuration</CardTitle>
              <CardDescription>
                Configure how the AI responds to customer inquiries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <FormLabel>AI Model</FormLabel>
                <Select defaultValue="gemini-pro">
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                    <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                    <SelectItem value="custom">Custom Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <FormLabel>API Key</FormLabel>
                <Input type="password" placeholder="Enter your Gemini API key" defaultValue="•••••••••••••••••••••" />
                <p className="text-xs text-muted-foreground mt-1">Your API key is encrypted and stored securely</p>
              </div>
              
              <div className="space-y-2">
                <FormLabel>AI Response Tone</FormLabel>
                <Select defaultValue="friendly">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly and Casual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="helpful">Helpful and Informative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Brand Persona Instructions</FormLabel>
                <Textarea 
                  placeholder="Instructions for how the AI should represent your brand..." 
                  defaultValue="Represent Style Boutique as a fashion-forward, environmentally conscious brand. Be friendly but professional, and always emphasize our commitment to quality and sustainability."
                  rows={3}
                />
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">AI Behavior Settings</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Auto-respond to common questions</label>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Generate order suggestions</label>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Human handoff for complex inquiries</label>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Learn from conversation history</label>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>Save Configuration</Button>
            </CardFooter>
          </Card>
        </TabsContent> */}
        <AIConfigTab />

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Add and manage users who can access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">User</th>
                        <th className="text-left p-3 font-medium">Email</th>
                        <th className="text-left p-3 font-medium">Role</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                              <AvatarFallback>AS</AvatarFallback>
                            </Avatar>
                            <span>Admin Smith</span>
                          </div>
                        </td>
                        <td className="p-3">admin@example.com</td>
                        <td className="p-3">
                          <Badge>Super Admin</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src="https://i.pravatar.cc/150?u=jane" />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <span>Jane Doe</span>
                          </div>
                        </td>
                        <td className="p-3">jane@example.com</td>
                        <td className="p-3">
                          <Badge variant="outline">Admin</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src="https://i.pravatar.cc/150?u=bob" />
                              <AvatarFallback>BJ</AvatarFallback>
                            </Avatar>
                            <span>Bob Johnson</span>
                          </div>
                        </td>
                        <td className="p-3">bob@example.com</td>
                        <td className="p-3">
                          <Badge variant="outline">Support</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            Invited
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API keys for integrations with your business systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">Production API Key</h4>
                    <p className="text-xs text-muted-foreground">Created on May 1, 2023</p>
                  </div>
                  <Badge>Production</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="password" value="••••••••••••••••••••••••••••••" readOnly className="font-mono" />
                  <Button variant="outline">
                    Reveal
                  </Button>
                  <Button variant="outline">
                    Copy
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">Development API Key</h4>
                    <p className="text-xs text-muted-foreground">Created on May 5, 2023</p>
                  </div>
                  <Badge variant="outline">Development</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="password" value="••••••••••••••••••••••••••••••" readOnly className="font-mono" />
                  <Button variant="outline">
                    Reveal
                  </Button>
                  <Button variant="outline">
                    Copy
                  </Button>
                </div>
              </div>

              <Button className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Generate New API Key
              </Button>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-2">API Access Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Enable API Access</label>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Restrict to IP Whitelist</label>
                    <Switch defaultChecked={false} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Enable Webhook Notifications</label>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
