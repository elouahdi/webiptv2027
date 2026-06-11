import { verifyPassword, getUserByEmail } from '../lib/cms/repositories/users.ts';

(async () => {
  const email = 'admin@regardez-iptv.fr';
  const user = await getUserByEmail(email);
  console.log('getUserByEmail ->', user ? 'FOUND' : 'MISSING');
  if (user) console.log(JSON.stringify(user, null, 2));
  const ver = await verifyPassword(email, 'admin123');
  console.log('verifyPassword with admin123 ->', ver ? 'VALID' : 'INVALID');
})().catch((e) => { console.error(e); process.exit(1); });
