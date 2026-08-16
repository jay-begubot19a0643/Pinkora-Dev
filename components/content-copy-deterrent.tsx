'use client';

import { useState } from 'react';

type ElementWithTag = EventTarget & { tagName?: string; isContentEditable?: boolean };

function isEditableTarget(target: EventTarget | null) {
  const element = target as ElementWithTag | null;
  return Boolean(element && (element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName ?? '')));
}

function isInteractiveTarget(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return Boolean(element?.closest('a, button, input, textarea, select, summary'));
}

export function ContentCopyDeterrent({ children }: { children: React.ReactNode }) {
  const [notice, setNotice] = useState('');

  function showNotice() {
    setNotice('Portfolio content is protected. Please contact JVerse to request permission to reuse it.');
  }

  return (
    <div
      className="next-copy-deterrent"
      onContextMenu={(event) => {
        if (isInteractiveTarget(event.target)) return;
        event.preventDefault();
        showNotice();
      }}
      onCopy={(event) => {
        if (isEditableTarget(event.target)) return;
        event.preventDefault();
        showNotice();
      }}
      onCut={(event) => {
        if (isEditableTarget(event.target)) return;
        event.preventDefault();
        showNotice();
      }}
      onKeyDown={(event) => {
        if (isEditableTarget(event.target)) return;
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
          event.preventDefault();
          showNotice();
        }
      }}
    >
      {children}
      <p className="next-copy-deterrent-notice" role="status" aria-live="polite">{notice}</p>
    </div>
  );
}
