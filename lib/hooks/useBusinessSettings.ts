"use client";

import { useEffect, useState } from "react";
import {
  useCreateBusinessHourMutation,
  useGetBusinessHoursQuery,
  useGetBusinessProfileQuery,
  useUpdateBusinessHourMutation,
  useUpdateBusinessProfileMutation,
} from "../redux/services/businessApi";
import { toast } from "react-toastify";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeOptions = [
  "08:00:00",
  "09:00:00",
  "10:00:00",
  "11:00:00",
  "12:00:00",
  "13:00:00",
  "14:00:00",
  "15:00:00",
  "16:00:00",
  "17:00:00",
  "18:00:00",
  "19:00:00",
];

type DayEntry = {
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  id?: number;
};

export default function useBusinessSettings() {
  const { data: profile, isLoading: profileLoading } =
    useGetBusinessProfileQuery();
  const { data: hours = [], isLoading: hoursLoading } =
    useGetBusinessHoursQuery();

  const [updateBusinessProfile, { isLoading: updatingProfile }] =
    useUpdateBusinessProfileMutation();
  const [createBusinessHour] = useCreateBusinessHourMutation();
  const [updateBusinessHour, {isLoading: updatingBusinessHour}] = useUpdateBusinessHourMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    description: "",
  });

  const [hourForm, setHourForm] = useState<Record<string, DayEntry>>({});

  useEffect(() => {
    // Populate form
    if (profile) {
      setForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        website: profile.website ?? "",
        description: profile.description ?? "",
      });
    }

    if (hours.length) {
      const mapped: Record<string, DayEntry> = {};
      for (const day of weekDays) {
        const dayData = hours.find((h) => h.day === day);
        mapped[day] = {
          open_time: dayData?.open_time ?? null,
          close_time: dayData?.close_time ?? null,
          is_closed: dayData?.is_closed ?? false,
          id: dayData?.id,
        };
      }
      setHourForm(mapped);
    }
  }, [profile, hours]);

  const handleSaveProfile = async () => {
    try {
      await updateBusinessProfile(form).unwrap();
      toast.success("Business profile updated!");
    } catch (err: any) {
      console.error("Profile update failed", err);
      toast.error(err?.data?.detail || "Failed to save business profile.");
    }
  };

  const handleSaveHours = async () => {
    try {
      for (const day of weekDays) {
        const entry = hourForm[day];
        if (!entry) continue;
        const payload = {
          day,
          open_time: entry.open_time,
          close_time: entry.close_time,
          is_closed: entry.is_closed,
        };

        if (entry.id) {
          await updateBusinessHour({ id: entry.id, ...payload }).unwrap();
        } else {
          await createBusinessHour(payload).unwrap();
        }
      }
      toast.success("Business hours updated!");
    } catch (err: any) {
      console.error("Hours update failed", err);
      toast.error(err?.data?.detail || "Failed to save business hours.");
    }
  };

  const handleSave = async () => {
    try {
      await updateBusinessProfile(form).unwrap();

      for (const day of weekDays) {
        const entry = hourForm[day];
        if (!entry) continue;

        const payload = {
          day,
          open_time: entry.open_time,
          close_time: entry.close_time,
          is_closed: entry.is_closed,
        };

        if (entry.id) {
          await updateBusinessHour({ id: entry.id, ...payload }).unwrap();
        } else {
          await createBusinessHour(payload).unwrap();
        }
      }

      toast.success("Saved successfully!");
    } catch (err: any) {
      console.error("Save failed", err);
      toast.error(err?.data?.detail || "Failed to save. Please try again.");
    }
  };

  const isProfileLoading = profileLoading || updatingProfile
  const isHoursLoading = hoursLoading || updatingBusinessHour


  return {
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
  };
}
