import React from 'react';
import Card from '../components/common/Card';

// PUBLIC_INTERFACE
export default function Dashboard() {
  return (
    <div style={styles.grid}>
      <Card title="Upcoming Meetings">
        <ul>
          <li style={styles.item}>
            <strong>Project Sync</strong> — Today 3:00 PM
            <div style={styles.meta}>With: Alice, Bob</div>
          </li>
          <li style={styles.item}>
            <strong>Design Review</strong> — Tomorrow 10:00 AM
            <div style={styles.meta}>With: Carol</div>
          </li>
        </ul>
      </Card>

      <Card title="Quick Actions" footer={
        <>
          <button className="button">Schedule Meeting</button>
          <button className="button ghost">View Calendar</button>
        </>
      }>
        <div style={{ display: 'grid', gap: 8 }}>
          <button className="button secondary">Suggest Best Time</button>
          <button className="button ghost">Share Availability</button>
        </div>
      </Card>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gap: 'var(--space-6)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  },
  item: {
    padding: '10px 0',
    borderBottom: '1px solid var(--color-border)',
  },
  meta: {
    color: 'var(--color-text-medium)',
    fontSize: 14,
    marginTop: 4,
  },
};
