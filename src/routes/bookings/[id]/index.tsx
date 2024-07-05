import { type DocumentHead, server$, useLocation } from "@builder.io/qwik-city";
import { Resource, component$, useResource$ } from "@builder.io/qwik";

interface Room {
  id: number;
  maxUnits: number;
  maxOccupancy: number;
  name: string;
}

interface Hotel {
  id: number;
  name: string;
}

interface Customer {
  bookingIds: number[];
  email: string;
  firstName: string;
  id: number;
  lastName: string;
}

interface Booking {
  cancelledAt: string | null;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  currencyCode: string;
  customer: Customer;
  hotel: Hotel;
  id: number;
  occupancy: number;
  notes: string | null;
  paidInFullAt: string | null;
  room: Room;
  total: number;
  updatedAt: string;
}

const fetchBooking = server$(async function (id: string) {
  const response = await fetch(
    `${this.env.get("PUBLIC_API_URL")}/bookings/${id}`,
    {
      headers: {
        "x-api-key": this.env.get("API_KEY") || "",
      },
    },
  );
  if (response.status !== 200) {
    throw new Error(await response.text());
  }
  return (await response.json()) as Booking;
});

export default component$(() => {
  const loc = useLocation();
  const booking = useResource$(async () => fetchBooking(loc.params.id));
  return (
    <div class="container">
      <div class="mb-16">
        <h1>Booking #{loc.params.id}</h1>
        <a href="/bookings">&larr; Back to Bookings</a>
      </div>
      <Resource
        value={booking}
        onPending={() => <h1>Loading...</h1>}
        onRejected={() => <p>Failed to get booking</p>}
        onResolved={(booking) => (
          <dl class="grid grid-cols-[1fr_2fr] gap-4">
            <dt>Booking ID</dt>
            <dd>{booking.id}</dd>
            <dt>Status</dt>
            <dd>
              {booking.cancelledAt
                ? `Cancelled at ${booking.cancelledAt}`
                : "CONFIRMED"}
            </dd>
            <dt>Check-in Date</dt>
            <dd>{new Date(booking.checkInDate).toLocaleDateString()}</dd>
            <dt>Check-out Date</dt>
            <dd>{new Date(booking.checkOutDate).toLocaleDateString()}</dd>
            <dt>Created At</dt>
            <dd>{new Date(booking.createdAt).toLocaleDateString()}</dd>
            <dt>Length of Stay</dt>
            <dd>{booking.occupancy} nights</dd>
            <dt>Paid in Full At</dt>
            <dd>{booking.paidInFullAt}</dd>
            <dt>Total Cost</dt>
            <dd>
              {(booking.total / 100).toFixed(2)} {booking.currencyCode}
            </dd>
            <dt>Hotel</dt>
            <dd>
              <dl class="grid grid-cols-[1fr_2fr] gap-2">
                <dd>ID:</dd>
                <dt>{booking.hotel.id}</dt>
                <dd>Name:</dd>
                <dt>{booking.hotel.name}</dt>
              </dl>
            </dd>
            <dt>Room</dt>
            <dd>
              <dl class="grid grid-cols-[1fr_2fr] gap-2">
                <dd>ID:</dd>
                <dd>{booking.room.id}</dd>
                <dd>Name:</dd>
                <dt>{booking.room.name}</dt>
                <dd>Max Occupancy:</dd>
                <dt>{booking.room.maxOccupancy}</dt>
                <dd>Max Units:</dd>
                <dt>{booking.room.maxUnits}</dt>
              </dl>
            </dd>
            <dt>Notes</dt>
            <dd>{booking.notes}</dd>
            <dt>Updated At</dt>
            <dd>{new Date(booking.updatedAt).toLocaleDateString()}</dd>
            <dt>User Info</dt>
            <dd class="space-y-2">
              <p>
                {booking.customer.firstName} {booking.customer.lastName}
              </p>
              <p>{booking.customer.email}</p>
              {booking.customer.bookingIds.length && (
                <>
                  <p>Other Bookings:</p>
                  <ul class="space-y-2 p-0">
                    {booking.customer.bookingIds.map((bookingId) => (
                      <li key={bookingId}>
                        <a href={`/bookings/${bookingId}`}>
                          Booking #{bookingId}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </dd>
          </dl>
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Booking",
};
