import { redirect } from "next/navigation";

type GuestRecordPageProps = {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const GuestRecordPage = async ({
  params,
  searchParams,
}: GuestRecordPageProps) => {
  const { slug, locale } = await params;
  const search = await searchParams;
  const sourceParam =
    typeof search.source === "string" ? search.source : null;
  const prefix = locale === "en" ? "" : `/${locale}`;
  const query = sourceParam ? `?source=${sourceParam}` : "";
  redirect(`${prefix}/g/${slug}/compose${query}`);
};
