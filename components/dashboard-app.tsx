'use client';

import { useMemo, useState } from 'react';
import type { Customer, DashboardSnapshot, Reservation, ReservationInput, ReservationStatus, TableZone } from '@/lib/types';
import { reservationStatuses } from '@/lib/store';

const zones: TableZone[] = ['Patio', 'Window', 'Main Hall', 'Chef Counter'];
const sources: ReservationInput['source'][] = ['phone', 'website', 'instagram', 'walk-in'];

interface DashboardAppProps {
  initialData: DashboardSnapshot;
}

interface ReservationFormState {
  customerId: string;
  guestName: string;
  partySize: number;
  date: string;
  time: string;
  zone: TableZone;
  tableLabel: string;
  status: ReservationStatus;
  occasion: string;
  notes: string;
  source: ReservationInput['source'];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(amount);
}

function calculateMetrics(reservations: Reservation[], customers: Customer[]) {
  return {
    todaysCovers: reservations.reduce((sum, reservation) => sum + reservation.partySize, 0),
    vipArrivals: reservations.filter((reservation) => customers.find((customer) => customer.id === reservation.customerId)?.tier === 'VIP').length,
    projectedRevenue: reservations.reduce((sum, reservation) => {
      const customer = customers.find((item) => item.id === reservation.customerId);
      return sum + (customer?.orderHistory[0]?.total ?? 95);
    }, 0),
    offerReadyCount: customers.filter((customer) => customer.offers.length > 0).length,
  };
}

export function DashboardApp({ initialData }: DashboardAppProps) {
  const [snapshot, setSnapshot] = useState(initialData);
  const [selectedReservationId, setSelectedReservationId] = useState(initialData.reservations[0]?.id ?? '');
  const [selectedCustomerId, setSelectedCustomerId] = useState(initialData.customers[0]?.id ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<ReservationFormState>({
    customerId: initialData.customers[0]?.id ?? '',
    guestName: initialData.customers[0]?.name ?? '',
    partySize: 2,
    date: '2026-03-20',
    time: '18:30',
    zone: 'Main Hall',
    tableLabel: 'M2',
    status: 'confirmed',
    occasion: '',
    notes: '',
    source: 'website',
  });

  const selectedReservation = snapshot.reservations.find((reservation) => reservation.id === selectedReservationId) ?? snapshot.reservations[0];
  const selectedCustomer = snapshot.customers.find((customer) => customer.id === (selectedReservation?.customerId ?? selectedCustomerId)) ?? snapshot.customers[0];
  const metrics = useMemo(() => calculateMetrics(snapshot.reservations, snapshot.customers), [snapshot]);

  const reservationsByStatus = useMemo(() => {
    return reservationStatuses.map((status) => ({
      status,
      count: snapshot.reservations.filter((reservation) => reservation.status === status).length,
    }));
  }, [snapshot.reservations]);

  function syncSelectedCustomer(customerId: string) {
    const customer = snapshot.customers.find((item) => item.id === customerId);
    setSelectedCustomerId(customerId);
    setForm((current) => ({
      ...current,
      customerId,
      guestName: customer?.name ?? current.guestName,
    }));
  }

  async function handleCreateReservation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      const data = (await response.json()) as { reservation: Reservation };
      const reservations = [...snapshot.reservations, data.reservation].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
      setSnapshot((current) => ({ ...current, reservations, ...calculateMetrics(reservations, current.customers) }));
      setSelectedReservationId(data.reservation.id);
      setSelectedCustomerId(data.reservation.customerId);
      setForm((current) => ({ ...current, notes: '', occasion: '', tableLabel: 'M2', time: '18:30', partySize: 2, status: 'confirmed' }));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(reservationId: string, status: ReservationStatus) {
    const response = await fetch(`/api/reservations/${reservationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { reservation: Reservation };
    const reservations = snapshot.reservations.map((reservation) => reservation.id === reservationId ? data.reservation : reservation);
    setSnapshot((current) => ({ ...current, reservations }));
  }

  return (
    <main className="shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">The Digital Maître D’</p>
          <h1>Reservations-first CRM for restaurants & cafes</h1>
          <p className="hero-copy">
            Track guest preferences, order history, and personalized offers while keeping tonight&apos;s floor service organized.
          </p>
        </div>
        <div className="hero-actions">
          <span className="pill warm">Evening service</span>
          <span className="pill soft">Offer-ready guests: {metrics.offerReadyCount}</span>
        </div>
      </section>

      <section className="metrics-grid">
        <article className="metric-card">
          <span className="metric-label">Today&apos;s covers</span>
          <strong>{metrics.todaysCovers}</strong>
        </article>
        <article className="metric-card">
          <span className="metric-label">VIP arrivals</span>
          <strong>{metrics.vipArrivals}</strong>
        </article>
        <article className="metric-card">
          <span className="metric-label">Projected revenue</span>
          <strong>{formatCurrency(metrics.projectedRevenue)}</strong>
        </article>
        <article className="metric-card">
          <span className="metric-label">Personalized offers</span>
          <strong>{metrics.offerReadyCount}</strong>
        </article>
      </section>

      <section className="content-grid">
        <div className="stack">
          <article className="panel surface-low">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Reservations</p>
                <h2>Today&apos;s floorbook</h2>
              </div>
              <div className="status-row">
                {reservationsByStatus.map((entry) => (
                  <span key={entry.status} className={`status-chip status-${entry.status}`}>
                    {entry.status} · {entry.count}
                  </span>
                ))}
              </div>
            </div>

            <div className="reservation-list">
              {snapshot.reservations.map((reservation) => {
                const customer = snapshot.customers.find((item) => item.id === reservation.customerId);
                return (
                  <button
                    key={reservation.id}
                    type="button"
                    className={`reservation-card ${selectedReservation?.id === reservation.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedReservationId(reservation.id);
                      setSelectedCustomerId(reservation.customerId);
                    }}
                  >
                    <div className="reservation-topline">
                      <div>
                        <strong>{reservation.time}</strong>
                        <p>{reservation.guestName}</p>
                      </div>
                      <span className={`tier-badge tier-${customer?.tier.toLowerCase() ?? 'new'}`}>{customer?.tier ?? 'Guest'}</span>
                    </div>
                    <div className="reservation-meta">
                      <span>{reservation.partySize} covers</span>
                      <span>{reservation.zone}</span>
                      <span>Table {reservation.tableLabel}</span>
                    </div>
                    <p className="subtle">{reservation.occasion || reservation.notes || 'No special note'}</p>
                  </button>
                );
              })}
            </div>
          </article>

          <article className="panel surface-lowest">
            <div className="panel-header">
              <div>
                <p className="eyebrow">New reservation</p>
                <h2>Add to the floorbook</h2>
              </div>
              <span className="pill soft">Website + phone + walk-in</span>
            </div>

            <form className="reservation-form" onSubmit={handleCreateReservation}>
              <label>
                <span>Customer</span>
                <select
                  value={form.customerId}
                  onChange={(event) => syncSelectedCustomer(event.target.value)}
                >
                  {snapshot.customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Guest name</span>
                <input value={form.guestName} onChange={(event) => setForm((current) => ({ ...current, guestName: event.target.value }))} />
              </label>
              <label>
                <span>Party size</span>
                <input type="number" min={1} value={form.partySize} onChange={(event) => setForm((current) => ({ ...current, partySize: Number(event.target.value) }))} />
              </label>
              <label>
                <span>Date</span>
                <input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
              </label>
              <label>
                <span>Time</span>
                <input type="time" value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} />
              </label>
              <label>
                <span>Zone</span>
                <select value={form.zone} onChange={(event) => setForm((current) => ({ ...current, zone: event.target.value as TableZone }))}>
                  {zones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
                </select>
              </label>
              <label>
                <span>Table</span>
                <input value={form.tableLabel} onChange={(event) => setForm((current) => ({ ...current, tableLabel: event.target.value }))} />
              </label>
              <label>
                <span>Status</span>
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ReservationStatus }))}>
                  {reservationStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
              <label>
                <span>Source</span>
                <select value={form.source} onChange={(event) => setForm((current) => ({ ...current, source: event.target.value as ReservationInput['source'] }))}>
                  {sources.map((source) => <option key={source} value={source}>{source}</option>)}
                </select>
              </label>
              <label className="full-span">
                <span>Occasion</span>
                <input value={form.occasion} onChange={(event) => setForm((current) => ({ ...current, occasion: event.target.value }))} placeholder="Birthday brunch, business dinner..." />
              </label>
              <label className="full-span">
                <span>Notes</span>
                <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} rows={4} placeholder="Preferences, allergies, arrival notes..." />
              </label>
              <button type="submit" className="primary-button full-span" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add reservation'}
              </button>
            </form>
          </article>
        </div>

        <div className="stack">
          <article className="panel surface-low">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Guest intelligence</p>
                <h2>{selectedCustomer?.name ?? 'Select a guest'}</h2>
              </div>
              <span className={`tier-badge tier-${selectedCustomer?.tier.toLowerCase() ?? 'new'}`}>{selectedCustomer?.tier ?? 'Guest'}</span>
            </div>

            {selectedReservation ? (
              <div className="guest-focus">
                <div className="focus-card">
                  <span className="metric-label">Reservation moment</span>
                  <strong>{selectedReservation.time} · {selectedReservation.partySize} covers</strong>
                  <p className="subtle">{selectedReservation.zone} · Table {selectedReservation.tableLabel}</p>
                </div>
                <div className="focus-card">
                  <span className="metric-label">Preferences</span>
                  <ul className="clean-list">
                    {selectedCustomer?.preferences.map((preference) => (
                      <li key={preference.label}><strong>{preference.label}:</strong> {preference.detail}</li>
                    ))}
                  </ul>
                </div>
                <div className="focus-card">
                  <span className="metric-label">Status control</span>
                  <div className="status-actions">
                    {reservationStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`mini-button ${selectedReservation.status === status ? 'selected' : ''}`}
                        onClick={() => handleStatusChange(selectedReservation.id, status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </article>

          <article className="panel surface-lowest">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Order history</p>
                <h2>Last visits & spend</h2>
              </div>
              <span className="pill soft">Lifetime spend {formatCurrency(selectedCustomer?.lifetimeSpend ?? 0)}</span>
            </div>
            <div className="list-stack">
              {selectedCustomer?.orderHistory.map((order) => (
                <div key={order.id} className="list-card">
                  <div className="list-topline">
                    <strong>{order.date}</strong>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                  <p className="subtle">{order.items.map((item) => `${item.quantity}× ${item.name}`).join(' · ')}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel surface-lowest">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Offer studio</p>
                <h2>Personalized next best actions</h2>
              </div>
              <span className="pill warm">AI-ready signals</span>
            </div>
            <div className="list-stack">
              {selectedCustomer?.offers.map((offer) => (
                <div key={offer.id} className="offer-card">
                  <strong>{offer.title}</strong>
                  <p>{offer.reason}</p>
                  <div className="offer-meta">
                    <span>{offer.channel}</span>
                    <span>Expires {offer.expiresAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
