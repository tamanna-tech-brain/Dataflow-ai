/**
 * features.js — Feature data for Bento Grid / Accordion
 * Each feature maps to a card in the Bento (desktop) and a panel in the Accordion (mobile).
 */

export const FEATURES = [
  {
    id: 'realtime-sync',
    title: 'Real-time Data Sync',
    description:
      'Sub-50ms latency across all your data sources. Webhooks, CDC, and streaming APIs unified into a single event bus that never drops a packet.',
    stat: '< 50ms',
    statLabel: 'avg latency',
    icon: 'sync',
    accent: '#6366F1',
    span: { col: 2, row: 2 }, // Large card for Bento
  },
  {
    id: 'anomaly-detection',
    title: 'AI Anomaly Detection',
    description:
      'ML models trained on your own data surface outliers before they become incidents. Configurable sensitivity, zero false-positive fatigue.',
    stat: '99.7%',
    statLabel: 'detection accuracy',
    icon: 'anomaly',
    accent: '#F59E0B',
    span: { col: 1, row: 2 },
  },
  {
    id: 'pipeline-builder',
    title: 'Zero-ETL Pipelines',
    description:
      'Drag-and-drop pipeline builder with 200+ pre-built transformations. Deploy in seconds with auto-scaling infrastructure underneath.',
    stat: '200+',
    statLabel: 'transformations',
    icon: 'pipeline',
    accent: '#10B981',
    span: { col: 1, row: 1 },
  },
  {
    id: 'multi-cloud',
    title: 'Multi-Cloud Connectors',
    description:
      'AWS, GCP, Azure, and 50+ SaaS integrations out of the box. Connect your data wherever it lives — no vendor lock-in.',
    stat: '50+',
    statLabel: 'integrations',
    icon: 'cloud',
    accent: '#06B6D4',
    span: { col: 1, row: 1 },
  },
  {
    id: 'compliance',
    title: 'Compliance Automation',
    description:
      'SOC 2, HIPAA, and GDPR compliance built in. Automated audit trails, data lineage, and one-click reports for your security team.',
    stat: 'SOC 2',
    statLabel: 'certified',
    icon: 'shield',
    accent: '#EC4899',
    span: { col: 1, row: 2 },
  },
  {
    id: 'predictive-analytics',
    title: 'Predictive Analytics',
    description:
      'Forecast demand, detect churn signals, and surface growth opportunities — all from the same platform. No separate BI tool required.',
    stat: '3×',
    statLabel: 'faster insights',
    icon: 'chart',
    accent: '#8B5CF6',
    span: { col: 2, row: 1 }, // Wide card for Bento
  },
]
