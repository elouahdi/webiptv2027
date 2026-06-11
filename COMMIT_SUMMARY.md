Automated audit and fixes (admin/public CMS)

What I changed:
- Added `gallery_image_ids` handling to `scripts/migrate-to-mysql.ts` so existing gallery arrays are migrated and preserved.
- Removed dev debug console.log from `app/api/public/settings/route.ts`.
- Cleared temporary debug scripts in `scripts/` (they were used during interactive debugging): `check-settings-db.js`, `update-settings-db.js`, `add-gallery-column.js`.
- Removed noisy createPost debug logs and ensured placeholders match inserted params in `lib/cms/repositories/posts.ts`.
- Fixed `updatePost` to define `sqlNow` and use `toSqlDatetime` for consistent MySQL DATETIME values.
- Kept defensive JSON parsing in storage/repositories; standardized JSON handling where needed.

Smoke tests performed:
- GET `/api/public/settings` returned updated `announcement` with `enabled: true` (admin write visible to public endpoint).
- GET `/api/cms/dashboard/stats` responds and returned counts (0 in this dev DB), confirming API availability.

Next recommended actions (not performed here):
- Run full TypeScript build and lint locally: `npm ci && npm run build && npm run lint`.
- Update `database-schema.sql` if additional schema changes are discovered and ensure migrations match exactly.
- Continue full admin sections audit (Users, Sports, Analytics) as planned in the TODO list.

If you want, I can run the build / lint step now (it may take several minutes).
