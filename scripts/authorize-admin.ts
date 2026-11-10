import * as fs from 'fs';
import * as path from 'path';

// Usage: npx tsx scripts/authorize-admin.ts <admin-email>

const targetEmail = process.argv[2]?.trim().toLowerCase();

if (!targetEmail || !targetEmail.includes('@')) {
  console.error('\nUsage: npx tsx scripts/authorize-admin.ts <email>');
  console.error('Example: npx tsx scripts/authorize-admin.ts my-admin@example.com\n');
  process.exit(1);
}

const envPath = path.resolve(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local file not found at:', envPath);
  process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');

// Update or append INITIAL_ADMIN_EMAIL
if (envContent.includes('INITIAL_ADMIN_EMAIL=')) {
  envContent = envContent.replace(/INITIAL_ADMIN_EMAIL=.*/g, `INITIAL_ADMIN_EMAIL=${targetEmail}`);
} else {
  envContent += `\nINITIAL_ADMIN_EMAIL=${targetEmail}\n`;
}

fs.writeFileSync(envPath, envContent, 'utf8');

console.log('====================================================');
console.log('GIVORA — SUPER ADMIN AUTHORIZATION CONFIGURED');
console.log('====================================================');
console.log(`Authorized Super Admin Email: ${targetEmail}`);
console.log('Status: Configured in server environment (.env.local)');
console.log('\nNext steps:');
console.log(`1. Ensure this account exists in your Firebase project (givora-11820).`);
console.log(`2. Go to: http://localhost:3000/ar/admin/login`);
console.log(`3. Sign in using "${targetEmail}" and your existing Firebase password.`);
console.log('4. The server will verify your ID token and grant full Super Admin access.');
console.log('====================================================\n');

process.exit(0);
