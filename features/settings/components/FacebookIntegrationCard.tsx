'use client';

import { useState } from 'react';
import { Facebook, Eye, EyeOff } from "lucide-react";
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
import { useSubmitFacebookAppConfigMutation, useSubmitFacebookAccessTokenMutation, useSubmitFacebookVerifyTokenMutation, useGetFacebookIntegrationStatusQuery } from '@/lib/redux/api/facebookApi';
import { toast } from 'react-toastify';

export default function FacebookIntegrationCard() {
  const {
    formData,
    fieldErrors,
    handleCheckboxChange,
    handleSubmit,
    handleConnect,
    handleDisconnect,
    isUpdating,
    isConnected,
    // platformId,
  } = useFacebookIntegrationForm();

  const { data: integrationStatus, isLoading: isLoadingStatus, refetch: refetchIntegrationStatus } = useGetFacebookIntegrationStatusQuery();

  const [showAppConfigFields, setShowAppConfigFields] = useState(false);
  const [showAccessTokenField, setShowAccessTokenField] = useState(false);
  const [showVerifyTokenField, setShowVerifyTokenField] = useState(false);

  const [shortLivedToken, setShortLivedToken] = useState('');
  const [showShortLivedToken, setShowShortLivedToken] = useState(false);
  const [facebookAppId, setFacebookAppId] = useState('');
  const [facebookAppSecret, setFacebookAppSecret] = useState('');
  const [showFacebookAppSecret, setShowFacebookAppSecret] = useState(false);
  const [verifyToken, setVerifyToken] = useState('');
  const [showVerifyToken, setShowVerifyToken] = useState(false);
  const [submitAppConfig, { isLoading: isSubmittingAppConfig }] = useSubmitFacebookAppConfigMutation();
  const [submitAccessToken, { isLoading: isSubmittingAccessToken }] = useSubmitFacebookAccessTokenMutation();
  const [submitVerifyToken, { isLoading: isSubmittingVerifyToken }] = useSubmitFacebookVerifyTokenMutation();

  const handleAppConfigSubmit = async () => {
    try {
      await submitAppConfig({
        app_id: facebookAppId,
        app_secret: facebookAppSecret,
      }).unwrap();
      toast.success("Facebook App ID and Secret submitted successfully!", { position: "bottom-right" });
      setFacebookAppId('');
      setFacebookAppSecret('');
      refetchIntegrationStatus();
      setShowAppConfigFields(false);
    } catch (error: unknown) {
      console.error("Failed to submit Facebook App ID and Secret:", error);
      let errorMessage = 'Failed to submit Facebook App ID and Secret. Please try again.';

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
      if (errorMessage.includes("Facebook API error")) {
        errorMessage = "Failed to connect to Facebook. Please check your App ID and Secret and try again.";
      }
      toast.error(`Error submitting App ID and Secret: ${errorMessage}`, { position: "bottom-right" });
    }
  };

  const handleAccessTokenSubmit = async () => {
    try {
      await submitAccessToken({
        access_token: shortLivedToken,
      }).unwrap();
      toast.success("Short-lived token submitted successfully!", { position: "bottom-right" });
      setShortLivedToken('');
      refetchIntegrationStatus();
      setShowAccessTokenField(false);
    } catch (error: unknown) {
      // console.error("Failed to submit short-lived token:", error);
      let errorMessage = 'Failed to submit short-lived token. Please try again.';

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
      if (errorMessage.includes("Facebook API error")) {
        errorMessage = "Failed to connect to Facebook. (Please check your token or reset App ID and App Seret) and try again.";
      }
      toast.error(`Error submitting token: ${errorMessage}`, { position: "bottom-right" });
    }
  };

  const handleVerifyTokenSubmit = async () => {
    try {
      await submitVerifyToken({
        verify_token: verifyToken,
      }).unwrap();
      toast.success("Verify token submitted successfully!", { position: "bottom-right" });
      setVerifyToken('');
      refetchIntegrationStatus();
      setShowVerifyTokenField(false);
    } catch (error: unknown) {
      console.error("Failed to submit verify token:", error);
      let errorMessage = 'Failed to submit verify token. Please try again.';

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
      if (errorMessage.includes("Facebook API error")) {
        errorMessage = "Failed to connect to Facebook. Please check your verify token and try again.";
      }
      toast.error(`Error submitting verify token: ${errorMessage}`, { position: "bottom-right" });
    }
  };

  if (isLoadingStatus) {
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

  const appConfigSet = integrationStatus?.app_id_set && integrationStatus?.app_secret_set;
  const longLiveTokenSet = integrationStatus?.long_live_token_set;
  const verifyTokenSet = integrationStatus?.verify_token_set;

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
          {/* Facebook App ID and App Secret */}
          {!appConfigSet || showAppConfigFields ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="facebook-app-id">Facebook App ID</Label>
                <Input
                  id="facebook-app-id"
                  type="text"
                  value={facebookAppId}
                  onChange={(e) => setFacebookAppId(e.target.value)}
                  placeholder="Enter Facebook App ID"
                  disabled={isSubmittingAppConfig}
                />
              </div>

              <div>
                <Label htmlFor="facebook-app-secret">Facebook App Secret</Label>
                <div className="relative">
                  <Input
                    id="facebook-app-secret"
                    type={showFacebookAppSecret ? "text" : "password"}
                    value={facebookAppSecret}
                    onChange={(e) => setFacebookAppSecret(e.target.value)}
                    placeholder="Enter Facebook App Secret"
                    disabled={isSubmittingAppConfig}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowFacebookAppSecret((prev) => !prev)}
                  >
                    {showFacebookAppSecret ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="button"
                onClick={handleAppConfigSubmit}
                disabled={isSubmittingAppConfig}
              >
                {isSubmittingAppConfig ? "Submitting App Config..." : "Submit App ID and Secret"}
              </Button>
              {appConfigSet && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAppConfigFields(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAppConfigFields(true)}
            >
              Reset Facebook App ID and Secret
            </Button>
          )}

          {/* Short-lived Access Token */}
          {appConfigSet && (!longLiveTokenSet || showAccessTokenField) ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="short-lived-token">Short-lived Access Token</Label>
                <div className="relative">
                  <Input
                    id="short-lived-token"
                    type={showShortLivedToken ? "text" : "password"}
                    value={shortLivedToken}
                    onChange={(e) => setShortLivedToken(e.target.value)}
                    placeholder="Enter short-lived token"
                    disabled={isSubmittingAccessToken}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowShortLivedToken((prev) => !prev)}
                  >
                    {showShortLivedToken ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="button"
                onClick={handleAccessTokenSubmit}
                disabled={isSubmittingAccessToken}
              >
                {isSubmittingAccessToken ? "Submitting Access Token..." : "Submit Short-lived Token"}
              </Button>
              {longLiveTokenSet && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAccessTokenField(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          ) : appConfigSet && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAccessTokenField(true)}
            >
              Reset Access Token
            </Button>
          )}

          {/* Verify Token */}
          {appConfigSet && longLiveTokenSet && (!verifyTokenSet || showVerifyTokenField) ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="facebook-verify_token">Verify Token</Label>
                <div className="relative">
                  <Input
                    id="facebook-verify_token"
                    type={showVerifyToken ? "text" : "password"}
                    value={verifyToken}
                    onChange={(e) => setVerifyToken(e.target.value)}
                    disabled={isSubmittingVerifyToken}
                    placeholder="Enter token"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowVerifyToken((prev) => !prev)}
                  >
                    {showVerifyToken ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {fieldErrors.verify_token?.map((error, index) => (
                  <p key={index} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
              </div>
              <Button
                type="button"
                onClick={handleVerifyTokenSubmit}
                disabled={isSubmittingVerifyToken}
              >
                {isSubmittingVerifyToken ? "Submitting Verify Token..." : "Submit Verify Token"}
              </Button>
              {verifyTokenSet && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowVerifyTokenField(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          ) : appConfigSet && longLiveTokenSet && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowVerifyTokenField(true)}
            >
              Reset Verify Token
            </Button>
          )}

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
                  disabled={!longLiveTokenSet || !verifyTokenSet || isUpdating}
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
