import { Role } from '../roles.common';

describe('Role Enum', () => {
  it('should be defined', () => {
    expect(Role).toBeDefined();
  });

  it('should have Admin role', () => {
    expect(Role.Admin).toBeDefined();
    expect(Role.Admin).toBe('admin');
  });

  it('should have User role', () => {
    expect(Role.User).toBeDefined();
    expect(Role.User).toBe('user');
  });

  it('should not have any other roles', () => {
    const roles = Object.values(Role);
    expect(roles.length).toBe(2);
    expect(roles).toContain('admin');
    expect(roles).toContain('user');
  });
});
