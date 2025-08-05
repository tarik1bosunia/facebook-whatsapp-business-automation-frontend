'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Switch,
  Input,
  Label,
  Skeleton,
} from "@/components/ui";
import useWhatsAppIntegrationForm from "@/lib/hooks/useWhatsAppIntegrationForm";
import { MessageCircle } from "lucide-react";

export default function WhatsAppIntegrationCard() {
  const {
    formData,
    fieldErrors,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    handleConnect,
    handleDisconnect,
    isFetching,
    isUpdating,
    isConnected,
    platformId,
  } = useWhatsAppIntegrationForm();

  if (isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            WhatsApp Integration
          </CardTitle>
          <CardDescription>Loading integration settings...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            WhatsApp Integration
          </CardTitle>
          <CardDescription>
            {isConnected ? "Connected" : "Not connected"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="whatsapp-platform_id">Phone Number ID</Label>
              <Input
                id="whatsapp-platform_id"
                value={formData.platform_id}
                onChange={handleChange("platform_id")}
                disabled={isUpdating}
              />
              {fieldErrors.platform_id?.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>

            <div>
              <Label htmlFor="whatsapp-access_token">Access Token</Label>
              <Input
                id="whatsapp-access_token"
                type="password"
                value={formData.access_token}
                onChange={handleChange("access_token")}
                disabled={isUpdating}
                placeholder={isConnected ? "********" : "Enter token"}
              />
              {fieldErrors.access_token?.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>

            <div>
              <Label htmlFor="whatsapp-verify_token">Verify Token</Label>
              <Input
                id="whatsapp-verify_token"
                type="password"
                value={formData.verify_token}
                onChange={handleChange("verify_token")}
                disabled={isUpdating}
                placeholder={isConnected ? "********" : "Enter token"}
              />
              {fieldErrors.verify_token?.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Connection Status</h4>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? "Active connection" : "Not connected"}
                </p>
              </div>
              {isConnected ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDisconnect}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Disconnecting..." : "Disconnect"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleConnect}
                  disabled={!platformId || isUpdating}
                >
                  {isUpdating ? "Connecting..." : "Connect"}
                </Button>
              )}
            </div>

            {isConnected && (
              <div className="space-y-2">
                <h4 className="font-medium">Permissions</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="whatsapp-auto-reply">Auto Replies</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically respond to messages
                    </p>
                  </div>
                  <Switch
                    id="whatsapp-auto-reply"
                    checked={formData.is_send_auto_reply}
                    onCheckedChange={handleCheckboxChange("is_send_auto_reply")}
                    disabled={isUpdating}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="whatsapp-notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive message alerts
                    </p>
                  </div>
                  <Switch
                    id="whatsapp-notifications"
                    checked={formData.is_send_notification}
                    onCheckedChange={handleCheckboxChange("is_send_notification")}
                    disabled={isUpdating}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}