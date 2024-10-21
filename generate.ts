import { getEncryptionPublicKey } from '@metamask/eth-sig-util';
import * as client from '@terminal3/messaging_client';
import { importPKCS8, importSPKI, SignJWT } from 'jose';
import { faker } from '@faker-js/faker';

const t3PrivateKey = process.env.T3_PRIVATE_KEY ?? '';
const HB_ENTERPRISE_PRIVATE_KEY = process.env.HB_ENTERPRISE_PRIVATE_KEY ?? '';
const HB_ENTERPRISE_PUBLIC_KEY = process.env.HB_ENTERPRISE_PUBLIC_KEY ?? '';

export async function main(mail?: string) {
  const email = mail || faker.internet.email().toLowerCase();
  console.log('email', email);
  const alg = 'EdDSA';
  // const keyPair = await generateKeyPair(alg);
  const enterprisePrivateKey = await importPKCS8(
    (HB_ENTERPRISE_PRIVATE_KEY || '').replaceAll('\\n', '\n'),
    alg,
  );
  const enterprisePublicKey = await importSPKI(
    HB_ENTERPRISE_PUBLIC_KEY.replaceAll('\\n', '\n'),
    alg,
  );

  // enterprise server. A JWT with no claims
  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('10000s')
    .sign(enterprisePrivateKey);

  const t3PublicKey = getEncryptionPublicKey(t3PrivateKey);
  // enterprise ui
  const encryptedMsg = client.default.makeEncryptedMsg(
    JSON.stringify({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email,
      helpbnk_id: 'averyverylongstringforhelpbnkwithid.helpbnk',
      jwt,
    }),
    t3PublicKey,
    false,
  );

  return encodeURIComponent(JSON.stringify(encryptedMsg));
}
