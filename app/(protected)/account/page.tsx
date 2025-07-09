

import { User, Lock, Mail, Key, Shield, Settings, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const Account = () => {
  const accountSections = [
    {
      title: "Profile Information",
      description: "Update your personal details and display name",
      icon: User,
      href: "/account/profile",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Change Password",
      description: "Update your account password for better security",
      icon: Lock,
      href: "/account/change-password",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Change Email",
      description: "Update your email address and verify the new one",
      icon: Mail,
      href: "/account/change-email",
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Security Settings",
      description: "Manage two-factor authentication and security preferences",
      icon: Shield,
      href: "/account/security",
      color: "from-orange-500 to-red-600"
    },
    {
      title: "API Keys",
      description: "Generate and manage your personal API keys",
      icon: Key,
      href: "/account/api-keys",
      color: "from-teal-500 to-cyan-600"
    },
    {
      title: "Account Settings",
      description: "Configure notifications and privacy preferences",
      icon: Settings,
      href: "/account/settings",
      color: "from-pink-500 to-rose-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Account Management
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Manage your account settings and security preferences
            </p>
          </div>
        </div>

        {/* Account Sections Grid */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accountSections.map((section) => (
              <Link key={section.href} href={section.href} className="group">
                <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 bg-gradient-to-r ${section.color} rounded-xl shadow-lg`}>
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {section.title}
                        </CardTitle>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base leading-relaxed">
                      {section.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/account/profile">
              <Button variant="outline" className="h-12 px-6">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
            <Link href="/account/change-password">
              <Button variant="outline" className="h-12 px-6">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </Link>
            <Link href="/account/security">
              <Button variant="outline" className="h-12 px-6">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;