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
import TimeRangeSlider from '@/components/ui/TimeRangeSlider';
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

const formatTime = (timeString: string | null): string => {
  if (!timeString) {
    return "N/A";
  }
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

function BusinessHoursCard() {
  const {
    hoursForm,
    isLoading,
    isUpdatingHours,
    handleHourChange,
    handleCopyToAll,
    handleSaveHours,
    timeToNumber,
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
        {hoursForm.map((entry: BusinessHour) => (
          <div
            key={entry.day}
            className="grid grid-cols-[100px_1fr_200px_auto_auto] items-center gap-4"
          >
            <span className="font-semibold">{entry.day}</span>
            <TimeRangeSlider
              value={[
                timeToNumber(entry.open_time || '00:00'),
                timeToNumber(entry.close_time || '00:00'),
              ]}
              onChange={(value) => handleHourChange(entry.day, 'open_time', value)}
              disabled={entry.is_closed}
            />
            <div className="text-sm text-gray-500">
              {entry.is_closed
                ? 'Closed'
                : `${formatTime(entry.open_time)} - ${formatTime(
                    entry.close_time
                  )}`}
            </div>
            <div className="flex items-center gap-2">
              <FormLabel htmlFor={`closed-${entry.day}`}>Closed</FormLabel>
              <Switch
                id={`closed-${entry.day}`}
                checked={entry.is_closed}
                onCheckedChange={(checked) =>
                  handleHourChange(entry.day, 'is_closed', checked)
                }
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyToAll(entry.day)}
            >
              Copy to all
            </Button>
          </div>
        ))}
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
