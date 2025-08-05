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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormLabel,
} from '@/components/ui';
import useBusinessSettings from '@/lib/hooks/useBusinessSettings';

export default function BusinessSettings() {
  const {
    isProfileLoading,
    isHoursLoading,
    form,
    setForm,
    handleSave,
    handleSaveProfile,
    handleSaveHours,
    hourForm,
    setHourForm,
    weekDays,
    timeOptions,
  } = useBusinessSettings();

  return (
    <TabsContent value="business" className="space-y-4">
      {/* Business Profile Card */}
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
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your Business Name"
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Business Email</FormLabel>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contact@example.com"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>Phone Number</FormLabel>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Website</FormLabel>
              <Input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <FormLabel>Business Description</FormLabel>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe your business..."
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveProfile} disabled={isProfileLoading}>
            {isProfileLoading && (
              <svg
                className="animate-spin mr-2 h-4 w-4"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      {/* Business Hours Card */}
      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>
            Set your regular business hours for customer support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {weekDays.map((day) => {
            const entry = hourForm[day] || {
              open_time: '',
              close_time: '',
              is_closed: false,
            };

            return (
              <div
                key={day}
                className="grid grid-cols-[100px_1fr] items-center gap-4"
              >
                <span>{day}</span>
                <div className="flex items-center gap-2">
                  <Select
                    value={entry.open_time ?? ''}
                    onValueChange={(val) =>
                      setHourForm((prev) => ({
                        ...prev,
                        [day]: {
                          ...prev[day],
                          open_time: val,
                        },
                      }))
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Start" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>to</span>
                  <Select
                    value={entry.close_time ?? ''}
                    onValueChange={(val) =>
                      setHourForm((prev) => ({
                        ...prev,
                        [day]: {
                          ...prev[day],
                          close_time: val,
                        },
                      }))
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="End" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveHours} disabled={isHoursLoading}>
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
