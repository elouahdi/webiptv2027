import type { UserRole } from '../types';
import { ROLE_PERMISSIONS } from '../types';

export function hasPermission(role: UserRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (perms.includes('*')) return true;
  return perms.includes(permission);
}

export function canManageUsers(role: UserRole): boolean {
  return role === 'admin';
}

export function canDeletePosts(role: UserRole): boolean {
  return hasPermission(role, 'posts:delete');
}

export function canWritePosts(role: UserRole): boolean {
  return hasPermission(role, 'posts:write');
}
