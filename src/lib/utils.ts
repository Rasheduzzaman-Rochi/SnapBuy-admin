export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount);
}

export function formatDate(value: any): string {
  if (!value) return 'N/A';

  // Firestore Timestamp
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate().toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Seconds-based timestamp
  if (typeof value === 'object' && typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // String or number
  try {
    return new Date(value).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return String(value);
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}
