type PhotoSectionHeaderProps = {
  title: string;
  meta: string;
};

export const PhotoSectionHeader = ({
  title,
  meta,
}: PhotoSectionHeaderProps) => (
  <div className="mt-4 mb-3 flex items-center gap-2.5 first:mt-0">
    <span className="type-body font-serif font-semibold">{title}</span>
    <span className="type-caption text-muted-foreground">&middot; {meta}</span>
  </div>
);
