import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Invoice, UserRole } from '../types';
import { Download, Eye, Filter, MoreHorizontal, Printer, Search, Trash2, FileText, CheckCircle, Plus, Layers, Settings } from 'lucide-react';
import { INITIAL_INVOICES } from '../data';
import { Modal } from './ui/Modal';

interface FeesInvoiceProps {
    userRole?: UserRole;
}

// --- Status Badge Component ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Overdue: 'bg-red-100 text-red-700 border-red-200',
    Unpaid: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.Unpaid}`}>
      {status}
    </span>
  );
};

// --- Mock Data for Fee Master ---
interface FeeType {
    id: string;
    name: string;
    amount: number;
    frequency: 'Monthly' | 'One-Time' | 'Annual';
    group: string;
}

const INITIAL_FEE_TYPES: FeeType[] = [
    { id: '1', name: 'Tuition Fee - Primary', amount: 450, frequency: 'Monthly', group: 'Academics' },
    { id: '2', name: 'Tuition Fee - Secondary', amount: 550, frequency: 'Monthly', group: 'Academics' },
    { id: '3', name: 'Lab Fee', amount: 100, frequency: 'Annual', group: 'Facilities' },
    { id: '4', name: 'Transport Zone A', amount: 120, frequency: 'Monthly', group: 'Transport' },
    { id: '5', name: 'Admission Fee', amount: 2000, frequency: 'One-Time', group: 'Admission' },
];

export const FeesInvoice: React.FC<FeesInvoiceProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'structure'>('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>(INITIAL_FEE_TYPES);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Modal States
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showFeeTypeModal, setShowFeeTypeModal] = useState(false);
  const [newFeeType, setNewFeeType] = useState({ name: '', amount: '', frequency: 'Monthly', group: '' });

  // Only Admins can create or delete
  const canEdit = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
        setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const handleAddFeeType = () => {
      if(!newFeeType.name || !newFeeType.amount) return;
      setFeeTypes([...feeTypes, { 
          id: Date.now().toString(), 
          name: newFeeType.name, 
          amount: Number(newFeeType.amount), 
          frequency: newFeeType.frequency as any,
          group: newFeeType.group || 'General' 
      }]);
      setShowFeeTypeModal(false);
      setNewFeeType({ name: '', amount: '', frequency: 'Monthly', group: '' });
  };

  const deleteFeeType = (id: string) => {
      if(window.confirm("Delete this fee type?")) {
          setFeeTypes(feeTypes.filter(f => f.id !== id));
      }
  };

  const handleMenuAction = (e: React.MouseEvent, action: string, id: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (action === 'delete') handleDelete(id);
    else if (action === 'download') alert(`Downloading invoice ${id}...`);
    else if (action === 'view') alert(`Viewing details for invoice ${id}...`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fees & Invoices</h1>
          <p className="text-slate-500">Manage student fee collections, invoices, and fee structures.</p>
        </div>
        {canEdit && activeTab === 'invoices' && (
            <button onClick={() => setShowInvoiceModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2">
                <Plus size={16} /> Create Invoice
            </button>
        )}
        {canEdit && activeTab === 'structure' && (
            <button onClick={() => setShowFeeTypeModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2">
                <Plus size={16} /> Add Fee Type
            </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('invoices')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'invoices' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
              <FileText size={16} /> Invoices & Transactions
          </button>
          {canEdit && (
            <button 
                onClick={() => setActiveTab('structure')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'structure' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <Layers size={16} /> Fee Master & Structure
            </button>
          )}
      </div>

      {activeTab === 'invoices' ? (
          <Card className="p-0 overflow-hidden">
            {/* Table Toolbar */}
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                type="text" 
                placeholder="Search invoice..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none text-sm"
                />
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                <Filter size={16} /> Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                <Download size={16} /> Export
                </button>
            </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="p-4"><input type="checkbox" className="rounded border-slate-300" /></th>
                    <th className="p-4">Invoice No</th>
                    <th className="p-4">Student</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="text-sm">
                {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group relative">
                    <td className="p-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                    <td className="p-4 font-medium text-indigo-600">{invoice.invoiceNo}</td>
                    <td className="p-4">
                        <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            {invoice.studentName.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-slate-800">{invoice.studentName}</p>
                            <p className="text-xs text-slate-400">{invoice.studentId}</p>
                        </div>
                        </div>
                    </td>
                    <td className="p-4 text-slate-600">{invoice.type}</td>
                    <td className="p-4 font-semibold text-slate-800">${invoice.amount.toFixed(2)}</td>
                    <td className="p-4 text-slate-500">{invoice.date}</td>
                    <td className="p-4"><StatusBadge status={invoice.status} /></td>
                    <td className="p-4">
                        <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded"><Eye size={16} /></button>
                        <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded"><Printer size={16} /></button>
                        
                        {/* More Menu */}
                        <div className="relative">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === invoice.id ? null : invoice.id); }}
                                className={`p-1.5 rounded transition-colors ${activeMenuId === invoice.id ? 'bg-slate-100 text-slate-800' : 'hover:bg-slate-100 text-slate-600'}`}
                            >
                                <MoreHorizontal size={16} />
                            </button>

                            {activeMenuId === invoice.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                    <div className="py-1">
                                        <button onClick={(e) => handleMenuAction(e, 'view', invoice.id)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                            <FileText size={16} className="text-slate-400" /> View Details
                                        </button>
                                        <button onClick={(e) => handleMenuAction(e, 'download', invoice.id)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                            <Download size={16} className="text-slate-400" /> Download PDF
                                        </button>
                                        {canEdit && (
                                            <>
                                                <div className="h-px bg-slate-100 my-1"></div>
                                                <button onClick={(e) => handleMenuAction(e, 'delete', invoice.id)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                    <Trash2 size={16} /> Delete Invoice
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
            <p>Showing 1 to {invoices.length} of {invoices.length} entries</p>
            <div className="flex gap-1">
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Prev</button>
                <button className="px-3 py-1 bg-indigo-600 text-white rounded">1</button>
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
            </div>
            </div>
          </Card>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                  <Card className="p-0 overflow-hidden">
                      <div className="p-4 border-b border-slate-100 bg-slate-50">
                          <h3 className="font-bold text-slate-700">Fee Structure Master</h3>
                      </div>
                      <table className="w-full text-left">
                          <thead className="text-xs uppercase text-slate-500 bg-white border-b border-slate-100">
                              <tr>
                                  <th className="p-4">Group</th>
                                  <th className="p-4">Fee Type Name</th>
                                  <th className="p-4">Frequency</th>
                                  <th className="p-4">Amount</th>
                                  <th className="p-4 text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-slate-100">
                              {feeTypes.map(ft => (
                                  <tr key={ft.id} className="hover:bg-slate-50">
                                      <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600 font-bold border border-slate-200">{ft.group}</span></td>
                                      <td className="p-4 font-medium text-slate-800">{ft.name}</td>
                                      <td className="p-4 text-slate-600">{ft.frequency}</td>
                                      <td className="p-4 font-bold text-slate-700">${ft.amount.toFixed(2)}</td>
                                      <td className="p-4 text-right">
                                          <button onClick={() => deleteFeeType(ft.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                              <Trash2 size={16} />
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </Card>
              </div>
              <div>
                  <Card className="bg-indigo-50 border-indigo-100">
                      <h3 className="font-bold text-indigo-900 mb-2">Fee Configuration</h3>
                      <p className="text-sm text-indigo-700 mb-4">Define fee groups and types here. These will be used when generating student invoices.</p>
                      <ul className="text-sm space-y-2 text-indigo-800">
                          <li className="flex items-center gap-2"><CheckCircle size={14}/> Create Fee Groups (Academics, Transport)</li>
                          <li className="flex items-center gap-2"><CheckCircle size={14}/> Set Default Amounts</li>
                          <li className="flex items-center gap-2"><CheckCircle size={14}/> Define Payment Frequency</li>
                      </ul>
                  </Card>
              </div>
          </div>
      )}

      {/* Fee Type Modal */}
      <Modal title="Add Fee Type" isOpen={showFeeTypeModal} onClose={() => setShowFeeTypeModal(false)}
        footer={
            <>
                <button onClick={() => setShowFeeTypeModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={handleAddFeeType} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
            </>
        }
      >
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fee Name</label>
                  <input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100" 
                    value={newFeeType.name} onChange={e => setNewFeeType({...newFeeType, name: e.target.value})} placeholder="e.g. Annual Sports Fee" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                      <input type="number" className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100" 
                        value={newFeeType.amount} onChange={e => setNewFeeType({...newFeeType, amount: e.target.value})} placeholder="0.00" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                      <select className="w-full p-2 border border-slate-200 rounded-lg outline-none bg-white"
                        value={newFeeType.frequency} onChange={e => setNewFeeType({...newFeeType, frequency: e.target.value})}>
                          <option value="Monthly">Monthly</option>
                          <option value="One-Time">One-Time</option>
                          <option value="Annual">Annual</option>
                      </select>
                  </div>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Group</label>
                  <input type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100" 
                    value={newFeeType.group} onChange={e => setNewFeeType({...newFeeType, group: e.target.value})} placeholder="e.g. Academics" />
              </div>
          </div>
      </Modal>
    </div>
  );
};