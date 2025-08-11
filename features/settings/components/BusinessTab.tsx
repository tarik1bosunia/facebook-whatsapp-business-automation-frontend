'use client';

import {
  TabsContent,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
  FormLabel,
  Switch,
} from '@/components/ui';
import useBusinessProfile from '@/lib/hooks/useBusinessProfile';
import useBusinessHours from '@/lib/hooks/useBusinessHours';
import Spinner from '@/components/ui/Spinner';
import { BusinessHour } from '@/types/business';

function BusinessProfileCard() {
  const {
    profileForm,
    isLoading,
    isUpdatingProfile,
    handleInputChange,
    handleSaveProfile,
  } = useBusinessProfile();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
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
            <Input
              value={profileForm.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your Business Name"
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Business Email</FormLabel>
            <Input
              value={profileForm.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@example.com"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel>Phone Number</FormLabel>
            <Input
              value={profileForm.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <FormLabel>Website</FormLabel>
            <Input
              value={profileForm.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>
        <div className="space-y-2">
          <FormLabel>Business Description</FormLabel>
          <Textarea
            value={profileForm.description || ''}
            onChange={(e) =>
              handleInputChange('description', e.target.value)
            }
            placeholder="Describe your business..."
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveProfile} disabled={isUpdatingProfile}>
          {isUpdatingProfile && <Spinner />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}


function BusinessHoursCard() {
  const {
    hoursForm,
    isLoading,
    isUpdatingHours,
    handleHourChange,
    handleCopyToAll,
    handleSaveHours,
    handleAddHour,
    handleRemoveHour,
  } = useBusinessHours();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Hours</CardTitle>
        <CardDescription>
          Set your regular business hours for customer support
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hoursForm.map((entry: BusinessHour, index: number) => (
          <div
            key={index}
            className="grid grid-cols-[120px_1fr_200px_auto_auto_auto] items-center gap-4"
          >
            <Input
              value={entry.day}
              onChange={(e) => handleHourChange(index, 'day', e.target.value)}
              placeholder="Day"
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <Input
                type="time"
                value={entry.open_time || ''}
                onChange={(e) =>
                  handleHourChange(index, 'open_time', e.target.value)
                }
                disabled={entry.is_closed}
              />
              <span>-</span>
              <Input
                type="time"
                value={entry.close_time || ''}
                onChange={(e) =>
                  handleHourChange(index, 'close_time', e.target.value)
                }
                disabled={entry.is_closed}
              />
            </div>
            <div className="text-sm text-gray-500">
              {entry.is_closed ? 'Closed' : ''}
            </div>
            <div className="flex items-center gap-2">
              <FormLabel htmlFor={`closed-${index}`}>Closed</FormLabel>
              <Switch
                id={`closed-${index}`}
                checked={entry.is_closed}
                onCheckedChange={(checked) =>
                  handleHourChange(index, 'is_closed', checked)
                }
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyToAll(index)}
            >
              Copy to all
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRemoveHour(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddHour}
            className="mt-4"
          >
            Add Business Hour
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveHours} disabled={isUpdatingHours}>
          {isUpdatingHours && <Spinner />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function BusinessSettings() {
  return (
    <TabsContent value="business" className="space-y-4">
      <BusinessProfileCard />
      <BusinessHoursCard />
    </TabsContent>
  );
}
