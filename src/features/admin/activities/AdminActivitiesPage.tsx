"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Trash2, Plus, Pencil } from "lucide-react";
import { api } from "@/lib/api/client";
import { adminApi, type TemplateCategory } from "../lib/admin-api";

const categories: TemplateCategory[] = [
  "workshop",
  "adventure",
  "music",
  "food",
  "wellness",
  "cultural",
];

const formatTime = (t: string) => t.slice(0, 5);

export const AdminActivitiesPage = () => {
  const queryClient = useQueryClient();
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [addOccurrenceFor, setAddOccurrenceFor] = useState<string | null>(null);
  const [editingOccurrence, setEditingOccurrence] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const templatesQuery = useQuery({
    queryKey: ["admin", "templates"],
    queryFn: adminApi.templates.list,
  });

  const occurrencesQuery = useQuery({
    queryKey: ["admin", "occurrences"],
    queryFn: () => api.activities.list(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "templates"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "occurrences"] });
    queryClient.invalidateQueries({ queryKey: ["activities"] });
    queryClient.invalidateQueries({ queryKey: ["festival-days"] });
  };

  const deleteTemplate = useMutation({
    mutationFn: adminApi.templates.delete,
    onSuccess: invalidate,
  });

  const deleteOccurrence = useMutation({
    mutationFn: adminApi.occurrences.delete,
    onSuccess: invalidate,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Activities</h1>
          <p className="text-muted-foreground">
            Templates define the activity. Occurrences schedule it on a date
            with capacity.
          </p>
        </div>
        <button
          onClick={() => setShowAddTemplate(true)}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> New Activity
        </button>
      </div>

      {showAddTemplate ? (
        <TemplateForm
          onClose={() => setShowAddTemplate(false)}
          onSaved={invalidate}
        />
      ) : null}

      {templatesQuery.isLoading || occurrencesQuery.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-6">
          {templatesQuery.data?.map((template) => {
            const templateOccurrences = (occurrencesQuery.data ?? []).filter(
              (o) => o.templateId === template.id,
            );
            return (
              <div
                key={template.id}
                className="bg-card border border-border rounded-2xl p-6"
              >
                {editingTemplate === template.id ? (
                  <TemplateForm
                    template={template}
                    onClose={() => setEditingTemplate(null)}
                    onSaved={invalidate}
                  />
                ) : (
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">{template.name}</h2>
                        <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full uppercase">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        slug: {template.slug}
                      </p>
                      {template.description ? (
                        <p className="text-sm text-muted-foreground mt-2">
                          {template.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTemplate(template.id)}
                        className="p-2 hover:bg-background rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete activity "${template.name}"?`))
                            deleteTemplate.mutate(template.id);
                        }}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold">Occurrences</h3>
                    <button
                      onClick={() =>
                        setAddOccurrenceFor(
                          addOccurrenceFor === template.id
                            ? null
                            : template.id,
                        )
                      }
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add occurrence
                    </button>
                  </div>

                  {addOccurrenceFor === template.id ? (
                    <OccurrenceForm
                      templateId={template.id}
                      onClose={() => setAddOccurrenceFor(null)}
                      onSaved={invalidate}
                    />
                  ) : null}

                  {templateOccurrences.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No occurrences scheduled.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {templateOccurrences.map((o) =>
                        editingOccurrence === o.occurrenceId ? (
                          <OccurrenceForm
                            key={o.occurrenceId}
                            templateId={template.id}
                            occurrence={{
                              id: o.occurrenceId,
                              festivalDayId: o.festivalDayId,
                              startTime: o.startTime,
                              endTime: o.endTime,
                              capacity: o.capacity,
                              location: o.location,
                              meetingPoint: o.meetingPoint,
                              address: o.address,
                              latitude: o.latitude,
                              longitude: o.longitude,
                            }}
                            onClose={() => setEditingOccurrence(null)}
                            onSaved={invalidate}
                          />
                        ) : (
                          <div
                            key={o.occurrenceId}
                            className="bg-background border border-border rounded-xl p-3 flex items-center justify-between gap-4"
                          >
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                              <span>{o.date}</span>
                              <span>
                                {formatTime(o.startTime)}–
                                {formatTime(o.endTime)}
                              </span>
                              <span>
                                <span className="text-primary font-bold">
                                  {o.seatsLeft}/{o.capacity}
                                </span>{" "}
                                <span className="text-muted-foreground">
                                  spots
                                </span>
                              </span>
                              <span className="text-muted-foreground truncate">
                                {o.location ?? "—"}
                              </span>
                              <span className="text-muted-foreground truncate">
                                {o.meetingPoint ?? "—"}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() =>
                                  setEditingOccurrence(o.occurrenceId)
                                }
                                className="p-1.5 hover:bg-card rounded-lg"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Delete this occurrence?"))
                                    deleteOccurrence.mutate(o.occurrenceId);
                                }}
                                className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TemplateForm = ({
  template,
  onClose,
  onSaved,
}: {
  template?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: TemplateCategory;
  };
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [name, setName] = useState(template?.name ?? "");
  const [slug, setSlug] = useState(template?.slug ?? "");
  const [description, setDescription] = useState(template?.description ?? "");
  const [category, setCategory] = useState<TemplateCategory>(
    template?.category ?? "workshop",
  );

  const create = useMutation({
    mutationFn: adminApi.templates.create,
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });
  const update = useMutation({
    mutationFn: ({
      id,
      ...rest
    }: { id: string } & Partial<{
      name: string;
      slug: string;
      description: string | null;
      category: TemplateCategory;
    }>) => adminApi.templates.update(id, rest),
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      name,
      slug,
      description: description || null,
      category,
    };
    if (template) {
      update.mutate({ id: template.id, ...payload });
    } else {
      create.mutate(payload);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background border-2 border-primary rounded-xl p-5 mb-4 space-y-3"
    >
      <div className="grid md:grid-cols-2 gap-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="px-4 py-2 bg-card border border-border rounded-lg"
        />
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug-like-this"
          className="px-4 py-2 bg-card border border-border rounded-lg"
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="w-full px-4 py-2 bg-card border border-border rounded-lg"
        rows={2}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as TemplateCategory)}
        className="px-4 py-2 bg-card border border-border rounded-lg"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={create.isPending || update.isPending}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold"
        >
          {template ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-card border border-border px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const OccurrenceForm = ({
  templateId,
  occurrence,
  onClose,
  onSaved,
}: {
  templateId: string;
  occurrence?: {
    id: string;
    festivalDayId: string;
    startTime: string;
    endTime: string;
    capacity: number;
    location: string | null;
    meetingPoint: string | null;
    address?: string | null;
    latitude?: string | null;
    longitude?: string | null;
  };
  onClose: () => void;
  onSaved: () => void;
}) => {
  const [festivalDayId, setFestivalDayId] = useState(
    occurrence?.festivalDayId ?? "",
  );
  const [startTime, setStartTime] = useState(
    occurrence?.startTime?.slice(0, 5) ?? "",
  );
  const [endTime, setEndTime] = useState(
    occurrence?.endTime?.slice(0, 5) ?? "",
  );
  const [capacity, setCapacity] = useState(
    String(occurrence?.capacity ?? 20),
  );
  const [location, setLocation] = useState(occurrence?.location ?? "");
  const [meetingPoint, setMeetingPoint] = useState(
    occurrence?.meetingPoint ?? "",
  );
  const [address, setAddress] = useState(occurrence?.address ?? "");
  const [latitude, setLatitude] = useState(occurrence?.latitude ?? "");
  const [longitude, setLongitude] = useState(occurrence?.longitude ?? "");

  const daysQuery = useQuery({
    queryKey: ["admin", "festival-days"],
    queryFn: adminApi.festivalDays.list,
  });

  const create = useMutation({
    mutationFn: adminApi.occurrences.create,
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });
  const update = useMutation({
    mutationFn: ({
      id,
      ...rest
    }: {
      id: string;
      festivalDayId: string;
      startTime: string;
      endTime: string;
      capacity: number;
      location: string | null;
      meetingPoint: string | null;
      address: string | null;
      latitude: string | null;
      longitude: string | null;
    }) => adminApi.occurrences.update(id, rest),
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      festivalDayId,
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
      capacity: parseInt(capacity, 10),
      location: location || null,
      meetingPoint: meetingPoint || null,
      address: address || null,
      latitude: latitude || null,
      longitude: longitude || null,
    };
    if (occurrence) {
      update.mutate({ id: occurrence.id, ...payload });
    } else {
      create.mutate({ templateId, ...payload });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background border-2 border-primary rounded-xl p-4 mb-3 space-y-3"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <select
          required
          value={festivalDayId}
          onChange={(e) => setFestivalDayId(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
        >
          <option value="">Festival day…</option>
          {(daysQuery.data ?? []).map((d) => (
            <option key={d.id} value={d.id}>
              {d.label
                ? `${d.label} (${d.date})`
                : new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
            </option>
          ))}
        </select>
        <input
          required
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
        />
        <input
          required
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
        />
        <input
          required
          type="number"
          min={0}
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="Capacity"
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
        />
        <input
          value={meetingPoint}
          onChange={(e) => setMeetingPoint(e.target.value)}
          placeholder="Meeting point"
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
        />
      </div>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Full address (optional, for map fallback)"
        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm"
      />
      <div className="grid md:grid-cols-2 gap-2">
        <input
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Latitude (e.g. 42.6629)"
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
        />
        <input
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Longitude (e.g. 20.2876)"
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={create.isPending || update.isPending}
          className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold text-sm"
        >
          {occurrence ? "Update" : "Add"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-card border border-border px-3 py-1.5 rounded-lg text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
