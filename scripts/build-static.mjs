import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, renameSync, rmSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const backupDir = join(root, '.static-export-backup');

const paths = {
  middleware: join(root, 'middleware.ts'),
  auth: join(root, 'app/lib/actions/auth.ts'),
  invoices: join(root, 'app/lib/actions/invoices.ts'),
  authStatic: join(root, 'app/lib/actions/auth.static.ts'),
  invoicesStatic: join(root, 'app/lib/actions/invoices.static.ts'),
};

function backupAndSwap() {
  mkdirSync(backupDir, { recursive: true });

  if (existsSync(paths.middleware)) {
    renameSync(paths.middleware, join(backupDir, 'middleware.ts'));
  }

  if (existsSync(paths.auth)) {
    renameSync(paths.auth, join(backupDir, 'auth.ts'));
  }
  copyFileSync(paths.authStatic, paths.auth);

  if (existsSync(paths.invoices)) {
    renameSync(paths.invoices, join(backupDir, 'invoices.ts'));
  }
  copyFileSync(paths.invoicesStatic, paths.invoices);
}

function restore() {
  const mwBak = join(backupDir, 'middleware.ts');
  if (existsSync(mwBak)) {
    renameSync(mwBak, paths.middleware);
  }

  const authBak = join(backupDir, 'auth.ts');
  if (existsSync(authBak)) {
    if (existsSync(paths.auth)) rmSync(paths.auth);
    renameSync(authBak, paths.auth);
  }

  const invBak = join(backupDir, 'invoices.ts');
  if (existsSync(invBak)) {
    if (existsSync(paths.invoices)) rmSync(paths.invoices);
    renameSync(invBak, paths.invoices);
  }

  if (existsSync(backupDir)) {
    rmSync(backupDir, { recursive: true });
  }
}

backupAndSwap();

const env = {
  ...process.env,
  STATIC_EXPORT: 'true',
  NEXT_PUBLIC_STATIC_EXPORT: 'true',
};

try {
  execSync('npm run build', { stdio: 'inherit', cwd: root, env });
} finally {
  restore();
}
