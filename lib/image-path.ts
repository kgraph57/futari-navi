/**
 * GitHub Pages デプロイ時のbasePath対応ユーティリティ
 *
 * Next.jsのImageコンポーネントは unoptimized: true の場合、
 * basePath を src に自動付与しないため、手動で対応する必要がある。
 * 参照: https://github.com/vercel/next.js/issues/68498
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * 画像パスにbasePath を付与する
 * - "/" で始まるパスにのみ付与する（外部URLは変更しない）
 * - 既にbasePath が含まれている場合は付与しない
 */
export function withBasePath(path: string): string {
  if (!BASE_PATH) return path;
  if (!path.startsWith("/")) return path;
  if (path.startsWith(BASE_PATH)) return path;
  return `${BASE_PATH}${path}`;
}
