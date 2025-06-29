"use client";

import { Facebook } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Switch  } from "@/components/ui";

import { useFacebookIntegrationForm } from "@/lib/hooks/useFacebookIntegrationForm";

export default function FacebookIntegrationCard() {
  const {
    register,
    handleSubmit,
    isLoading,
    isUpdating,
    handleDisconnect,
    handleReconnect,
    isConnected,
  } = useFacebookIntegrationForm();

  if (isLoading) return <p>Loading Facebook integration...</p>;

  return (
    <form onSubmit={handleSubmit}>
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
                <p className="text-sm text-muted-foreground">
                  {isConnected ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
            {isConnected ? (
              <Button type="button" variant="outline" className="text-red-500" onClick={handleDisconnect}>
                Disconnect
              </Button>
            ) : (
              <Button type="button" onClick={handleReconnect}>
                Reconnect
              </Button>
            )}
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Permissions</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Send Automated Replies</label>
                <Switch {...register("is_send_auto_reply")} disabled={!isConnected} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Send Notifications</label>
                <Switch {...register("is_send_notification")} disabled={!isConnected} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isUpdating || !isConnected}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
