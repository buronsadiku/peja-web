export type Tier = {
  key: string;
  highlighted: boolean;
  tagKey: string;
  nameKey: string;
  price: string;
  perKey: string;
  descKey: string;
  ctaKey: string;
  featKeys: string[];
};

const KEEPSAKE_FEAT_KEYS = [
  "marketing__pricing__keepsake_feats__up_to_250_guests",
  "marketing__pricing__keepsake_feats__letterpress_qr_card_deck_shipped",
  "marketing__pricing__keepsake_feats__unlimited_languages_translations",
  "marketing__pricing__keepsake_feats__planner_co_pilot_seat",
  "marketing__pricing__keepsake_feats__priority_guest_support",
  "marketing__pricing__keepsake_feats__custom_couple_domain",
];

const GOLD_FEAT_KEYS = [
  "marketing__pricing__gold_feats__everything_in_keepsake",
  "marketing__pricing__gold_feats__the_gold_book_180_pp_linen_bound",
  "marketing__pricing__gold_feats__custom_cover_foil_monogram",
  "marketing__pricing__gold_feats__archival_grade_paper",
  "marketing__pricing__gold_feats__global_free_shipping",
  "marketing__pricing__gold_feats__25_off_re_prints_forever",
];

const PRO_STARTER_FEAT_KEYS = [
  "marketing__pricing__pro_starter_feats__up_to_12_events",
  "marketing__pricing__pro_starter_feats__full_couple_experience",
  "marketing__pricing__pro_starter_feats__letterpress_qr_cards",
  "marketing__pricing__pro_starter_feats__client_dashboard",
  "marketing__pricing__pro_starter_feats__co_pilot_seat",
];

const PRO_STUDIO_FEAT_KEYS = [
  "marketing__pricing__pro_studio_feats__unlimited_events",
  "marketing__pricing__pro_studio_feats__everything_in_starter",
  "marketing__pricing__pro_studio_feats__multi_seat_access",
  "marketing__pricing__pro_studio_feats__custom_branding",
  "marketing__pricing__pro_studio_feats__analytics",
  "marketing__pricing__pro_studio_feats__account_manager",
];

export const COUPLES_TIERS: Tier[] = [
  {
    key: "keepsake",
    highlighted: true,
    tagKey: "marketing__pricing__keepsake_tag",
    nameKey: "marketing__pricing__keepsake_name",
    price: "€189",
    perKey: "marketing__pricing__one_time",
    descKey: "marketing__pricing__keepsake_desc",
    ctaKey: "marketing__pricing__keepsake_cta",
    featKeys: KEEPSAKE_FEAT_KEYS,
  },
  {
    key: "gold",
    highlighted: false,
    tagKey: "marketing__pricing__gold_tag",
    nameKey: "marketing__pricing__gold_name",
    price: "€389",
    perKey: "marketing__pricing__one_time",
    descKey: "marketing__pricing__gold_desc",
    ctaKey: "marketing__pricing__gold_cta",
    featKeys: GOLD_FEAT_KEYS,
  },
];

export const PRO_TIERS: Tier[] = [
  {
    key: "pro_starter",
    highlighted: false,
    tagKey: "marketing__pricing__pro_starter_tag",
    nameKey: "marketing__pricing__pro_starter_name",
    price: "€49",
    perKey: "marketing__pricing__per_month",
    descKey: "marketing__pricing__pro_starter_desc",
    ctaKey: "marketing__pricing__pro_starter_cta",
    featKeys: PRO_STARTER_FEAT_KEYS,
  },
  {
    key: "pro_studio",
    highlighted: true,
    tagKey: "marketing__pricing__pro_studio_tag",
    nameKey: "marketing__pricing__pro_studio_name",
    price: "€129",
    perKey: "marketing__pricing__per_month",
    descKey: "marketing__pricing__pro_studio_desc",
    ctaKey: "marketing__pricing__pro_studio_cta",
    featKeys: PRO_STUDIO_FEAT_KEYS,
  },
];
