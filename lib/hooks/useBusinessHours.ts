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


  const handleHourChange = (
    index: number,
    field: keyof BusinessHour,
    value: string | boolean,
  ) => {
    setHoursForm((prev) =>
      prev.map((hour, i) => {
        if (i === index) {
          return { ...hour, [field]: value };
        }
        return hour;
      }),
    );
  };

  const handleCopyToAll = (fromIndex: number) => {
    const sourceHour = hoursForm[fromIndex];
    if (sourceHour) {
      setHoursForm(hoursForm.map(h => ({ ...h, open_time: sourceHour.open_time, close_time: sourceHour.close_time, is_closed: sourceHour.is_closed })));
    }
  };

  const handleAddHour = () => {
    setHoursForm([...hoursForm, { day: '', open_time: '09:00', close_time: '17:00', is_closed: false }]);
  };

  const handleRemoveHour = (index: number) => {
    setHoursForm(hoursForm.filter((_, i) => i !== index));
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


  return {
    hoursForm,
    isLoading,
    isUpdatingHours,
    handleHourChange,
    handleCopyToAll,
    handleSaveHours,
    handleAddHour,
    handleRemoveHour,
  };
}