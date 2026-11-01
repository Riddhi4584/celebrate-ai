import React, { useState, useRef } from 'react';
import {
  Users,
  PlusCircle,
  Search,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
  Trash2,
  Edit2,
  X,
  FileSpreadsheet,
  ShieldCheck,
  UserCheck,
  Heart,
} from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { DietaryPreference, Guest, GuestGroup, RsvpStatus } from '../types';

const RSVP_BADGES: Record<RsvpStatus, { label: string; color: string; border: string }> = {
  attending: { label: 'Attending', color: 'bg-emerald-50 text-emerald-800', border: 'border-emerald-300' },
  declined: { label: 'Declined', color: 'bg-rose-50 text-rose-800', border: 'border-rose-300' },
  pending: { label: 'Pending RSVP', color: 'bg-amber-50 text-amber-800', border: 'border-amber-300' },
  tentative: { label: 'Tentative', color: 'bg-purple-50 text-purple-800', border: 'border-purple-300' },
};

export const GuestsPage: React.FC = () => {
  const { activeEvent, addGuest, updateGuest, deleteGuest, importGuests } = useEventContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterRsvp, setFilterRsvp] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const [gName, setGName] = useState('');
  const [gGroup, setGGroup] = useState<GuestGroup>('family');
  const [gRsvp, setGRsvp] = useState<RsvpStatus>('attending');
  const [gDiet, setGDiet] = useState<DietaryPreference>('vegetarian');
  const [gPlusOnes, setGPlusOnes] = useState(0);
  const [gAccess, setGAccess] = useState('');
  const [gNotes, setGNotes] = useState('');

  if (!activeEvent) {
    return <div className="p-8 text-center text-stone-500">Please select an event.</div>;
  }

  const guests = activeEvent.guests || [];

  // Metrics
  const attendingCount = guests
    .filter((g) => g.rsvpStatus === 'attending')
    .reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);
  const pendingCount = guests.filter((g) => g.rsvpStatus === 'pending').length;
  const declinedCount = guests.filter((g) => g.rsvpStatus === 'declined').length;
  const tentativeCount = guests.filter((g) => g.rsvpStatus === 'tentative').length;

  // Dietary counts for catering calculation
  const dietaryCounts = guests.reduce((acc, g) => {
    if (g.rsvpStatus === 'attending') {
      const diet = g.dietaryPreference || 'vegetarian';
      acc[diet] = (acc[diet] || 0) + 1 + (g.plusOnes || 0);
    }
    return acc;
  }, {} as Record<string, number>);

  // Filter
  const filteredGuests = guests.filter((g) => {
    if (filterGroup !== 'all' && g.group !== filterGroup) return false;
    if (filterRsvp !== 'all' && g.rsvpStatus !== filterRsvp) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        (g.notes && g.notes.toLowerCase().includes(q)) ||
        (g.accessibilityNeeds && g.accessibilityNeeds.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingGuest(null);
    setGName('');
    setGGroup('family');
    setGRsvp('attending');
    setGDiet('vegetarian');
    setGPlusOnes(0);
    setGAccess('');
    setGNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setGName(guest.name);
    setGGroup(guest.group);
    setGRsvp(guest.rsvpStatus);
    setGDiet(guest.dietaryPreference);
    setGPlusOnes(guest.plusOnes || 0);
    setGAccess(guest.accessibilityNeeds || '');
    setGNotes(guest.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gName.trim()) return;

    if (editingGuest) {
      updateGuest({
        ...editingGuest,
        name: gName,
        group: gGroup,
        rsvpStatus: gRsvp,
        dietaryPreference: gDiet,
        plusOnes: Number(gPlusOnes),
        accessibilityNeeds: gAccess,
        notes: gNotes,
      });
    } else {
      addGuest({
        name: gName,
        group: gGroup,
        rsvpStatus: gRsvp,
        dietaryPreference: gDiet,
        plusOnes: Number(gPlusOnes),
        accessibilityNeeds: gAccess,
        notes: gNotes,
      });
    }

    setIsModalOpen(false);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Name', 'Group', 'RSVP Status', 'Dietary Preference', 'Plus Ones', 'Accessibility Needs', 'Notes'];
    const rows = guests.map((g) => [
      `"${g.name}"`,
      `"${g.group}"`,
      `"${g.rsvpStatus}"`,
      `"${g.dietaryPreference}"`,
      g.plusOnes,
      `"${g.accessibilityNeeds || ''}"`,
      `"${g.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeEvent.title.replace(/\s+/g, '_')}_Guest_List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length <= 1) return;

        const imported: Omit<Guest, 'id'>[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
          if (cols[0]) {
            imported.push({
              name: cols[0],
              group: (cols[1] as GuestGroup) || 'family',
              rsvpStatus: (cols[2] as RsvpStatus) || 'pending',
              dietaryPreference: (cols[3] as DietaryPreference) || 'vegetarian',
              plusOnes: Number(cols[4]) || 0,
              accessibilityNeeds: cols[5] || '',
              notes: cols[6] || '',
            });
          }
        }

        if (imported.length > 0) {
          importGuests(imported);
        }
      } catch (err) {
        console.error('Failed parsing CSV', err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E05368]">
            <Users className="w-4 h-4" />
            Guest List, Seating & Dietary Roster
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1236]">
            Guests & RSVPs: {activeEvent.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {attendingCount} confirmed heads (Capacity target: {activeEvent.guestCount} guests).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleImportCSV}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 shadow-2xs transition-all"
            title="Import from CSV file"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 shadow-2xs transition-all"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#E05368] to-[#D43D56] hover:brightness-105 shadow-md shadow-[#E05368]/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Add Guest
          </button>
        </div>
      </div>

      {/* Guest RSVP KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Attending (Total Heads)</span>
          <span className="text-2xl font-bold text-emerald-700 block">{attendingCount}</span>
          <span className="text-xs text-stone-400">incl. plus-ones</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pending RSVP</span>
          <span className="text-2xl font-bold text-amber-700 block">{pendingCount}</span>
          <span className="text-xs text-stone-400">Awaiting confirmation</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Tentative</span>
          <span className="text-2xl font-bold text-purple-700 block">{tentativeCount}</span>
          <span className="text-xs text-stone-400">May attend</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Declined</span>
          <span className="text-2xl font-bold text-rose-700 block">{declinedCount}</span>
          <span className="text-xs text-stone-400">Regretfully absent</span>
        </div>
      </div>

      {/* Dietary Roster Bar (Crucial for Catering Calculations) */}
      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
          <span className="font-bold">Confirmed Dietary Breakdown for Catering:</span>
          <span className="text-stone-400 text-[11px]">Calculated for all attending guests & plus-ones</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(dietaryCounts).length === 0 ? (
            <span className="text-stone-400 italic text-xs">No confirmed RSVPs yet.</span>
          ) : (
            Object.entries(dietaryCounts).map(([diet, count]) => (
              <span
                key={diet}
                className="px-3 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 font-medium capitalize"
              >
                {diet.replace('_', ' ')}: <strong className="text-[#2D1236]">{count} meals</strong>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Controls: Search, Group & RSVP Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guest name or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-xs border border-stone-200 focus:border-[#E05368] outline-none w-60"
            />
          </div>

          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-stone-200 bg-[#FAF8F5] text-stone-700 outline-none"
          >
            <option value="all">All Groups</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="vip">VIP Guests</option>
            <option value="colleagues">Colleagues</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filterRsvp}
            onChange={(e) => setFilterRsvp(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-stone-200 bg-[#FAF8F5] text-stone-700 outline-none"
          >
            <option value="all">All RSVP Statuses</option>
            <option value="attending">Attending</option>
            <option value="pending">Pending</option>
            <option value="tentative">Tentative</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Private Client-Side Data</span>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs overflow-hidden">
        {filteredGuests.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs italic">
            No guests found matching your criteria. Click "+ Add Guest" or "Import CSV" to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-stone-400 uppercase font-mono border-b border-stone-200">
                  <th className="py-3">Guest Name</th>
                  <th className="py-3">Group</th>
                  <th className="py-3">RSVP Status</th>
                  <th className="py-3">Plus-Ones</th>
                  <th className="py-3">Dietary</th>
                  <th className="py-3">Accessibility / Notes</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredGuests.map((guest) => {
                  const rBadge = RSVP_BADGES[guest.rsvpStatus] || RSVP_BADGES.pending;

                  return (
                    <tr key={guest.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 font-semibold text-[#2D1236]">
                        {guest.name}
                      </td>

                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 capitalize">
                          {guest.group}
                        </span>
                      </td>

                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${rBadge.color} ${rBadge.border}`}>
                          {rBadge.label}
                        </span>
                      </td>

                      <td className="py-3 text-stone-700 font-medium">
                        {guest.plusOnes > 0 ? `+${guest.plusOnes} guest` : 'None'}
                      </td>

                      <td className="py-3 capitalize text-stone-600">
                        {guest.dietaryPreference.replace('_', ' ')}
                      </td>

                      <td className="py-3 text-stone-500 max-w-xs truncate">
                        {guest.accessibilityNeeds ? (
                          <span className="text-[#E05368] font-medium mr-1">♿ {guest.accessibilityNeeds}</span>
                        ) : null}
                        {guest.notes || '—'}
                      </td>

                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(guest)}
                          className="text-stone-400 hover:text-[#2D1236] p-1"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          onClick={() => deleteGuest(guest.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-[#2D1236]">
                {editingGuest ? 'Edit Guest' : 'Add Guest to List'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-[#2D1236]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh & Priya Mehta"
                  value={gName}
                  onChange={(e) => setGName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-[#E05368]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Group</label>
                  <select
                    value={gGroup}
                    onChange={(e) => setGGroup(e.target.value as GuestGroup)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none bg-white"
                  >
                    <option value="family">Family</option>
                    <option value="friends">Friends</option>
                    <option value="vip">VIP Guest</option>
                    <option value="colleagues">Colleagues</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">RSVP Status</label>
                  <select
                    value={gRsvp}
                    onChange={(e) => setGRsvp(e.target.value as RsvpStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none bg-white"
                  >
                    <option value="attending">Attending</option>
                    <option value="pending">Pending</option>
                    <option value="tentative">Tentative</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Dietary</label>
                  <select
                    value={gDiet}
                    onChange={(e) => setGDiet(e.target.value as DietaryPreference)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none bg-white"
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non_vegetarian">Non-Vegetarian</option>
                    <option value="jain">Jain (No Root Veg)</option>
                    <option value="vegan">Vegan</option>
                    <option value="halal">Halal</option>
                    <option value="gluten_free">Gluten-Free</option>
                    <option value="no_restriction">No Restrictions</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Plus-Ones</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={gPlusOnes}
                    onChange={(e) => setGPlusOnes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Accessibility Needs</label>
                <input
                  type="text"
                  placeholder="e.g. Ground floor room, wheelchair ramp"
                  value={gAccess}
                  onChange={(e) => setGAccess(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Notes / Table Assignment</label>
                <textarea
                  placeholder="e.g. Table 4 with college friends"
                  value={gNotes}
                  onChange={(e) => setGNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs outline-none resize-none h-16"
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
                  {editingGuest ? 'Save Changes' : 'Add Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
