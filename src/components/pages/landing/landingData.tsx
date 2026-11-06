import {
  CalendarCheckIcon, CameraIcon, CoinsIcon, DatabaseIcon, DumbbellIcon, Flower2Icon, GlobeIcon, HotelIcon, HouseIcon,
  InfinityIcon, KeyRoundIcon, LayoutTemplateIcon, LockIcon, MonitorSmartphoneIcon, MotorbikeIcon, PaletteIcon,
  PenToolIcon, RocketIcon, ScissorsIcon, SearchCheckIcon, ServerIcon, ShirtIcon, SmileIcon, TicketIcon, UtensilsIcon,
  WalletIcon, ZapIcon,
} from 'lucide-react';

import {
  CryptoCalmSite, FourPixieGamesSite, TuViThanSoSite, WordPuzzleSite,
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
// one its neighbour leaves (two paddings back to back would double it). References: ShowcaseGallery.
const SECTION_PAD_BOTTOM_CLASS = 'pb-14 sm:pb-20';

// Gap between neighbouring cards fading in on scroll (see Reveal), so a row arrives one card at a time.
const STAGGER_MS = 120;

// How paying works, said right under the hero's prompt box because it's what people worry about with AI builders:
// no metering by tokens, nothing up front, no credits running out, and paying only once they're happy.
const HERO_PLEDGES: { id: string; labelKey: string; Icon: ArtIcon }[] = [
  { id: 'tokens', labelKey: 'landing_pledge_no_tokens', Icon: CoinsIcon },
  { id: 'upfront', labelKey: 'landing_pledge_no_upfront', Icon: WalletIcon },
  { id: 'limits', labelKey: 'landing_pledge_no_limits', Icon: InfinityIcon },
  { id: 'happy', labelKey: 'landing_pledge_pay_when_happy', Icon: SmileIcon },
];

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

// The example sites the "Ideas" section shows, in this order: four real sites (snapshots of their home pages,
// under their real addresses). Each card links to the live site (`href`).
const SHOWCASE_SITES: { id: string; domainKey: string; typeKey: string; descKey: string; href: string; Site: () => React.ReactNode }[] = [
  { id: 'tuvi', domainKey: 'landing_example_domain_tuvi', typeKey: 'landing_biz_astrology', descKey: 'landing_site_tuvi_desc', href: 'https://tuvithanso.org', Site: TuViThanSoSite },
  { id: 'pixie', domainKey: 'landing_example_domain_pixie', typeKey: 'landing_biz_games', descKey: 'landing_site_pixie_desc', href: 'https://4pixiegames.com', Site: FourPixieGamesSite },
  { id: 'wordpuzzle', domainKey: 'landing_example_domain_wordpuzzle', typeKey: 'landing_biz_puzzles', descKey: 'landing_site_wordpuzzle_desc', href: 'https://wordpuzzle.biveitapp.com', Site: WordPuzzleSite },
  { id: 'cryptocalm', domainKey: 'landing_example_domain_cryptocalm', typeKey: 'landing_biz_crypto', descKey: 'landing_site_cryptocalm_desc', href: 'https://cryptocalm.biveitapp.com', Site: CryptoCalmSite },
];

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
  STAGGER_MS,
  HERO_PLEDGES,
  HERO_PERK_KEYS,
  HERO_QUALITIES,
  BUSINESSES,
  YOUR_TASK_KEYS,
  OUR_TASKS,
  SHOWCASE_SITES,
  COMPARE_ROWS,
  FAQS,
};
