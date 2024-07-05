import { type DocumentHead, server$ } from "@builder.io/qwik-city";
import { Resource, component$, useResource$ } from "@builder.io/qwik";

interface Booking {
  cancelled: boolean;
  checkInDate: string;
  checkOutDate: string;
  currencyCode: string;
  hotelName: string;
  id: number;
  occupancy: number;
  paid: boolean;
  total: number;
}

export const fetchData = server$(async function () {
  const response = await fetch(`${this.env.get("PUBLIC_API_URL")}/bookings`, {
    headers: {
      "x-api-key": this.env.get("API_KEY") || "",
    },
  });
  return (await response.json()) as Booking[];
});

export default component$(() => {
  const data = useResource$(async () => fetchData());
  return (
    <>
      <h1>Bookings</h1>
      <Resource
        value={data}
        onPending={() => <h1>Loading...</h1>}
        onRejected={() => <p>Failed to get data</p>}
        onResolved={(data) => (
          <div class="container">
            <table class="w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hotel Name</th>
                  <th>Check-In Date</th>
                  <th>Check-Out Date</th>
                  <th>Length of Stay</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.map((booking: Booking) => (
                  <tr
                    class="border-y border-gray-300 hover:bg-gray-700"
                    key={booking.id}
                  >
                    <td class="py-2 text-center">{booking.id}</td>
                    <td class="py-2 text-center">{booking.hotelName}</td>
                    <td class="py-2 text-center">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </td>
                    <td class="py-2 text-center">
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </td>
                    <td class="py-2 text-center">{booking.occupancy} nights</td>
                    <td class="py-2 text-center">
                      {(booking.total / 100).toFixed(2)} {booking.currencyCode}
                    </td>
                    <td class="py-2 text-center">
                      {booking.paid ? "✔️" : "❌"}
                    </td>
                    <td class="py-2 text-center">
                      {booking.cancelled ? "Cancelled" : "Confirmed"}
                    </td>
                    <td class="py-2 text-center">
                      <a href={`/bookings/${booking.id}`}>See More</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      />
    </>
  );
});

export const head: DocumentHead = {
  title: "Bookings",
};
