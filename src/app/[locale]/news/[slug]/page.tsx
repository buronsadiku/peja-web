import { NewsDetailPage } from "@/features/news/NewsDetailPage";

const NewsDetailRoute = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  return <NewsDetailPage slug={slug} />;
};

export default NewsDetailRoute;
