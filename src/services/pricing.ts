import { PRICING } from 'src/utils/constants';

// [Pure] A USD amount the way the user's language writes money ("$19", "19 US$", "19 $"...), without
// cents when there are none.
function formatUsd(amount: number, language?: string) {
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

// [Pure] The prices ready to show, as i18n params — every price text takes the same ones:
//   oneTimePrice  the one-time price (the site's code)
//   monthlyPrice  the monthly subscription
//   yearlyPrice   the yearly subscription
//   freeDomainMaxPrice  on yearly, the dearest domain whose first year is free
function getPriceLabels(language?: string) {
  return {
    oneTimePrice: formatUsd(PRICING.oneTimePrice, language),
    monthlyPrice: formatUsd(PRICING.monthlyPrice, language),
    yearlyPrice: formatUsd(PRICING.yearlyPrice, language),
    freeDomainMaxPrice: formatUsd(PRICING.yearlyFreeDomainMaxPrice, language),
  };
}

export {
  formatUsd,
  getPriceLabels,
};
