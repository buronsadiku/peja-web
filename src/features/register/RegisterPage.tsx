"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { activities } from "@/features/marketing/data/activities";
import { ActivityCheckboxItem } from "./components/ActivityCheckboxItem";

type FormData = {
  name: string;
  email: string;
  phone: string;
  selectedDay: "all" | "thursday" | "friday" | "saturday" | "sunday";
  selectedActivities: string[];
  responsibilityAccepted: boolean;
  notifyIfAbsent: boolean;
};

const days: { value: FormData["selectedDay"]; label: string }[] = [
  { value: "all", label: "All Days" },
  { value: "thursday", label: "Thursday, June 18" },
  { value: "friday", label: "Friday, June 19" },
  { value: "saturday", label: "Saturday, June 20" },
  { value: "sunday", label: "Sunday, June 21" },
];

export const RegisterPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    selectedDay: "all",
    selectedActivities: [],
    responsibilityAccepted: false,
    notifyIfAbsent: false,
  });

  const filteredActivities =
    formData.selectedDay === "all"
      ? activities
      : activities.filter((a) => a.day === formData.selectedDay);

  const toggleActivity = (id: string, next: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedActivities: next
        ? [...prev.selectedActivities, id]
        : prev.selectedActivities.filter((a) => a !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data:", formData);
    alert("Registration submitted! (This is a demo)");
  };

  return (
    <div className="pt-24 min-h-screen bg-background">
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-primary">REGISTER</span> NOW
          </h1>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <p className="text-xl text-muted-foreground">
            Join us for an unforgettable festival experience
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <h2 className="text-3xl font-black mb-8">Personal Information</h2>

            <div className="mb-6">
              <label htmlFor="name" className="block mb-3 text-lg">
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-lg"
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block mb-3 text-lg">
                Email Address <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-lg"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-8">
              <label htmlFor="phone" className="block mb-3 text-lg">
                Phone Number <span className="text-primary">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-lg"
                placeholder="+383 XX XXX XXX"
              />
            </div>

            <div className="border-t border-border pt-8 mb-8">
              <h2 className="text-3xl font-black mb-6">Select Activities</h2>
              <p className="text-muted-foreground mb-6">
                Choose which activities you&apos;d like to attend
              </p>

              <div className="mb-6">
                <label htmlFor="day" className="block mb-3 text-lg">
                  Filter by Day
                </label>
                <select
                  id="day"
                  value={formData.selectedDay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      selectedDay: e.target.value as FormData["selectedDay"],
                    })
                  }
                  className="w-full px-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-lg cursor-pointer"
                >
                  {days.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {filteredActivities.map((activity) => (
                  <ActivityCheckboxItem
                    key={activity.id}
                    activity={activity}
                    checked={formData.selectedActivities.includes(activity.id)}
                    onToggle={toggleActivity}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-8 mb-8">
              <h2 className="text-3xl font-black mb-6">Terms & Conditions</h2>

              <label className="flex items-start gap-4 p-5 bg-background border-2 border-border rounded-xl cursor-pointer hover:border-primary transition-all mb-4 group">
                <div className="flex items-center h-6 mt-1">
                  <input
                    type="checkbox"
                    required
                    checked={formData.responsibilityAccepted}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        responsibilityAccepted: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg group-hover:text-primary transition-colors mb-2">
                    I accept responsibility for any injuries{" "}
                    <span className="text-primary">*</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    I understand and accept full responsibility for any
                    injuries or accidents that may occur during festival
                    activities. I participate at my own risk and will not hold
                    the organizers liable for any incidents.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-5 bg-background border-2 border-border rounded-xl cursor-pointer hover:border-primary transition-all group">
                <div className="flex items-center h-6 mt-1">
                  <input
                    type="checkbox"
                    checked={formData.notifyIfAbsent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifyIfAbsent: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg group-hover:text-primary transition-colors mb-2">
                    Notify me if I don&apos;t attend
                  </p>
                  <p className="text-sm text-muted-foreground">
                    I would like to receive a notification if I miss any of the
                    activities I&apos;ve registered for. This helps the
                    organizers plan better and keeps me informed.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground py-5 rounded-xl text-xl font-bold hover:shadow-2xl hover:shadow-primary/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 group"
            >
              Complete Registration
              <Check className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

            <p className="text-sm text-muted-foreground text-center mt-6">
              By registering, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};
