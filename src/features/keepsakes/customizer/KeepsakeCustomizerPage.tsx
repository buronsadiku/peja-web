import { notFound } from "next/navigation";
import { keepsakesApi } from "@/lib/api/keepsakes";
import { eventsApi } from "@/lib/api/events";
import { ApiError } from "@/lib/api/client";
import { designFor } from "../designTokens";
import { CustomizerHeader } from "./CustomizerHeader";
import { GoldBookCustomizer } from "./GoldBookCustomizer";
import { VideoMontageCustomizer } from "./VideoMontageCustomizer";
import { AudioVinylCustomizer } from "./AudioVinylCustomizer";
import { DigitalAlbumCustomizer } from "./DigitalAlbumCustomizer";
import { ThankYouCardsCustomizer } from "./ThankYouCardsCustomizer";
import { CanvasPrintCustomizer } from "./CanvasPrintCustomizer";
import type {
  KeepsakeProductDetail,
  KeepsakeProductVariant,
} from "@/lib/api/types";

type KeepsakeCustomizerPageProps = {
  params: Promise<{ slug: string }>;
};

export const KeepsakeCustomizerPage = async ({
  params,
}: KeepsakeCustomizerPageProps) => {
  const { slug } = await params;

  const detail = await keepsakesApi.productBySlug(slug).catch((error) => {
    if (ApiError.isApiError(error) && error.status === 404) return null;
    throw error;
  });

  if (!detail) notFound();

  const eventsResult = await eventsApi.list({ limit: 1 });
  const eventId = eventsResult.items[0]?.id ?? null;
  const design = designFor(detail.product.sku);

  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-6">
      <CustomizerHeader product={detail.product} design={design} />
      <KeepsakeCustomizerSwitch
        productType={detail.product.productType}
        product={detail.product}
        variants={detail.variants}
        eventId={eventId}
      />
    </div>
  );
};

type SwitchProps = {
  productType: string;
  product: KeepsakeProductDetail;
  variants: KeepsakeProductVariant[];
  eventId: string | null;
};

const KeepsakeCustomizerSwitch = ({
  productType,
  product,
  variants,
  eventId,
}: SwitchProps) => {
  switch (productType) {
    case "gold_book":
      return (
        <GoldBookCustomizer
          product={product}
          variants={variants}
          eventId={eventId}
        />
      );
    case "video_montage":
      return <VideoMontageCustomizer product={product} eventId={eventId} />;
    case "audio_vinyl":
      return (
        <AudioVinylCustomizer
          product={product}
          variants={variants}
          eventId={eventId}
        />
      );
    case "digital_album":
      return <DigitalAlbumCustomizer product={product} eventId={eventId} />;
    case "thank_you_cards":
      return (
        <ThankYouCardsCustomizer
          product={product}
          variants={variants}
          eventId={eventId}
        />
      );
    case "canvas_print":
      return (
        <CanvasPrintCustomizer
          product={product}
          variants={variants}
          eventId={eventId}
        />
      );
    default:
      return <DigitalAlbumCustomizer product={product} eventId={eventId} />;
  }
};
