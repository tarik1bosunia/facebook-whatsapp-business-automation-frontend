import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStats from "@/features/dashboard/DashboardStats";
import RecentActivity from "@/features/dashboard/RecentActivity";
import { BarChart3, RefreshCcw, ArrowUpRight, ArrowRight, User } from "lucide-react";
import Link from "next/link";


export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to Style Boutique management portal
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/settings">
              <Button className="flex gap-2 px-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white group">
                Open Settings
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="outline" className="flex gap-2 px-2 font-semibold rounded-xl shadow-lg text-lg group border-2">
                Account Settings
                <User className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </div>
          <Button variant="outline" size="sm" className="flex gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            <RefreshCcw size={16} /> Refresh Data
          </Button>
          <Button size="sm" className="flex gap-2">
            <ArrowUpRight size={16} /> View Reports
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-background border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sales" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Sales
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Customers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <DashboardStats />
          <RecentActivity />
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Dashboard</CardTitle>
              <CardDescription>View all your sales metrics in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Sales charts and data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>Understand your customer base better</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Customer analytics will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>)
}