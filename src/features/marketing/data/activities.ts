export type Day = "thursday" | "friday" | "saturday" | "sunday";

export type Activity = {
  id: string;
  name: string;
  date: string;
  day: Day;
  time: string;
  location: string;
  meetingPoint: string;
  description?: string;
};

export const activities: Activity[] = [
  {
    id: "opening-concert",
    name: "Opening Concert",
    date: "Thursday, June 18",
    day: "thursday",
    time: "19:00 - 23:00",
    location: "Main Stage",
    meetingPoint: "Festival Entrance",
    description:
      "Kick off the festival with an electrifying opening performance featuring local and international artists.",
  },
  {
    id: "art-workshop-thu",
    name: "Art Workshop",
    date: "Thursday, June 18",
    day: "thursday",
    time: "10:00 - 18:00",
    location: "Creative Zone",
    meetingPoint: "Info Tent A",
    description:
      "Get creative with local artists in our interactive workshop. Learn traditional Kosovo art techniques.",
  },
  {
    id: "art-workshop-fri",
    name: "Art Workshop",
    date: "Friday, June 19",
    day: "friday",
    time: "10:00 - 18:00",
    location: "Creative Zone",
    meetingPoint: "Info Tent A",
    description:
      "Get creative with local artists in our interactive workshop. Learn traditional Kosovo art techniques.",
  },
  {
    id: "mountain-hiking",
    name: "Mountain Hiking Adventure",
    date: "Friday, June 19",
    day: "friday",
    time: "08:00 - 14:00",
    location: "Rugova Canyon Trail",
    meetingPoint: "Parking Lot B",
    description:
      "Explore the stunning Peja mountains with experienced guides. Enjoy breathtaking views.",
  },
  {
    id: "music-workshop",
    name: "Music Production Workshop",
    date: "Friday, June 19",
    day: "friday",
    time: "15:00 - 19:00",
    location: "Studio Tent",
    meetingPoint: "Main Plaza",
    description:
      "Learn from professional music producers about beat making, mixing, and production techniques.",
  },
  {
    id: "art-workshop-sat",
    name: "Art Workshop",
    date: "Saturday, June 20",
    day: "saturday",
    time: "10:00 - 18:00",
    location: "Creative Zone",
    meetingPoint: "Info Tent A",
    description:
      "Get creative with local artists in our interactive workshop. Learn traditional Kosovo art techniques.",
  },
  {
    id: "cultural-performance",
    name: "Cultural Performance Night",
    date: "Saturday, June 20",
    day: "saturday",
    time: "20:00 - 22:30",
    location: "Cultural Pavilion",
    meetingPoint: "Main Plaza",
    description:
      "Experience traditional Kosovo music, dance, and storytelling. Local performers share the rich cultural heritage.",
  },
  {
    id: "food-wine-sat",
    name: "Food & Wine Tasting",
    date: "Saturday, June 20",
    day: "saturday",
    time: "12:00 - 17:00",
    location: "Food Court Area",
    meetingPoint: "Culinary Tent",
    description:
      "Sample the best of Kosovo cuisine and wines. Local chefs and winemakers showcase their finest creations.",
  },
  {
    id: "art-workshop-sun",
    name: "Art Workshop",
    date: "Sunday, June 21",
    day: "sunday",
    time: "10:00 - 18:00",
    location: "Creative Zone",
    meetingPoint: "Info Tent A",
    description:
      "Get creative with local artists in our interactive workshop. Learn traditional Kosovo art techniques.",
  },
  {
    id: "food-wine-sun",
    name: "Food & Wine Tasting",
    date: "Sunday, June 21",
    day: "sunday",
    time: "12:00 - 17:00",
    location: "Food Court Area",
    meetingPoint: "Culinary Tent",
    description:
      "Sample the best of Kosovo cuisine and wines. Local chefs and winemakers showcase their finest creations.",
  },
  {
    id: "yoga-session",
    name: "Yoga & Meditation Session",
    date: "Sunday, June 21",
    day: "sunday",
    time: "08:00 - 10:00",
    location: "Wellness Area",
    meetingPoint: "Yoga Pavilion",
    description:
      "Start your day with inner peace and mindfulness. Professional yoga instructors guide you through relaxing poses.",
  },
  {
    id: "closing-celebration",
    name: "Closing Celebration",
    date: "Sunday, June 21",
    day: "sunday",
    time: "21:00 - 00:00",
    location: "Main Stage",
    meetingPoint: "Central Square",
    description:
      "End the festival with a spectacular finale featuring fireworks, special performances, and a final celebration.",
  },
];

export const dayLabels: Record<Day, string> = {
  thursday: "Thursday, June 18",
  friday: "Friday, June 19",
  saturday: "Saturday, June 20",
  sunday: "Sunday, June 21",
};
