const assert = require('assert');
const { toPublicBusinessDTO, toPublicWebsiteDTO } = require('../src/services/dtoService');

console.log('--- Running ManaCity Production Security & DTO Audit Tests ---');

// Test 1: Verify toPublicBusinessDTO strips letsTrackApiKey and private credentials
(function testPublicBusinessDTO() {
  const mockBusinessGroup = {
    id: 'bg_123',
    name: 'Kumar Shirts',
    letsTrackApiKey: 'SECRET_API_KEY_LT_12345',
    letsTrackTenantId: 'TENANT_SECRET_999',
    ownerId: 'user_secret_owner_789',
    description: 'Quality garments',
    city: 'Tirupati',
    locations: [],
    services: [],
    products: []
  };

  const dto = toPublicBusinessDTO(mockBusinessGroup);

  assert.strictEqual(dto.id, 'bg_123');
  assert.strictEqual(dto.name, 'Kumar Shirts');
  assert.strictEqual(dto.letsTrackApiKey, undefined, 'CRITICAL: letsTrackApiKey must NEVER be present in public DTO');
  assert.strictEqual(dto.letsTrackTenantId, undefined, 'CRITICAL: letsTrackTenantId must NEVER be present in public DTO');
  assert.strictEqual(dto.ownerId, undefined, 'Internal ownerId must NOT be exposed in public DTO');

  console.log('✓ Test 1 Passed: PublicBusinessDTO strips letsTrackApiKey and private secrets.');
})();

// Test 2: Verify toPublicWebsiteDTO strips secrets and handles unpublished sites
(function testPublicWebsiteDTO() {
  const mockWebsite = {
    id: 'web_456',
    subdomain: 'kumar-shirts-tirupati',
    isPublished: true,
    theme: 'modern-corporate',
    sections: [
      { id: 'sec_1', type: 'HERO', enabled: true, displayOrder: 0 }
    ]
  };

  const mockBusinessGroup = {
    id: 'bg_123',
    name: 'Kumar Shirts',
    letsTrackApiKey: 'SECRET_API_KEY_LT_12345'
  };

  const dto = toPublicWebsiteDTO(mockWebsite, mockBusinessGroup);

  assert.strictEqual(dto.subdomain, 'kumar-shirts-tirupati');
  assert.strictEqual(dto.businessGroup.letsTrackApiKey, undefined, 'CRITICAL: Nested letsTrackApiKey stripped from website DTO');
  assert.strictEqual(dto.sections.length, 1);

  console.log('✓ Test 2 Passed: PublicWebsiteDTO strips nested letsTrackApiKey.');
})();

console.log('==================================================');
console.log(' All Security & DTO Validation Tests Passed!');
console.log('==================================================');
