// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
// } from 'recharts';

// interface ViewStat { listing: string; views: number }
// interface LeadStat { listing: string; leads: number }

// export default function AnalyticsDashboard() {
//   const [views, setViews] = useState<ViewStat[]>([]);
//   const [leads, setLeads] = useState<LeadStat[]>([]);
//   const apiBase = process.env.NEXT_PUBLIC_API_URL;

//   useEffect(() => {
//     async function fetchStats() {
//       try {
//         // 1) views per listing
//        const resViews = await fetch('/api/analytics/views-per-listing');

//         setViews(await resViews.json());

//         // 2) leads/chats/bookings per listing
//       const resLeads = await fetch('/api/analytics/leads-per-listing');
//         setLeads(await resLeads.json());

//       } catch (err) {
//         console.error('Failed to load analytics', err);
//       }
//     }
//     fetchStats();
//   }, [apiBase]);

//   return (
//     <div className="space-y-8">
//       {/* Views Chart */}
//       <div>
//         <h2 className="text-xl font-semibold mb-2">Views per Listing</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={views}>
//             <XAxis dataKey="listing" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="views" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Leads Chart */}
//       <div>
//         <h2 className="text-xl font-semibold mb-2">Leads / Chats / Bookings per Listing</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={leads}>
//             <XAxis dataKey="listing" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="leads" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }


'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card, Row, Col, Typography, Divider } from 'antd';

const { Title } = Typography;

interface ViewStat { listing: string; views: number }
interface LeadStat { listing: string; leads: number }

const fakeViews: ViewStat[] = [
  { listing: 'Listing A', views: 120 },
  { listing: 'Listing B', views: 80 },
  { listing: 'Listing C', views: 150 },
];

const fakeLeads: LeadStat[] = [
  { listing: 'Listing A', leads: 10 },
  { listing: 'Listing B', leads: 5 },
  { listing: 'Listing C', leads: 20 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function AnalyticsDashboard() {
  const views = fakeViews;
  const leads = fakeLeads;

  return (
    <div className="space-y-12">
      {/* Views Charts */}
      <Card
        title={<Title level={4} style={{ margin: 0 }}>Views per Listing</Title>}
        bordered={false}
        style={{ marginBottom: 32, boxShadow: '0 2px 8px #f0f1f2' }}
      >
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={views}>
                <XAxis dataKey="listing" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Col>
          <Col xs={24} md={12}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={views}
                  dataKey="views"
                  nameKey="listing"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {views.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </Card>

      {/* Leads Charts */}
      <Card
        title={<Title level={4} style={{ margin: 0 }}>Leads / Chats / Bookings per Listing</Title>}
        bordered={false}
        style={{ boxShadow: '0 2px 8px #f0f1f2' }}
      >
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leads}>
                <XAxis dataKey="listing" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Col>
          <Col xs={24} md={12}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leads}
                  dataKey="leads"
                  nameKey="listing"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {leads.map((entry, index) => (
                    <Cell key={`cell-lead-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </Card>
    </div>
  );
}