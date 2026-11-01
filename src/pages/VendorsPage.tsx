import React, { useState } from 'react';
import {
  Store,
  PlusCircle,
  Search,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  DollarSign,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { Vendor, VendorStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

const STATUS_CONFIG: Record<VendorStatus, { label: string; color: string; border: string }> = {
  researching: { label: 'Researching', color: 'bg-stone-100 text-stone-700', border: 'border-stone-200' },
  contacted: { label: 'Contacted', color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
  quote_received: { label: 'Quote Received', color: 'bg-purple-50 text-purple-700', border: 'border-purple-200' },
  negotiating: { label: 'Negotiating', color: 'bg-amber-50 text-amber-700', border: 'border-amber-200' },
  booked: { label: 'Booked & Confirmed', color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-300' },
  cancelled: { label: 'Cancelled', color: 'bg-rose-50 text-rose-700', border: 'border-rose-200' },
};

export const VendorsPage: React.FC = () => {
  const { activeEvent, addVendor, updateVendor, deleteVendor } = useEventContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const [vName, setVName] = useState('');
  const [vCategory, setVCategory] = useState('Venue');
  const [vContactPerson, setVContactPerson] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vEstimatedCost, setVEstimatedCost] = useState(0);
  const [vQuotedCost, setVQuotedCost] = useState(0);
  const [vPaidAmount, setVPaidAmount] = useState(0);
  const [vStatus, setVStatus] = useState<VendorStatus>('negotiating');
  const [vPaymentDeadline, setVPaymentDeadline] = useState('');
  const [vNotes, setVNotes] = useState('');

  if (!activeEvent) {
    return <div className="p-8 text-center text-stone-500">Please select an event.</div>;
  }

  const vendors = activeEvent.vendors;
  const bookedVendors = vendors.filter((v) => v.status === 'booked');
  const totalBookedCommitment = bookedVendors.reduce((sum, v) => sum + (v.quotedCost || v.estimatedCost || 0), 0);
  const totalPaidToVendors = vendors.reduce((sum, v) => sum + (v.paidAmount || 0), 0);

  // Filter vendors
  const filteredVendors = vendors.filter((v) => {
    if (filterCategory !== 'all' && v.category !== filterCategory) return false;
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        (v.contactPerson && v.contactPerson.toLowerCase().includes(q)) ||
        (v.notes && v.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const uniqueCategories = Array.from(new Set(vendors.map((v) => v.category)));

  const handleOpenAdd = () => {
    setEditingVendor(null);
    setVName('');
    setVCategory('Venue');
    setVContactPerson('');
    setVPhone('');
    setVEmail('');
    setVEstimatedCost(25000);
    setVQuotedCost(25000);
    setVPaidAmount(0);
    setVStatus('contacted');
    setVPaymentDeadline(activeEvent.date);
    setVNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setVName(vendor.name);
    setVCategory(vendor.category);
    setVContactPerson(vendor.contactPerson || '');
    setVPhone(vendor.phone || '');
    setVEmail(vendor.email || '');
    setVEstimatedCost(vendor.estimatedCost);
    setVQuotedCost(vendor.quotedCost);
    setVPaidAmount(vendor.paidAmount);
    setVStatus(vendor.status);
    setVPaymentDeadline(vendor.paymentDeadline || '');
    setVNotes(vendor.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName.trim()) return;

    if (editingVendor) {
      updateVendor({
        ...editingVendor,
        name: vName,
        category: vCategory,
        contactPerson: vContactPerson,
        phone: vPhone,
        email: vEmail,
        estimatedCost: Number(vEstimatedCost),
        quotedCost: Number(vQuotedCost),
        paidAmount: Number(vPaidAmount),
        status: vStatus,
        paymentDeadline: vPaymentDeadline,
        notes: vNotes,
      });
    } else {
      addVendor({
        name: vName,
        category: vCategory,
        contactPerson: vContactPerson,
        phone: vPhone,
        email: vEmail,
        estimatedCost: Number(vEstimatedCost),
        quotedCost: Number(vQuotedCost),
        paidAmount: Number(vPaidAmount),
        status: vStatus,
        paymentDeadline: vPaymentDeadline,
        notes: vNotes,
        isAiSuggested: false,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E05368]">
            <Store className="w-4 h-4" />
            Vendor Coordination & Partner Tracking
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">
            Vendors & Contracts: {activeEvent.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {bookedVendors.length} of {vendors.length} vendors booked & confirmed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:brightness-105 shadow-md shadow-[#E05368]/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Vendor
          </button>
        </div>
      </div>

      {/* Vendor Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Contracted</span>
          <span className="text-2xl font-bold text-[#2D1236] block">
            {formatCurrency(totalBookedCommitment, activeEvent.currency)}
          </span>
          <span className="text-xs text-stone-500">{bookedVendors.length} confirmed vendors</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Disbursed / Paid</span>
          <span className="text-2xl font-bold text-emerald-700 block">
            {formatCurrency(totalPaidToVendors, activeEvent.currency)}
          </span>
          <span className="text-xs text-stone-500">Advances cleared</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pending Balances</span>
          <span className="text-2xl font-bold text-amber-700 block">
            {formatCurrency(Math.max(0, totalBookedCommitment - totalPaidToVendors), activeEvent.currency)}
          </span>
          <span className="text-xs text-stone-500">Due upon service completion</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendor name or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-xs border border-stone-200 focus:border-[#E05368] outline-none w-64"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-stone-200 bg-[#FAF8F5] text-stone-700 outline-none"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-stone-200 bg-[#FAF8F5] text-stone-700 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="booked">Booked</option>
            <option value="negotiating">Negotiating</option>
            <option value="quote_received">Quote Received</option>
            <option value="contacted">Contacted</option>
            <option value="researching">Researching</option>
          </select>
        </div>

        <span className="text-xs text-stone-400 font-mono">
          Showing {filteredVendors.length} of {vendors.length} vendors
        </span>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVendors.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-stone-400 text-xs italic bg-white rounded-3xl border border-stone-200">
            No vendors found matching your filter criteria.
          </div>
        ) : (
          filteredVendors.map((vendor) => {
            const st = STATUS_CONFIG[vendor.status] || STATUS_CONFIG.researching;

            return (
              <div
                key={vendor.id}
                className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-mono">
                          {vendor.category}
                        </span>
                        {vendor.isAiSuggested && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF0F2] text-[#E05368] border border-[#E05368]/20 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> AI Recommendation
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#2D1236] leading-snug mt-0.5">
                        {vendor.name}
                      </h3>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${st.color} ${st.border}`}>
                      {st.label}
                    </span>
                  </div>

                  {/* Financial Mini Bar */}
                  <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200/60 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 font-medium block">Estimated</span>
                      <strong className="text-stone-700">{formatCurrency(vendor.estimatedCost, activeEvent.currency)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 font-medium block">Quoted</span>
                      <strong className="text-[#2D1236]">{formatCurrency(vendor.quotedCost, activeEvent.currency)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 font-medium block">Paid</span>
                      <strong className="text-emerald-700">{formatCurrency(vendor.paidAmount, activeEvent.currency)}</strong>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 text-xs text-stone-600">
                    {vendor.contactPerson && (
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400 font-medium">Rep:</span>
                        <strong className="text-stone-800">{vendor.contactPerson}</strong>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                    {vendor.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{vendor.email}</span>
                      </div>
                    )}
                    {vendor.paymentDeadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Deadline: {formatDate(vendor.paymentDeadline)}</span>
                      </div>
                    )}
                  </div>

                  {vendor.notes && (
                    <p className="text-xs text-stone-500 italic bg-stone-50 p-2.5 rounded-xl border border-stone-200/50">
                      "{vendor.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(vendor)}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit Details
                    </button>
                    <button
                      onClick={() => deleteVendor(vendor.id)}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {vendor.status !== 'booked' ? (
                    <button
                      onClick={() => updateVendor({ ...vendor, status: 'booked' })}
                      className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Mark as Booked ✓
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#2D1236]">
                {editingVendor ? 'Edit Vendor Record' : 'Add New Vendor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-[#2D1236]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Vendor / Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Rajputana Catering or DJ Ray"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-[#E05368]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="Venue, Catering, Florals..."
                    value={vCategory}
                    onChange={(e) => setVCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Booking Status</label>
                  <select
                    value={vStatus}
                    onChange={(e) => setVStatus(e.target.value as VendorStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none bg-white"
                  >
                    <option value="researching">Researching</option>
                    <option value="contacted">Contacted</option>
                    <option value="quote_received">Quote Received</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="booked">Booked</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Estimated</label>
                  <input
                    type="number"
                    min="0"
                    value={vEstimatedCost}
                    onChange={(e) => setVEstimatedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Quoted</label>
                  <input
                    type="number"
                    min="0"
                    value={vQuotedCost}
                    onChange={(e) => setVQuotedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Paid Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={vPaidAmount}
                    onChange={(e) => setVPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none text-emerald-700 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Vikramaditya Rathore"
                    value={vContactPerson}
                    onChange={(e) => setVContactPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98290 11223"
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Email</label>
                  <input
                    type="email"
                    placeholder="events@partner.com"
                    value={vEmail}
                    onChange={(e) => setVEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Payment Due Date</label>
                  <input
                    type="date"
                    value={vPaymentDeadline}
                    onChange={(e) => setVPaymentDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Scope & Notes</label>
                <textarea
                  placeholder="Included deliverables, cancellation clause, arrival time..."
                  value={vNotes}
                  onChange={(e) => setVNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none resize-none h-20"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-500 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56]"
                >
                  {editingVendor ? 'Save Changes' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
