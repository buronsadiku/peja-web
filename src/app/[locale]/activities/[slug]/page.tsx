import { ActivityDetailPage } from "@/features/activities/ActivityDetailPage";

const ActivityDetailRoute = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return <ActivityDetailPage slug={slug} />;
};

export default ActivityDetailRoute;
