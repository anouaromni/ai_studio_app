import React, { useState, useRef } from 'react';
import { RevenuePoint, TimeRange } from '../types';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface RevenueChartProps {
  data: RevenuePoint[];
  timeRange: TimeRange;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, timeRange }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!data || data.length === 0) return null;

  // Chart dimensions
  const width = 800;
  const height = 260;
  const paddingLeft = 55;
  const paddingRight = 25;
  const paddingTop = 20;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const minMrr = Math.min(...data.map((d) => d.mrr)) * 0.97;
  const maxMrr = Math.max(...data.map((d) => d.mrr)) * 1.02;

  const getX = (index: number) => {
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return height - paddingBottom - ((val - minMrr) / (maxMrr - minMrr)) * chartHeight;
  };

  // Smooth Bezier path
  const points = data.map((d, i) => [getX(i), getY(d.mrr)]);
  
  const generateBezier = (pts: number[][]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;

      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }
    return d;
  };

  const linePath = generateBezier(points);
  const areaPath = `${linePath} L ${getX(data.length - 1)},${height - paddingBottom} L ${paddingLeft},${height - paddingBottom} Z`;

  // Format currency
  const formatCompact = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
    return `$${num}`;
  };

  // Mouse hover calculation
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xPos = ((e.clientX - rect.left) / rect.width) * width;
    
    let closest = 0;
    let minDiff = Infinity;
    data.forEach((_, i) => {
      const diff = Math.abs(getX(i) - xPos);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    });
    setHoverIndex(closest);
  };

  const activePoint = hoverIndex !== null ? data[hoverIndex] : null;
  const latestPoint = data[data.length - 1];
  const firstPoint = data[0];
  const netGrowthPercent = (((latestPoint.mrr - firstPoint.mrr) / firstPoint.mrr) * 100).toFixed(1);

  // Y-axis grid ticks (4 ticks)
  const yTicks = [
    minMrr,
    minMrr + (maxMrr - minMrr) * 0.33,
    minMrr + (maxMrr - minMrr) * 0.66,
    maxMrr,
  ];

  return (
    <div id="revenue-chart-card" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">Revenue Growth</h2>
            <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              +{netGrowthPercent}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monthly recurring revenue trajectory ({timeRange.toUpperCase()})
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div>
            <span className="text-slate-400">Current: </span>
            <strong className="text-slate-900 font-semibold">{formatCompact(latestPoint.mrr)}</strong>
          </div>
          <div className="h-3 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400">Period Net: </span>
            <strong className="text-emerald-700 font-semibold">
              +{formatCompact(latestPoint.mrr - firstPoint.mrr)}
            </strong>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative mt-4 w-full">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((val, i) => {
            const y = getY(val);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="500"
                >
                  {formatCompact(val)}
                </text>
              </g>
            );
          })}

          {/* X-axis date labels */}
          {data.map((d, i) => {
            // Show every 2nd or all if small
            if (data.length > 7 && i % 2 !== 0 && i !== data.length - 1) return null;
            const x = getX(i);
            return (
              <text
                key={i}
                x={x}
                y={height - 12}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="11"
                fontWeight="500"
              >
                {d.date}
              </text>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#revenueGradient)" />

          {/* Main Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover highlight column & point */}
          {hoverIndex !== null && activePoint && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={height - paddingBottom}
                stroke="#6366f1"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(activePoint.mrr)}
                r="5"
                fill="#4f46e5"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoverIndex !== null && activePoint && (
          <div
            className="absolute pointer-events-none -top-2 transform -translate-x-1/2 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg border border-slate-700 z-10 transition-all"
            style={{
              left: `${(getX(hoverIndex) / width) * 100}%`,
            }}
          >
            <div className="font-semibold text-slate-200">{activePoint.date}</div>
            <div className="text-indigo-300 font-bold text-sm mt-0.5">
              ${activePoint.mrr.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">MRR</span>
            </div>
            {activePoint.newBookings > 0 && (
              <div className="text-emerald-400 text-[11px] mt-0.5">
                +${activePoint.newBookings.toLocaleString()} new bookings
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
