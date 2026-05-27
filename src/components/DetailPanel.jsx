import { useEffect } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import StatusBadge from './StatusBadge.jsx';
import {
  getAverageWeeklyDemand,
  getTrackingStatus,
  getZeroDemandWeeks,
} from '../utils/calculations.js';

const weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

function getTrackingClass(trackingStatus) {
  return trackingStatus.toLowerCase().replaceAll(' ', '-');
}

function DetailPanel({ item, onClose }) {
  useEffect(() => {
    if (!item) {
      return undefined;
    }

    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  const averageDemand = getAverageWeeklyDemand(item.weekly_demand);
  const zeroWeeks = getZeroDemandWeeks(item.weekly_demand);
  const trackingStatus = getTrackingStatus(item);
  const chartData = item.weekly_demand.map((demand, index) => ({
    week: weekLabels[index],
    demand,
  }));

  return (
    <div
      className="detail-overlay"
      onClick={onClose}
      role="presentation"
    >
      <aside
        className="detail-panel detail-panel--open"
        aria-label={`${item.item} details`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="detail-panel__header">
          <div>
            <p className="eyebrow">Item Details</p>
            <h2>{item.item}</h2>
          </div>
          <button
            className="detail-close-button"
            type="button"
            onClick={onClose}
            aria-label="Close detail panel"
          >
            x
          </button>
        </div>

        <div className="detail-status-row">
          <StatusBadge status={item.status} />
        </div>

        <div className="detail-meta">
          <div>
            <span>Category</span>
            <strong>{item.category}</strong>
          </div>
          <div>
            <span>Region</span>
            <strong>{item.region}</strong>
          </div>
          <div>
            <span>Target</span>
            <strong>{item.target}</strong>
          </div>
        </div>

        <div className="tracking-card">
          <span
            className={`tracking-indicator tracking-indicator--${getTrackingClass(
              trackingStatus,
            )}`}
          >
            {trackingStatus}
          </span>
          <div>
            <span>Average weekly demand</span>
            <strong>{averageDemand.toFixed(1)}</strong>
          </div>
          <div>
            <span>Zero-demand weeks</span>
            <strong>{zeroWeeks}</strong>
          </div>
        </div>

        <div className="trend-chart">
          <h3>Demand Trend</h3>
          <div className="trend-chart__canvas">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    border: '1px solid #d9e0ea',
                    borderRadius: 8,
                    boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="demand"
                  stroke="#0f766e"
                  strokeWidth={3}
                  dot={{
                    fill: '#ffffff',
                    r: 4,
                    stroke: '#0f766e',
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="weekly-detail-list">
          <h3>Weekly Demand</h3>
          <div className="weekly-detail-grid">
            {item.weekly_demand.map((demand, index) => (
              <div className="weekly-detail-cell" key={`${item.id}-detail-${index}`}>
                <span>{weekLabels[index]}</span>
                <strong>{demand}</strong>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default DetailPanel;
