'use client'
import { useState } from "react";


import { Facebook, MessageSquare, Settings as SettingsIcon, Users, Key, User } from "lucide-react";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AIConfigTab } from "@/features/settings/components/AIConfigTab";
import BusinessTab from "@/features/settings/components/BusinessTab";
import FacebookIntegrationCard from "@/features/settings/components/FacebookIntegrationCard";
import WhatsAppIntegrationCard from "@/features/settings/components/WhatsAppIntegrationCard";
import { UserManagementTab } from "@/features/settings";
import Link from "next/link";



const Settings = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully", { position: "bottom-right" });
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
          <Link
            href="/account"
            className="flex items-center justify-start gap-3 p-4 mx-8 rounded-xl hover:bg-white/50 transition-all duration-200 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">Account</span>
          </Link>
        </TabsList>

        <BusinessTab />
        <TabsContent value="integrations" className="space-y-4">
          <FacebookIntegrationCard />
          <WhatsAppIntegrationCard />
        </TabsContent>
        <AIConfigTab />

        <TabsContent value="users">
          <UserManagementTab />
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
                  <Input id="api-key-production" type="password" value="••••••••••••••••••••••••••••••" readOnly className="font-mono" />
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
                  <Input id="api-key-development" type="password" value="••••••••••••••••••••••••••••••" readOnly className="font-mono" />
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
              <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
