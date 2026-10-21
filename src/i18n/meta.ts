import type { LanguageCode } from 'src/utils/constants';

// Search-result descriptions, one per language: what shows under the title in Google. Written for search
// (what biveit is, for whom, and the main benefits), and kept under ~155 characters so Google doesn't cut them
// off. Kept apart from strings.ts because they're written for search engines rather than shown on the page.
const META_DESCRIPTIONS: Record<LanguageCode, string> = {
  en: 'biveit builds your business website for you. Describe your business in plain words; we design, build, host and launch it, usually within a day.',
  vi: 'biveit làm website trọn gói cho doanh nghiệp: bạn chỉ cần kể về công việc kinh doanh, chúng tôi thiết kế, xây dựng, lo hosting, tên miền và đưa lên mạng.',
  ko: 'biveit가 비즈니스 웹사이트를 대신 만들어 드려요. 사업을 소개만 하면 디자인, 제작, 호스팅, 도메인, 오픈까지 보통 하루면 끝나요.',
  zh: 'biveit 为你的生意全包搭建网站：介绍一下你的业务，设计、开发、托管、域名和上线都由我们完成，通常一天之内即可上线。',
  ja: 'biveit はビジネスのウェブサイトをまるごと作ります。お店や事業について話すだけで、デザイン、制作、ホスティング、ドメイン、公開まで、たいてい 1 日で完了。',
  ru: 'biveit создаёт сайт для вашего бизнеса под ключ: расскажите о деле своими словами, а мы сделаем дизайн, сайт, хостинг и домен и запустим его за день.',
};

export default META_DESCRIPTIONS;
