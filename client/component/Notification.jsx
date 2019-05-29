
import React from 'react';

const Notification = () => (
  <div className="alert alert-primary pulse text-center" style={{ fontSize: '1em' }}>
    <div style={{ fontSize: '1.25em', fontWeight: 'bold' }}>
      Information still being collected.Graph data may be incorrect.
    </div>
  </div>
);

export default Notification;
