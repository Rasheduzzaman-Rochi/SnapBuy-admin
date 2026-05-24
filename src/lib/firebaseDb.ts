'use client';

import { getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebaseApp';

export const db = getFirestore(app);
