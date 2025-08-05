
import { useState, useEffect } from "react";
import { FileText, Search, Filter, Download, Calendar, User, Activity, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuditLog {
  id: number;
  timestamp: string;
  userId: number;
  userEmail: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  severity: "low" | "medium" | "high" | "critical";
}

const AuditLogTab = () => {
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: 1,
      timestamp: "2024-01-02T10:30:00Z",
      userId: 1,
      userEmail: "admin@example.com",
      userName: "Admin User",
      action: "user.create",
      resource: "user",
      resourceId: "18",
      details: "Created new user account for somapti.nu@gmail.com",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      success: true,
      severity: "medium"
    },
    {
      id: 2,
      timestamp: "2024-01-02T10:25:00Z",
      userId: 1,
      userEmail: "admin@example.com",
      userName: "Admin User",
      action: "auth.login",
      resource: "authentication",
      details: "Successful login to admin panel",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      success: true,
      severity: "low"
    },
    {
      id: 3,
      timestamp: "2024-01-02T09:45:00Z",
      userId: 18,
      userEmail: "somapti.nu@gmail.com",
      userName: "Somapti Nu",
      action: "auth.failed_login",
      resource: "authentication",
      details: "Failed login attempt - incorrect password",
      ipAddress: "192.168.1.105",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      success: false,
      severity: "high"
    },
    {
      id: 4,
      timestamp: "2024-01-02T09:15:00Z",
      userId: 1,
      userEmail: "admin@example.com",
      userName: "Admin User",
      action: "role.assign",
      resource: "role",
      resourceId: "3",
      details: "Assigned Business Owner role to user somapti.nu@gmail.com",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      success: true,
      severity: "medium"
    },
    {
      id: 5,
      timestamp: "2024-01-01T14:22:00Z",
      userId: 1,
      userEmail: "admin@example.com",
      userName: "Admin User",
      action: "system.config_change",
      resource: "system",
      details: "Updated API rate limiting configuration",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      success: true,
      severity: "critical"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7d");

  const actionTypes = [
    "auth.login", "auth.logout", "auth.failed_login",
    "user.create", "user.update", "user.delete",
    "role.assign", "role.remove", "role.create",
    "system.config_change", "api.access"
  ];

  const severityLevels = ["low", "medium", "high", "critical"];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getActionIcon = (action: string) => {
    if (action.startsWith("auth")) return User;
    if (action.startsWith("user")) return User;
    if (action.startsWith("role")) return Activity;
    if (action.startsWith("system")) return AlertCircle;
    return FileText;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    
    // Date filtering
    const logDate = new Date(log.timestamp);
    const now = new Date();
    let dateMatch = true;
    
    if (dateRange === "1d") {
      dateMatch = (now.getTime() - logDate.getTime()) <= 24 * 60 * 60 * 1000;
    } else if (dateRange === "7d") {
      dateMatch = (now.getTime() - logDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
    } else if (dateRange === "30d") {
      dateMatch = (now.getTime() - logDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
    }
    
    return matchesSearch && matchesAction && matchesSeverity && dateMatch;
  });

  const formatTimestamp = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(timestamp));
  };

  const getInitials = (name: string, email: string) => {
    if (name && name.includes(' ')) {
      const parts = name.split(' ');
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address', 'Success', 'Severity'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.userEmail,
        log.action,
        log.resource,
        `"${log.details}"`,
        log.ipAddress,
        log.success,
        log.severity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Audit Log
            </CardTitle>
            <CardDescription>
              Track and monitor all user activities and system events
            </CardDescription>
          </div>
          <Button onClick={exportLogs} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold">{logs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Successful</p>
                    <p className="text-2xl font-bold">{logs.filter(l => l.success).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold">{logs.filter(l => !l.success).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Critical</p>
                    <p className="text-2xl font-bold">{logs.filter(l => l.severity === 'critical').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actionTypes.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {severityLevels.map((severity) => (
                  <SelectItem key={severity} value={severity}>
                    {severity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Logs Timeline */}
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const ActionIcon = getActionIcon(log.action);
              return (
                <Card key={log.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${log.userEmail}`} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                          {getInitials(log.userName, log.userEmail)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`p-2 rounded-lg ${log.success ? 'bg-green-100' : 'bg-red-100'}`}>
                        <ActionIcon className={`h-4 w-4 ${log.success ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.userName}</span>
                          <code className="bg-muted px-2 py-1 rounded text-xs">{log.action}</code>
                          <Badge className={getSeverityColor(log.severity)}>
                            {log.severity}
                          </Badge>
                          {!log.success && (
                            <Badge variant="destructive">Failed</Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>IP: {log.ipAddress}</span>
                        <span>User: {log.userEmail}</span>
                        {log.resourceId && <span>Resource ID: {log.resourceId}</span>}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No audit logs found</p>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogTab;