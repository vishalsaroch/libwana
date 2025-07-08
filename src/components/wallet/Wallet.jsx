'use client'

import React, { useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Button,
  Modal,
  Form,
  InputNumber,
  Select,
  Table,
  Alert,
  Divider,
  message,
  Grid,
} from 'antd';
import {
  DollarOutlined,
  LockOutlined,
  PlusOutlined,
  CreditCardOutlined,
  BankOutlined,
  MobileOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

export default function Wallet() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [receipt] = useState('INV-100234');
  const [transactionData, setTransactionData] = useState([
    {
      key: '1',
      date: '07/07/2025',
      amount: '$10.00',
      method: 'Mobile Money',
      status: 'Pending',
      receipt: 'INV-100234',
    },
    {
      key: '2',
      date: '06/07/2025',
      amount: '$20.00',
      method: 'Visa Card',
      status: 'Confirmed',
      receipt: 'INV-100231',
    },
  ]);

  const [totalBalance, setTotalBalance] = useState(0);
  const screens = useBreakpoint();

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleProceed = () => {
    form.validateFields().then((values) => {
      const newTransaction = {
        key: Date.now().toString(),
        date: new Date().toLocaleDateString('en-GB'),
        amount: `$${values.amount.toFixed(2)}`,
        method:
          values.method === 'credit'
            ? 'Visa Card'
            : values.method === 'mobile'
            ? 'Mobile Money'
            : 'Bank Deposit',
        status: 'Pending',
        receipt: receipt,
      };
      setTransactionData([newTransaction, ...transactionData]);
      setTotalBalance((prev) => prev + values.amount);
      setIsModalVisible(false);
      message.success('Funds added successfully!');
      form.resetFields();
    });
  };

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Receipt No.', dataIndex: 'receipt', key: 'receipt' },
  ];

  return (
    <Layout style={{ padding: '16px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card bordered={false} style={{ background: '#fff', marginBottom: 24 }}>
        <Title level={screens.xs ? 4 : 3} style={{ marginBottom: 0 }}>💼 Wallet Dashboard</Title>
        <Text type="secondary">Manage your funds and transactions with ease.</Text>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card bordered hoverable style={{ backgroundColor: '#fafafa' }}>
            <Title level={5}><DollarOutlined /> Total Balance</Title>
            <Title level={3} style={{ margin: '12px 0' }}>${totalBalance.toFixed(2)}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card bordered hoverable style={{ backgroundColor: '#fafafa' }}>
            <Title level={5}><LockOutlined /> Escrow Balance</Title>
            <Title level={3} style={{ margin: '12px 0' }}>$13.00</Title>
            <Text type="secondary">Funds in escrow are held until delivery is confirmed.</Text>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card bordered style={{ backgroundColor: '#f6ffed', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Button icon={<PlusOutlined />} type="primary" size="large" onClick={showModal} block={screens.xs}>
              Add Funds
            </Button>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card title="📋 Transaction History" bordered style={{ marginBottom: 24 }}>
        <Table
          columns={columns}
          dataSource={transactionData}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
          bordered
        />
      </Card>

      <Card bordered style={{ backgroundColor: '#fffbe6' }}>
        <Alert
          message="Withdrawals are not available. All funds are locked for platform use only."
          type="warning"
          showIcon
        />
        <Button type="default" disabled block style={{ marginTop: 16 }}>
          Withdraw Funds
        </Button>
      </Card>

      <Modal
        title={<span><PlusOutlined /> Add Funds</span>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={screens.xs ? '90%' : 600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="amount" label="Amount to Add" rules={[{ required: true }]}> 
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="Enter amount (e.g. $10.00)"
            />
          </Form.Item>

          <Form.Item name="method" label="Choose Payment Method" rules={[{ required: true }]}> 
            <Select placeholder="Select method">
              <Option value="credit"><CreditCardOutlined /> Credit Card / Visa / Debit</Option>
              <Option value="mobile"><MobileOutlined /> Mobile Money</Option>
              <Option value="bank"><BankOutlined /> Bank Deposit</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Text>Generated Receipt Number: <Text code>{receipt}</Text></Text>
          </Form.Item>

          <Form.Item>
            <Text type="secondary">
              Use this receipt number when sending payment via Mobile Money or Bank Deposit. Funds will be added after confirmation.
            </Text>
          </Form.Item>

          <Form.Item>
            <Button type="primary" block onClick={handleProceed}>Proceed</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}





// This code defines a Wallet component that allows users to manage their wallet, add funds, and view transaction history.

// Next.js Dynamic Wallet System Setup (LibWana)

// Folder Structure (Simplified):
// ├── pages
// │   ├── wallet.js                     → Frontend UI for wallet
// │   └── api
// │       ├── wallet.js                → GET wallet & escrow balance
// │       ├── transactions.js         → GET user transactions
// │       └── deposit
// │           ├── initiate.js         → POST to initiate deposit
// │           └── verify.js           → POST to verify deposit
// ├── lib
// │   ├── db.js                       → Database connection (MongoDB or PostgreSQL)
// │   └── auth.js                     → JWT or NextAuth middleware
// ├── models
// │   ├── User.js
// │   └── Transaction.js


// Example API: /pages/api/deposit/initiate.js
// import { getSession } from 'next-auth/react';
// import { v4 as uuidv4 } from 'uuid';
// import db from '@/lib/db';
// import Transaction from '@/models/Transaction';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
//   const session = await getSession({ req });
//   if (!session) return res.status(401).json({ message: 'Unauthorized' });

//   const { amount, method } = req.body;
//   if (!amount || !method) return res.status(400).json({ message: 'Invalid input' });

//   const receiptNumber = 'INV-' + Math.floor(100000 + Math.random() * 900000);

//   const transaction = await Transaction.create({
//     userId: session.user.id,
//     amount,
//     method,
//     status: 'Pending',
//     type: 'Deposit',
//     receiptNumber,
//     createdAt: new Date()
//   });

//   res.status(200).json({ receiptNumber });
// }


// // Example Frontend: /pages/wallet.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSession } from 'next-auth/react';

// export default function WalletPage() {
//   const { data: session } = useSession();
//   const [wallet, setWallet] = useState({ balance: 0, escrow: 0 });
//   const [transactions, setTransactions] = useState([]);
//   const [amount, setAmount] = useState('');
//   const [method, setMethod] = useState('');
//   const [receipt, setReceipt] = useState('');

//   useEffect(() => {
//     async function fetchData() {
//       const res = await axios.get('/api/wallet');
//       setWallet(res.data);

//       const tx = await axios.get('/api/transactions');
//       setTransactions(tx.data);
//     }
//     fetchData();
//   }, []);

//   const handleAddFunds = async () => {
//     const res = await axios.post('/api/deposit/initiate', { amount: Number(amount), method });
//     setReceipt(res.data.receiptNumber);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-semibold mb-4">Wallet Dashboard</h1>
//       <div className="bg-white p-4 shadow rounded mb-6">
//         <p className="text-lg">Wallet Balance: ${wallet.balance.toFixed(2)}</p>
//         <p className="text-lg">Escrow Balance: ${wallet.escrow.toFixed(2)}</p>
//         <small className="text-gray-500">Funds in escrow are held until delivery is confirmed.</small>
//       </div>

//       <div className="bg-white p-4 shadow rounded mb-6">
//         <h2 className="text-xl font-medium mb-2">Add Funds</h2>
//         <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="border p-2 rounded w-full mb-2" />
//         <select onChange={e => setMethod(e.target.value)} className="border p-2 rounded w-full mb-2">
//           <option value="">Select Method</option>
//           <option value="credit">Credit Card / Visa / Debit</option>
//           <option value="mobile">Mobile Money</option>
//           <option value="bank">Bank Deposit</option>
//         </select>
//         <button onClick={handleAddFunds} className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
//         {receipt && (
//           <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded">
//             <p>Generated Receipt: <strong>{receipt}</strong></p>
//             <p className="text-sm">Use this receipt number when sending payment via Mobile Money or Bank Deposit. Funds will be added after confirmation.</p>
//           </div>
//         )}
//       </div>

//       <div className="bg-white p-4 shadow rounded">
//         <h2 className="text-xl font-medium mb-3">Transaction History</h2>
//         <table className="w-full text-left">
//           <thead>
//             <tr>
//               <th className="py-2">Date</th>
//               <th>Amount</th>
//               <th>Method</th>
//               <th>Status</th>
//               <th>Receipt No.</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.map((t, idx) => (
//               <tr key={idx} className="border-t">
//                 <td className="py-2">{new Date(t.createdAt).toLocaleDateString()}</td>
//                 <td>${t.amount.toFixed(2)}</td>
//                 <td>{t.method}</td>
//                 <td>{t.status}</td>
//                 <td>{t.receiptNumber}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="mt-6 text-center">
//         <button disabled className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed">
//           Withdraw Funds
//         </button>
//         <p className="text-sm text-gray-500 mt-2">Withdrawals are not available. All funds are locked for platform use only.</p>
//       </div>
//     </div>
//   );
// }
