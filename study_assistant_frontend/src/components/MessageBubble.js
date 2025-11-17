import React from 'react';
import PropTypes from 'prop-types';

// PUBLIC_INTERFACE
export default function MessageBubble({ role, children }) {
  /** Render a chat bubble with alignment based on role */
  const roleClass = role === 'user' ? 'user' : 'assistant';
  return (
    <div className={`bubble ${roleClass}`} role="listitem" aria-live="polite">
      {children}
    </div>
  );
}

MessageBubble.propTypes = {
  role: PropTypes.oneOf(['user', 'assistant']).isRequired,
  children: PropTypes.node.isRequired,
};
