
import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const InteractiveSystemMap = () => {
  const initialNodes: Node[] = useMemo(() => [
    // Frontend Layer
    {
      id: 'frontend',
      type: 'default',
      position: { x: 100, y: 50 },
      data: { 
        label: '🌐 Frontend (React/Vite)\nMulti-role SPA\nBrand • Creator • Admin' 
      },
      style: { 
        background: '#1f2937', 
        color: '#ffffff', 
        border: '2px solid #3b82f6',
        width: 200,
        height: 100
      },
    },
    // Authentication
    {
      id: 'auth',
      type: 'default',
      position: { x: 400, y: 50 },
      data: { 
        label: '🔐 Supabase Auth\nRole-based Access\nEmail Confirmation' 
      },
      style: { 
        background: '#1f2937', 
        color: '#ffffff', 
        border: '2px solid #10b981',
        width: 180,
        height: 100
      },
    },
    // Database
    {
      id: 'database',
      type: 'default',
      position: { x: 100, y: 250 },
      data: { 
        label: '🗄️ PostgreSQL Database\nRow Level Security\nReal-time Subscriptions' 
      },
      style: { 
        background: '#1f2937', 
        color: '#ffffff', 
        border: '2px solid #8b5cf6',
        width: 200,
        height: 100
      },
    },
    // Edge Functions
    {
      id: 'edge-functions',
      type: 'default',
      position: { x: 400, y: 250 },
      data: { 
        label: '⚡ Edge Functions\nServer-side Logic\nEmail • Integrations' 
      },
      style: { 
        background: '#1f2937', 
        color: '#ffffff', 
        border: '2px solid #f59e0b',
        width: 180,
        height: 100
      },
    },
    // External APIs
    {
      id: 'external-apis',
      type: 'default',
      position: { x: 650, y: 150 },
      data: { 
        label: '🔌 External APIs\nInsightIQ • Resend\nStripe • Social Media' 
      },
      style: { 
        background: '#1f2937', 
        color: '#ffffff', 
        border: '2px solid #ef4444',
        width: 180,
        height: 100
      },
    },
    // Core Tables
    {
      id: 'user-tables',
      type: 'default',
      position: { x: 50, y: 400 },
      data: { 
        label: '👥 User Management\nprofiles • user_roles\nbrand_profiles\ncreator_profiles' 
      },
      style: { 
        background: '#0f1419', 
        color: '#ffffff', 
        border: '1px solid #374151',
        width: 160,
        height: 120
      },
    },
    {
      id: 'campaign-tables',
      type: 'default',
      position: { x: 250, y: 400 },
      data: { 
        label: '📋 Campaign System\nprojects_new • project_drafts\ncampaign_reviews\nproject_creators' 
      },
      style: { 
        background: '#0f1419', 
        color: '#ffffff', 
        border: '1px solid #374151',
        width: 160,
        height: 120
      },
    },
    {
      id: 'payment-tables',
      type: 'default',
      position: { x: 450, y: 400 },
      data: { 
        label: '💳 Payment System\nproject_creator_payments\ndeal_earnings\npricing_floors' 
      },
      style: { 
        background: '#0f1419', 
        color: '#ffffff', 
        border: '1px solid #374151',
        width: 160,
        height: 120
      },
    },
    {
      id: 'security-tables',
      type: 'default',
      position: { x: 650, y: 400 },
      data: { 
        label: '🛡️ Security & Audit\nsecurity_audit_log\nr4_rules • r4_flags\nrate_limits' 
      },
      style: { 
        background: '#0f1419', 
        color: '#ffffff', 
        border: '1px solid #374151',
        width: 160,
        height: 120
      },
    },
    // Bottlenecks
    {
      id: 'bottleneck1',
      type: 'default',
      position: { x: 100, y: 580 },
      data: { 
        label: '⚠️ Bundle Size\nRoute Complexity' 
      },
      style: { 
        background: '#7f1d1d', 
        color: '#ffffff', 
        border: '2px solid #dc2626',
        width: 140,
        height: 80
      },
    },
    {
      id: 'bottleneck2',
      type: 'default',
      position: { x: 280, y: 580 },
      data: { 
        label: '⚠️ RLS Performance\nComplex Queries' 
      },
      style: { 
        background: '#7f1d1d', 
        color: '#ffffff', 
        border: '2px solid #dc2626',
        width: 140,
        height: 80
      },
    },
    {
      id: 'bottleneck3',
      type: 'default',
      position: { x: 460, y: 580 },
      data: { 
        label: '⚠️ Cold Starts\nFunction Complexity' 
      },
      style: { 
        background: '#7f1d1d', 
        color: '#ffffff', 
        border: '2px solid #dc2626',
        width: 140,
        height: 80
      },
    },
    {
      id: 'bottleneck4',
      type: 'default',
      position: { x: 640, y: 580 },
      data: { 
        label: '⚠️ API Rate Limits\nData Sync Delays' 
      },
      style: { 
        background: '#7f1d1d', 
        color: '#ffffff', 
        border: '2px solid #dc2626',
        width: 140,
        height: 80
      },
    },
  ], []);

  const initialEdges: Edge[] = useMemo(() => [
    // Main connections
    {
      id: 'frontend-auth',
      source: 'frontend',
      target: 'auth',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
    },
    {
      id: 'frontend-database',
      source: 'frontend',
      target: 'database',
      type: 'smoothstep',
      style: { stroke: '#8b5cf6', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
    },
    {
      id: 'frontend-edge-functions',
      source: 'frontend',
      target: 'edge-functions',
      type: 'smoothstep',
      style: { stroke: '#f59e0b', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
    },
    {
      id: 'auth-database',
      source: 'auth',
      target: 'database',
      type: 'smoothstep',
      style: { stroke: '#6b7280' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
    },
    {
      id: 'edge-functions-database',
      source: 'edge-functions',
      target: 'database',
      type: 'smoothstep',
      style: { stroke: '#6b7280' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280' },
    },
    {
      id: 'edge-functions-external',
      source: 'edge-functions',
      target: 'external-apis',
      type: 'smoothstep',
      style: { stroke: '#ef4444', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
    },
    // Database to tables
    {
      id: 'database-user-tables',
      source: 'database',
      target: 'user-tables',
      type: 'straight',
      style: { stroke: '#374151' },
    },
    {
      id: 'database-campaign-tables',
      source: 'database',
      target: 'campaign-tables',
      type: 'straight',
      style: { stroke: '#374151' },
    },
    {
      id: 'database-payment-tables',
      source: 'database',
      target: 'payment-tables',
      type: 'straight',
      style: { stroke: '#374151' },
    },
    {
      id: 'database-security-tables',
      source: 'database',
      target: 'security-tables',
      type: 'straight',
      style: { stroke: '#374151' },
    },
    // Bottleneck connections
    {
      id: 'frontend-bottleneck1',
      source: 'frontend',
      target: 'bottleneck1',
      type: 'straight',
      style: { stroke: '#dc2626', strokeDasharray: '5,5' },
    },
    {
      id: 'database-bottleneck2',
      source: 'database',
      target: 'bottleneck2',
      type: 'straight',
      style: { stroke: '#dc2626', strokeDasharray: '5,5' },
    },
    {
      id: 'edge-functions-bottleneck3',
      source: 'edge-functions',
      target: 'bottleneck3',
      type: 'straight',
      style: { stroke: '#dc2626', strokeDasharray: '5,5' },
    },
    {
      id: 'external-apis-bottleneck4',
      source: 'external-apis',
      target: 'bottleneck4',
      type: 'straight',
      style: { stroke: '#dc2626', strokeDasharray: '5,5' },
    },
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-[800px] bg-background border border-border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={{ backgroundColor: '#000000' }}
        className="bg-background"
      >
        <Controls className="bg-card border-border" />
        <MiniMap 
          className="bg-card border-border"
          nodeColor="#374151"
          maskColor="rgba(0, 0, 0, 0.2)"
        />
        <Background color="#333333" gap={20} />
      </ReactFlow>
    </div>
  );
};

export default InteractiveSystemMap;
