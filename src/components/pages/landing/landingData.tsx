import {
  CalendarCheckIcon, CameraIcon, DatabaseIcon, DumbbellIcon, Flower2Icon, GlobeIcon, HotelIcon, HouseIcon,
  KeyRoundIcon, LayoutTemplateIcon, LockIcon, MonitorSmartphoneIcon, MotorbikeIcon, PaletteIcon, PenToolIcon,
  RocketIcon, ScissorsIcon, SearchCheckIcon, ServerIcon, ShirtIcon, TicketIcon, UtensilsIcon, ZapIcon,
} from 'lucide-react';

import {
  BoutiqueSite, CafeSite, FourPixieGamesSite, HotelSite, MotoRentalSite, PerfumeSite, TuViThanSoSite,
} from 'src/components/pages/landing/ExampleSites';
import PerfumeBottleIcon from 'src/components/pages/landing/PerfumeBottleIcon';
import type { ArtIcon } from 'src/types/landing';

// The landing page's content lists and shared styles. Both the
// plain-HTML sections (LandingSections) and the interactive islands (islands) read from here.

// The landing page runs wider than the app's content column.
const LANDING_WIDTH_CLASS = 'mx-auto w-full max-w-6xl px-4 sm:px-6';

// The primary (lavender) button. Hover darkens through a filter instead of fading the fill (bg-primary/85), so
// the dot grid never shows through.
const BRAND_BUTTON_CLASS = 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary hover:brightness-95';

// One gap between sections, everywhere. Each section pads only its bottom, so the gap above a section is the
// one its neighbour leaves (two paddings back to back would double it). References: ShowcaseCarousel.
const SECTION_PAD_BOTTOM_CLASS = 'pb-14 sm:pb-20';

// The brand lime is too pale to be text on the light page, so emphasised words keep the text colour and get
// a lime highlighter stroke across their lower half instead. Goes on an inline element, so the stroke follows
// the words (wrapping included) rather than the full width.
const BRAND_TEXT_CLASS = 'bg-[linear-gradient(transparent_52%,var(--brand-light)_52%,var(--brand-light)_88%,transparent_88%)] box-decoration-clone px-[0.08em]';

// Gap between neighbouring cards fading in on scroll (see Reveal), so a row arrives one card at a time.
const STAGGER_MS = 120;

const HERO_PERK_KEYS = ['landing_perk_no_code', 'landing_perk_no_jargon', 'landing_perk_all_included', 'landing_adv_tick_changes'];
// The hero's second row: what the finished site is like (rather than what using biveit is like).
const HERO_QUALITIES: { id: string; labelKey: string; Icon: ArtIcon }[] = [
  { id: 'design', labelKey: 'landing_adv_design_title', Icon: PenToolIcon },
  { id: 'seo', labelKey: 'landing_adv_seo_title', Icon: SearchCheckIcon },
  { id: 'speed', labelKey: 'landing_adv_speed_title', Icon: ZapIcon },
  { id: 'responsive', labelKey: 'landing_adv_responsive_title', Icon: MonitorSmartphoneIcon },
];

const BUSINESSES: { id: string; labelKey: string; Icon: ArtIcon }[] = [
  { id: 'motorbike', labelKey: 'landing_biz_motorbike', Icon: MotorbikeIcon },
  { id: 'house', labelKey: 'landing_biz_house', Icon: HouseIcon },
  { id: 'hotel', labelKey: 'landing_biz_hotel', Icon: HotelIcon },
  { id: 'clothes', labelKey: 'landing_biz_clothes', Icon: ShirtIcon },
  { id: 'perfume', labelKey: 'landing_biz_perfume', Icon: PerfumeBottleIcon },
  { id: 'cafe', labelKey: 'landing_biz_cafe', Icon: UtensilsIcon },
  { id: 'salon', labelKey: 'landing_biz_salon', Icon: ScissorsIcon },
  { id: 'photo', labelKey: 'landing_biz_photo', Icon: CameraIcon },
  { id: 'events', labelKey: 'landing_biz_events', Icon: TicketIcon },
  { id: 'flowers', labelKey: 'landing_biz_flowers', Icon: Flower2Icon },
  { id: 'gym', labelKey: 'landing_biz_gym', Icon: DumbbellIcon },
  { id: 'portfolio', labelKey: 'landing_biz_portfolio', Icon: PaletteIcon },
];

// Intentions: the "who does what" split is the core pitch — the user's list is deliberately short, ours
// is deliberately long, and the size difference between the two cards is the point.
const YOUR_TASK_KEYS = ['landing_deal_yours_1', 'landing_deal_yours_2', 'landing_deal_yours_3'];

const OUR_TASKS: { id: string; labelKey: string; Icon: ArtIcon }[] = [
  { id: 'design', labelKey: 'landing_deal_ours_design', Icon: PenToolIcon },
  { id: 'pages', labelKey: 'landing_deal_ours_pages', Icon: LayoutTemplateIcon },
  { id: 'booking', labelKey: 'landing_deal_ours_booking', Icon: CalendarCheckIcon },
  { id: 'accounts', labelKey: 'landing_deal_ours_accounts', Icon: KeyRoundIcon },
  { id: 'data', labelKey: 'landing_deal_ours_data', Icon: DatabaseIcon },
  { id: 'hosting', labelKey: 'landing_deal_ours_hosting', Icon: ServerIcon },
  { id: 'domain', labelKey: 'landing_deal_ours_domain', Icon: GlobeIcon },
  { id: 'security', labelKey: 'landing_deal_ours_security', Icon: LockIcon },
  { id: 'launch', labelKey: 'landing_deal_ours_launch', Icon: RocketIcon },
];

// Example sites, each a different kind of business with its own look. The first two are real sites (snapshots of
// tuvithanso.org and 4pixiegames.com, under their real addresses); the rest are made up, and their addresses are translated and
// deliberately read as placeholders ("your…") so nobody mistakes them for real sites.
const SHOWCASE_SITES: { id: string; domainKey: string; typeKey: string; descKey: string; Site: () => React.ReactNode }[] = [
  { id: 'tuvi', domainKey: 'landing_example_domain_tuvi', typeKey: 'landing_biz_astrology', descKey: 'landing_site_tuvi_desc', Site: TuViThanSoSite },
  { id: 'pixie', domainKey: 'landing_example_domain_pixie', typeKey: 'landing_biz_games', descKey: 'landing_site_pixie_desc', Site: FourPixieGamesSite },
  { id: 'moto', domainKey: 'landing_example_domain_moto', typeKey: 'landing_biz_motorbike', descKey: 'landing_site_moto_desc', Site: MotoRentalSite },
  { id: 'hotel', domainKey: 'landing_example_domain_hotel', typeKey: 'landing_biz_hotel', descKey: 'landing_site_hotel_desc', Site: HotelSite },
  { id: 'clothes', domainKey: 'landing_example_domain_clothes', typeKey: 'landing_biz_clothes', descKey: 'landing_site_clothes_desc', Site: BoutiqueSite },
  { id: 'perfume', domainKey: 'landing_example_domain_perfume', typeKey: 'landing_biz_perfume', descKey: 'landing_site_perfume_desc', Site: PerfumeSite },
  { id: 'cafe', domainKey: 'landing_example_domain_cafe', typeKey: 'landing_biz_cafe', descKey: 'landing_site_cafe_desc', Site: CafeSite },
];

// The hero's big browser cycles through these.
const HERO_SITE_IDS = ['moto', 'hotel', 'cafe', 'clothes'];

// The "Ideas" carousel further down shows these, in this order: the two real sites first, then the made-up one the
// hero doesn't already show, and the hotel to make four.
const GALLERY_SITE_IDS = ['tuvi', 'pixie', 'perfume', 'hotel'];

const COMPARE_ROWS = [
  { id: 'time', usualKey: 'landing_compare_time_usual', vib3Key: 'landing_compare_time_vib3' },
  { id: 'talk', usualKey: 'landing_compare_talk_usual', vib3Key: 'landing_compare_talk_vib3' },
  { id: 'hosting', usualKey: 'landing_compare_host_usual', vib3Key: 'landing_compare_host_vib3' },
  { id: 'changes', usualKey: 'landing_compare_change_usual', vib3Key: 'landing_compare_change_vib3' },
];

const FAQS = [
  { id: 'skills', questionKey: 'landing_faq_skills_q', answerKey: 'landing_faq_skills_a' },
  { id: 'unsure', questionKey: 'landing_faq_unsure_q', answerKey: 'landing_faq_unsure_a' },
  { id: 'changes', questionKey: 'landing_faq_changes_q', answerKey: 'landing_faq_changes_a' },
  { id: 'hosting', questionKey: 'landing_faq_hosting_q', answerKey: 'landing_faq_hosting_a' },
  // Takes the price params (services/pricing), like every text that mentions a price.
  { id: 'cost', questionKey: 'landing_faq_cost_q', answerKey: 'landing_faq_cost_a' },
];

export {
  LANDING_WIDTH_CLASS,
  BRAND_BUTTON_CLASS,
  SECTION_PAD_BOTTOM_CLASS,
  BRAND_TEXT_CLASS,
  STAGGER_MS,
  HERO_PERK_KEYS,
  HERO_QUALITIES,
  BUSINESSES,
  YOUR_TASK_KEYS,
  OUR_TASKS,
  SHOWCASE_SITES,
  HERO_SITE_IDS,
  GALLERY_SITE_IDS,
  COMPARE_ROWS,
  FAQS,
};
