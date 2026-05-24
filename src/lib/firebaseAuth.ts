'use client';

import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebaseApp';

export const auth = getAuth(app);
