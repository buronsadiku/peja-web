"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@peja/ui/components/Button";
import { UploadIcon } from "@peja/icons/UploadIcon";
import { usePhotoUpload } from "../hooks/usePhotoUpload";

type PhotoUploadButtonProps = {
  eventId: string;
};

export const PhotoUploadButton = ({ eventId }: PhotoUploadButtonProps) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { upload, isUploading, error } = usePhotoUpload(eventId);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length > 0) {
      await upload(files);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />
      <Button
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        className="rounded-10 bg-foreground text-background hover:bg-foreground/90"
      >
        <UploadIcon width={13} height={13} />{" "}
        {isUploading
          ? t("photos__toolbar__uploading")
          : t("photos__toolbar__upload")}
      </Button>
      {error && (
        <span className="type-caption text-destructive">{error}</span>
      )}
    </div>
  );
};
