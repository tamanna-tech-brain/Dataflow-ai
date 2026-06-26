/**
 * pricing.js — Single Source of Truth for All Pricing Data
 *
 * CONSTRAINT: No hardcoded price strings anywhere in markup or component state.
 * All prices are computed from this matrix via computePrice().
 * Output is always formatted via Intl.NumberFormat — never hand-built strings.
 */

export const pricingMatrix = {
  starter: {
    base: 1500,
    tariff: { INR: 1, USD: 0.012, EUR: 0.011 },
  },
  pro: {
    base: 4500,
    tariff: { INR: 1, USD: 0.012, EUR: 0.011 },
  },
  enterprise: {
    base: 12000,
    tariff: { INR: 1, USD: 0.012, EUR: 0.011 },
  },
}

export const ANNUAL_DISCOUNT = 0.8 // 20% off

export const CURRENCY_LOCALES = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
}

/**
 * Compute the final price for a given tier/billing/currency combination.
 * @param {string} tier - 'starter' | 'pro' | 'enterprise'
 * @param {string} billing - 'monthly' | 'annual'
 * @param {string} currency - 'INR' | 'USD' | 'EUR'
 * @returns {number} final price
 */
export function computePrice(tier, billing, currency) {
  const { base, tariff } = pricingMatrix[tier]
  const localBase = base * tariff[currency]
  return billing === 'annual' ? localBase * 12 * ANNUAL_DISCOUNT : localBase
}

/**
 * Format a price number using Intl.NumberFormat.
 * @param {number} amount
 * @param {string} currency - 'INR' | 'USD' | 'EUR'
 * @returns {string} formatted currency string
 */
export function formatPrice(amount, currency) {
  const locale = CURRENCY_LOCALES[currency]
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For small teams getting started',
    features: [
      '5M events / month',
      '3 data connectors',
      'Standard anomaly detection',
      'Email support',
      '99.9% uptime SLA',
    ],
    cta: 'Start Free Trial',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For growing teams that need scale',
    features: [
      '50M events / month',
      '20 data connectors',
      'AI-powered anomaly detection',
      'Priority support (24/7)',
      '99.95% uptime SLA',
      'Custom dashboards',
      'SSO / SAML',
    ],
    cta: 'Start Free Trial',
    highlight: true, // Featured tier
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For organizations at scale',
    features: [
      'Unlimited events',
      'Unlimited connectors',
      'Predictive AI suite',
      'Dedicated success manager',
      '99.99% uptime SLA',
      'Custom SLAs & contracts',
      'On-premise deployment',
      'Compliance (SOC 2, HIPAA)',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
]
