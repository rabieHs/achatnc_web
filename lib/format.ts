export function formatPrice(priceInCents: number): string {
  const value = Math.trunc(priceInCents / 100);
  return `${formatNumber(value)} F`;
}

function formatNumber(n: number): string {
  const str = String(n);
  let out = '';
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && (str.length - i) % 3 === 0) out += ' ';
    out += str[i];
  }
  return out;
}

export const FALLBACK_XPF_PER_EUR = 119.33174;

export function priceInEur(priceInCents: number, rate: number = FALLBACK_XPF_PER_EUR): string {
  const xpf = priceInCents / 100;
  const eur = xpf / rate;
  if (eur < 1) return `${eur.toFixed(2)} €`;
  const whole = Math.trunc(eur) === eur;
  return `${eur.toFixed(whole ? 0 : 2)} €`;
}

export function relativeTime(date: Date): string {
  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `il y a ${Math.floor(diff / 86400)} j`;
  if (diff < 2592000) return `il y a ${Math.floor(diff / 604800)} sem`;
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function messageTime(date: Date): string {
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const sameYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();
  if (sameYesterday) return 'Hier';
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400 * 1000);
  if (date > sevenDaysAgo) {
    return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  }
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}
