import { useEffect, useState } from 'react';
import { useGetBusinessHoursQuery, useUpdateBusinessHoursMutation } from '@/lib/redux/services/businessApi';
import { BusinessHour } from '@/types/business';
import { toast } from 'react-toastify';

const initialHours: BusinessHour[] = [
  { day: 'Monday', open_time: '09:00', close_time: '17:00', is_closed: false },
  { day: 'Tuesday', open_time: '09:00', close_time: '17:00', is_closed: false },
  { day: 'Wednesday', open_time: '09:00', close_time: '17:00', is_closed: false },
  { day: 'Thursday', open_time: '09:00', close_time: '17:00', is_closed: false },
  { day: 'Friday', open_time: '09:00', close_time: '17:00', is_closed: false },
  { day: 'Saturday', open_time: '10:00', close_time: '14:00', is_closed: true },
  { day: 'Sunday', open_time: '10:00', close_time: '14:00', is_closed: true },
];

export default function useBusinessHours() {
  const { data: businessHours, isLoading } = useGetBusinessHoursQuery();
  const [updateBusinessHours, { isLoading: isUpdatingHours }] = useUpdateBusinessHoursMutation();
  const [hoursForm, setHoursForm] = useState<BusinessHour[]>(initialHours);

  useEffect(() => {
    if (businessHours) {
      setHoursForm(businessHours);
    }
  }, [businessHours]);

  const numberToTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  };

  const handleHourChange = (
    day: string,
    field: keyof BusinessHour,
    value: string | boolean | number[],
  ) => {
    setHoursForm((prev) =>
      prev.map((hour) => {
        if (hour.day === day) {
          if (Array.isArray(value) && typeof value[0] === 'number' && typeof value[1] === 'number') {
            return {
              ...hour,
              open_time: numberToTime(value[0]),
              close_time: numberToTime(value[1]),
            };
          }
          return { ...hour, [field]: value };
        }
        return hour;
      }),
    );
  };

  const handleCopyToAll = (fromDay: string) => {
    const sourceHour = hoursForm.find((h) => h.day === fromDay);
    if (sourceHour) {
      setHoursForm(hoursForm.map(h => ({ ...h, open_time: sourceHour.open_time, close_time: sourceHour.close_time, is_closed: sourceHour.is_closed })));
    }
  };

  const handleSaveHours = async () => {
    try {
      await updateBusinessHours(hoursForm).unwrap();
      toast.success('Business hours updated successfully');
    } catch (err) {
      const error = err as { data?: { detail?: string } };
      toast.error(error.data?.detail || 'Failed to update business hours');
    }
  };

  const timeToNumber = (time: string | null): number => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return {
    hoursForm,
    isLoading,
    isUpdatingHours,
    handleHourChange,
    handleCopyToAll,
    handleSaveHours,
    timeToNumber,
  };
}