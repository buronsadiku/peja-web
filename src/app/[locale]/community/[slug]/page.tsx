import { CommunityDetailPage } from "@/features/community/CommunityDetailPage";

type Props = { params: Promise<{ slug: string }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CommunityDetailPage slug={slug} />;
}
