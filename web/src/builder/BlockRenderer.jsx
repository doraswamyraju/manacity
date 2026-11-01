import React, { Suspense, useMemo } from 'react';
import { getComponentForBlock } from './masterRegistry.jsx';

export default function BlockRenderer({
  blockDef,
  content,
  previewMode = 'desktop',
  containerScrollTop = 0,
  isPreview = false,
  branding = null
}) {
  const Component = useMemo(() => {
    if (!blockDef) return null;
    return getComponentForBlock(blockDef.variant || blockDef.blockKey || blockDef.name);
  }, [blockDef]);

  if (!Component) {
    return (
      <div className="w-full p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 font-medium">Component not found for {blockDef?.name || 'block'}</p>
        <p className="text-xs text-gray-400 mt-1">Variant: {blockDef?.variant || blockDef?.blockKey}</p>
      </div>
    );
  }

  // Merge default branding with custom props
  const defaultBranding = {
    business_name: branding?.business_name || 'ManaCity Demo Business',
    companyName: branding?.business_name || 'ManaCity Demo Business',
    email: branding?.email || 'hello@manacity.in',
    phone_number: branding?.phone_number || '+91 87907 91101',
    logo_url: branding?.logo_url || 'https://placehold.co/140x48/1e3a8a/ffffff?text=ManaCity'
  };

  const finalContent = {
    ...defaultBranding,
    ...(blockDef?.defaultData || {}),
    ...(content || {})
  };

  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-400">Loading block preview...</div>}>
      <div className={`w-full overflow-hidden ${previewMode === 'mobile' ? 'text-xs select-none' : ''}`}>
        <Component
          content={finalContent}
          previewMode={previewMode}
          containerScrollTop={containerScrollTop}
          isPreview={isPreview}
          {...defaultBranding}
        />
      </div>
    </Suspense>
  );
}

