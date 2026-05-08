"use client";

import { useTranslations } from "next-intl";
import { PhotoSearchInput } from "./PhotoSearchInput";
import { PhotoSortButton } from "./PhotoSortButton";
import { PhotoUploadButton } from "./PhotoUploadButton";

type PhotoToolbarProps = {
  eventId: string;
  totalCount: number;
};

export const PhotoToolbar = ({ eventId, totalCount }: PhotoToolbarProps) => {
  const t = useTranslations();
  return (
    <div className="border-border bg-card tablet:px-7 border-b px-4 py-5">
      <div className="desktop:flex-row desktop:items-end desktop:justify-between flex flex-col gap-4">
        <div>
          <h1 className="desktop:type-h1 type-h2 leading-tight font-semibold tracking-tight">
            <span>{t("photos__toolbar__title", { count: totalCount })}</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <PhotoSortButton />
          <PhotoUploadButton eventId={eventId} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        <PhotoSearchInput />
      </div>
    </div>
  );
};
