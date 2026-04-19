import 'server-only';
import Stripe from 'stripe';

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is missing');
  cached = new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
  return cached;
}

export const BOOST_PRICE_IDS: Record<string, string | undefined> = {
  boost_1w: process.env.STRIPE_PRICE_BOOST_1W,
  boost_2w: process.env.STRIPE_PRICE_BOOST_2W,
  boost_4w: process.env.STRIPE_PRICE_BOOST_4W,
};

export const BOOST_DURATION_DAYS: Record<string, number> = {
  boost_1w: 7,
  boost_2w: 14,
  boost_4w: 28,
};

export const BOOST_LABELS: Record<string, string> = {
  boost_1w: '1 semaine',
  boost_2w: '2 semaines',
  boost_4w: '1 mois',
};
