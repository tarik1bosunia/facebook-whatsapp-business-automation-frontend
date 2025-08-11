# Refactoring Guide: BusinessTab.tsx

This guide outlines the necessary steps to refactor the `BusinessTab.tsx` component and its related hooks to align with the provided Django backend API.

## 1. Backend Changes: Updating `serializers.py`

To allow the frontend to update the business profile and its hours in a single request, you need to make a small but important change to your `business/serializers.py` file.

**Your Current `BusinessProfileSerializer`:**

```python
class BusinessProfileSerializer(serializers.ModelSerializer):
    hours = BusinessHoursSerializer(many=True, read_only=True)

    class Meta:
        model = BusinessProfile
        fields = ['id', 'name', 'email', 'phone', 'website', 'description', 'hours']
```

**The Problem:** The `hours` field is set to `read_only=True`, which means you can fetch the hours with the profile, but you cannot update them when you update the profile.

**The Solution:** You need to remove `read_only=True` and add a custom `update` method to handle the nested data.

**Updated `business/serializers.py`:**

```python
from rest_framework import serializers
from business.models import BusinessProfile, BusinessHours

class BusinessHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessHours
        fields = ['id', 'day', 'open_time', 'close_time', 'is_closed']

class BusinessProfileSerializer(serializers.ModelSerializer):
    # Remove read_only=True to allow writing nested hours
    hours = BusinessHoursSerializer(many=True) 

    class Meta:
        model = BusinessProfile
        fields = ['id', 'name', 'email', 'phone', 'website', 'description', 'hours']

    def update(self, instance, validated_data):
        hours_data = validated_data.pop('hours', [])
        
        # Update the BusinessProfile instance
        instance = super().update(instance, validated_data)

        # Update or create BusinessHours
        for hour_data in hours_data:
            day = hour_data.get('day')
            # Use update_or_create to handle both existing and new hours
            BusinessHours.objects.update_or_create(
                business=instance,
                day=day,
                defaults=hour_data
            )
            
        return instance
```

**Explanation of Backend Changes:**

1.  **`read_only=True` Removal:** By removing `read_only=True` from the `hours` field, you allow the serializer to accept `hours` data in `POST` and `PUT` requests.
2.  **Custom `update` Method:** Django REST Framework does not automatically handle writing to nested serializers. You need to define a custom `.update()` method to tell the serializer how to process the incoming `hours` array. This method iterates through the hours data and uses `update_or_create` to either update an existing entry for a day or create a new one.

With this backend modification, the refactoring plan for the frontend will work perfectly.

## 2. Understanding the Backend API

-   **Business Profile:**
    -   Endpoint: `/api/business-profile/`
    -   Methods: `GET`, `PUT`
    -   Data Shape:
        ```json
        {
          "id": 1,
          "name": "My Business",
          "email": "contact@mybusiness.com",
          "phone": "1234567890",
          "website": "https://mybusiness.com",
          "description": "A great business.",
          "hours": [
            {
              "id": 1,
              "day": "Monday",
              "open_time": "09:00:00",
              "close_time": "17:00:00",
              "is_closed": false
            },
            // ... other days
          ]
        }
        ```
-   **Business Hours:**
    -   Endpoint: `/api/business-hours/`
    -   Methods: `GET`, `POST`, `PUT`, `DELETE`
    -   The `BusinessProfileSerializer` nests the hours, so we can likely manage the business profile and its hours through a single API call to `/api/business-profile/`. The `BusinessHoursViewSet` is available for more granular control if needed, but for this form, updating the profile should be sufficient.

## 3. Refactoring `useBusinessSettings` Hook

The current `useBusinessSettings` hook seems to manage profile and hours data in separate states and has separate save handlers. A better approach is to manage the business profile as a single state object that includes the hours, matching the backend's structure.

Here is a recommended implementation for `lib/hooks/useBusinessSettings.ts`:

```typescript
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGetBusinessProfileQuery, useUpdateBusinessProfileMutation } from '@/lib/redux/services/businessApi'; // Assuming you have this API slice

// Define the types based on your backend serializers
interface BusinessHour {
  id?: number;
  day: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

interface BusinessProfile {
  id?: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  hours: BusinessHour[];
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function useBusinessSettings() {
  const { data: profileData, isLoading: isProfileLoading, isError } = useGetBusinessProfileQuery();
  const [updateBusinessProfile, { isLoading: isUpdating }] = useUpdateBusinessProfileMutation();

  const [formState, setFormState] = useState<BusinessProfile>({
    name: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    hours: [],
  });

  useEffect(() => {
    if (profileData) {
      // Initialize form state with data from the server
      const hoursMap = new Map(profileData.hours.map(h => [h.day, h]));
      const fullHours = DAYS_OF_WEEK.map(day => {
        return hoursMap.get(day) || { day, open_time: '09:00', close_time: '17:00', is_closed: false };
      });

      setFormState({
        ...profileData,
        hours: fullHours,
      });
    } else {
      // Initialize with default structure if no profile exists
      setFormState(prevState => ({
        ...prevState,
        hours: DAYS_OF_WEEK.map(day => ({
          day,
          open_time: '09:00',
          close_time: '17:00',
          is_closed: false,
        })),
      }));
    }
  }, [profileData]);

  const handleInputChange = (field: keyof Omit<BusinessProfile, 'hours'>, value: string) => {
    setFormState(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleHourChange = (day: string, field: keyof Omit<BusinessHour, 'day' | 'id'>, value: string | boolean) => {
    setFormState(prevState => ({
      ...prevState,
      hours: prevState.hours.map(hour =>
        hour.day === day ? { ...hour, [field]: value } : hour
      ),
    }));
  };

  const handleSave = async () => {
    try {
      // The backend expects 'open_time' and 'close_time' to be in HH:MM:SS format or null.
      // The frontend uses HH:MM. We need to format it correctly.
      const payload = {
        ...formState,
        hours: formState.hours.map(h => ({
          ...h,
          open_time: h.is_closed || !h.open_time ? null : `${h.open_time}:00`,
          close_time: h.is_closed || !h.close_time ? null : `${h.close_time}:00`,
        })),
      };
      await updateBusinessProfile(payload).unwrap();
      toast.success('Business profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update business profile.');
      console.error(error);
    }
  };

  return {
    formState,
    isLoading: isProfileLoading,
    isUpdating,
    handleInputChange,
    handleHourChange,
    handleSave,
    timeOptions: generateTimeOptions(), // Helper function to generate time strings
  };
}

function generateTimeOptions() {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      options.push(`${hour}:${minute}`);
    }
  }
  return options;
}
```

## 4. Updating `BusinessTab.tsx` Component

The component should be updated to use the new `useBusinessSettings` hook and its state management logic.

```tsx
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
  Switch, // Import Switch for the is_closed toggle
} from '@/components/ui';
import useBusinessSettings from '@/lib/hooks/useBusinessSettings';
import { Spinner } from '@/components/ui/Spinner'; // Assuming you have a spinner component

export default function BusinessSettings() {
  const {
    formState,
    isLoading,
    isUpdating,
    handleInputChange,
    handleHourChange,
    handleSave,
    timeOptions,
  } = useBusinessSettings();

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          {/* Input fields for name, email, phone, website, description */}
          {/* Example for Business Name */}
          <div className="space-y-2">
            <FormLabel>Business Name</FormLabel>
            <Input
              value={formState.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your Business Name"
            />
          </div>
          {/* ... other profile fields ... */}
        </CardContent>
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
          {formState.hours.map((entry) => (
            <div
              key={entry.day}
              className="grid grid-cols-[100px_1fr_auto] items-center gap-4"
            >
              <span>{entry.day}</span>
              <div className="flex items-center gap-2">
                <Select
                  value={entry.open_time?.substring(0, 5) ?? ''}
                  onValueChange={(val) => handleHourChange(entry.day, 'open_time', val)}
                  disabled={entry.is_closed}
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
                  value={entry.close_time?.substring(0, 5) ?? ''}
                  onValueChange={(val) => handleHourChange(entry.day, 'close_time', val)}
                  disabled={entry.is_closed}
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
              <div className="flex items-center gap-2">
                <FormLabel htmlFor={`closed-${entry.day}`}>Closed</FormLabel>
                <Switch
                  id={`closed-${entry.day}`}
                  checked={entry.is_closed}
                  onCheckedChange={(checked) => handleHourChange(entry.day, 'is_closed', checked)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isUpdating}>
          {isUpdating && <Spinner />}
          Save All Changes
        </Button>
      </div>
    </TabsContent>
  );
}
```

## 5. Key Changes and Rationale

1.  **Single State Object (`formState`):** The new `useBusinessSettings` hook uses a single state object that mirrors the `BusinessProfileSerializer`. This simplifies state management and makes it easier to send the data to the backend.
2.  **Unified Save Handler (`handleSave`):** Instead of separate save functions for profile and hours, there is a single `handleSave` function that updates the entire profile at once. This is more efficient and aligns with the nested serializer structure.
3.  **RTK Query for Data Fetching:** The guide assumes the use of RTK Query for fetching and updating data. You will need to create a `businessApi` slice with `getBusinessProfile` and `updateBusinessProfile` endpoints.
4.  **Handling `is_closed`:** A `Switch` component is added to handle the `is_closed` boolean for each day. When a day is marked as closed, the time selection dropdowns are disabled.
5.  **Time Formatting:** The `handleSave` function ensures that the time is formatted correctly (e.g., `HH:MM:SS`) before sending it to the backend, and `null` if the day is closed, preventing potential validation errors. The UI displays the time in `HH:MM` format for better user experience.

By following this guide, you can refactor your `BusinessTab.tsx` component to be more robust, maintainable, and perfectly synchronized with your backend API.