'use client';

import { getStorage } from 'firebase/storage';
import { app } from '@/lib/firebaseApp';

export const storage = getStorage(app);
