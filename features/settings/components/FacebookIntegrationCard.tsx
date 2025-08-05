'use client';

import { useState } from 'react';
import { Facebook } from "lucide-react";
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
import { useFacebookIntegrationForm } from "@/lib/hooks/useFacebookIntegrationForm";
import { useSubmitShortLivedTokenMutation } from '@/lib/redux/api/facebookApi';
import { toast } from 'react-toastify';

export default function FacebookIntegrationCard() {
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
  } = useFacebookIntegrationForm();

  const [shortLivedToken, setShortLivedToken] = useState('');
  const [submitToken, { isLoading: isSubmittingToken }] = useSubmitShortLivedTokenMutation();

  const handleShortLivedTokenSubmit = async () => {
    try {
      await submitToken({ access_token: shortLivedToken }).unwrap();
      toast.success("Short-lived token submitted successfully!", { position: "bottom-right" });
      setShortLivedToken(''); // Clear the input after successful submission
    } catch (error: unknown) {
      console.error("Failed to submit short-lived token:", error);
      let errorMessage = 'Failed to submit short-lived token. Please try again.';

      // Type guard for RTK Query errors
      interface RTKQueryErrorData {
        errors?: Record<string, string[] | string>;
        message?: string;
        error?: string;
      }

      interface RTKQueryError {
        data?: RTKQueryErrorData | string;
        error?: string;
      }

      const isRTKQueryError = (err: unknown): err is RTKQueryError => {
        return typeof err === 'object' && err !== null && ('data' in err || 'error' in err);
      };

      if (isRTKQueryError(error)) {
        if (typeof error.data === 'object' && error.data !== null) {
          const rtkErrorData = error.data;
          if (rtkErrorData.message) {
            errorMessage = `API Error: ${rtkErrorData.message}`;
          } else if (rtkErrorData.error) {
            errorMessage = `API Error: ${rtkErrorData.error}`;
          } else if (rtkErrorData.errors) {
            // If there are specific field errors, show them concisely
            errorMessage = Object.entries(rtkErrorData.errors)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
          } else {
            errorMessage = 'An unknown API error occurred.';
          }
        } else if (typeof error.data === 'string') {
          errorMessage = `API Error: ${error.data}`;
        } else if (error.error) {
          errorMessage = `Network Error: ${error.error}`;
        }
      } else if (error instanceof Error) {
        errorMessage = `Application Error: ${error.message}`;
      }
      // Fallback for any unhandled error types
      if (errorMessage.includes("Facebook API error")) {
        errorMessage = "Failed to connect to Facebook. Please check your token and try again.";
      }

      
      toast.error(`Error submitting token: ${errorMessage}`, { position: "bottom-right" });
    }
  };

  if (isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            Facebook Integration
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
            <Facebook className="h-5 w-5 text-blue-600" />
            Facebook Integration
          </CardTitle>
          <CardDescription>
            {isConnected ? "Connected" : "Not connected"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="short-lived-token">Short-lived Access Token</Label>
              <Input
                id="short-lived-token"
                type="text"
                value={shortLivedToken}
                onChange={(e) => setShortLivedToken(e.target.value)}
                placeholder="Enter short-lived token"
                disabled={isSubmittingToken}
              />
            </div>
            <Button
              type="button"
              onClick={handleShortLivedTokenSubmit}
              disabled={isSubmittingToken}
            >
              {isSubmittingToken ? "Submitting..." : "Submit Short-lived Token"}
            </Button>
            <div>
              <Label htmlFor="platform_id_facebook">Page ID</Label>
              <Input
                id="platform_id_facebook"
                value={formData.platform_id}
                onChange={handleChange("platform_id_facebook")}
                disabled={isUpdating}
              />
              {fieldErrors.platform_id?.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>

            <div>
              <Label htmlFor="facebook-access_token">Access Token</Label>
              <Input
                id="facebook-access_token"
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
              <Label htmlFor="facebook-verify_token">Verify Token</Label>
              <Input
                id="facebook-verify_token"
                type="password"
                value={formData.verify_token}
                onChange={handleChange("verify_token_facebook")}
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
                    <Label htmlFor="facebook-auto-reply">Auto Replies</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically respond to messages
                    </p>
                  </div>
                  <Switch
                    id="facebook-auto-reply"
                    checked={formData.is_send_auto_reply}
                    onCheckedChange={handleCheckboxChange("is_send_auto_reply")}
                    disabled={isUpdating}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="facebook-notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive message alerts
                    </p>
                  </div>
                  <Switch
                    id="facebook-notifications"
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
