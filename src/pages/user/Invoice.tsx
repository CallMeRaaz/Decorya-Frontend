import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import logo from "../../assets/frontend_assets/logo.png";
import Loader from "../../components/loader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  mobNo: string;
  altMob: string;
}

interface OrderItem {
  photo: any;
  _id: string;
  name: string;
  description?: string;
  quantity: number;
  mainPrice: number;
  total: number;
}

interface Order {
  _id: string;
  updatedAt: string;
  amount?: number;
  modeOfPayment: string;
  invoiceID: string;
  customerName?: string;
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  trackingId: string;
  deliveryDate: string;
  message: string;
  user: {
    name: string;
    _id: string;
  };
}

const Invoice = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER}/api/v1/order/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch order details");

        const data = await response.json();
        if (data.success) setOrder(data.order);
      } catch (error) {
        console.error("❌ Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const downloadPDF = async () => {
    if (!invoiceRef.current || !order) return;

    const element = invoiceRef.current;

    // Clone the element to avoid messing up the page
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.width = "210mm"; // A4 width
    clonedElement.style.padding = "20px"; // optional padding
    clonedElement.style.boxSizing = "border-box";

    // Append to body temporarily
    document.body.appendChild(clonedElement);

    // Capture as canvas
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Remove cloned element
    document.body.removeChild(clonedElement);

    const imgData = canvas.toDataURL("image/png");

    // Create jsPDF in A4
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    while (heightLeft > 0) {
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      position -= pdfHeight;
      if (heightLeft > 0) pdf.addPage();
    }

    pdf.save(`Invoice-${order.invoiceID}.pdf`);
  };

  if (loading) return <Loader />;

  if (!order)
    return <div className="text-center pt-36 py-4">Invoice not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 pt-24 px-4 sm:px-8 font-sans">
      <div className="text-center mt-6">
        <button
          onClick={downloadPDF}
          className="text-center px-6 mb-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
        >
          Download PDF
        </button>
      </div>

      <div
        ref={invoiceRef}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 mb-6">
          <div>
            <img src={logo} alt="Company Logo" className="h-16 mb-2" />
            <p className="text-sm text-gray-600">
              Address: {import.meta.env.VITE_ADDRESS}
            </p>
            <p className="text-sm text-gray-600">
              Phone: {import.meta.env.VITE_PHONE_NO}
            </p>
            <p className="text-sm text-gray-600">
              Email: {import.meta.env.VITE_EMAIL_ID}
            </p>
          </div>
          <div className="text-right mt-4 sm:mt-0">
            <h1 className="text-3xl font-bold text-slate-600 uppercase tracking-wide">
              Invoice
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              <div>
                Invoice #:{" "}
                <span className="font-medium text-gray-700">
                  {order.invoiceID}
                </span>
              </div>
              <div>
                Generated On:{" "}
                <span className="font-medium text-gray-700">
                  {order.deliveryDate
                    ? new Date(order.deliveryDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>
              <div>
                Order #:{" "}
                <span className="font-medium text-gray-700">{order._id}</span>
              </div>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 via-white to-indigo-50 p-6 rounded-xl mb-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">
            Bill To
          </h2>
          <p className="text-gray-700 font-medium">{order.shippingInfo.name}</p>
          <p className="text-sm text-gray-600">{order.shippingInfo.address}</p>
          <p className="text-sm text-gray-600">
            {order.shippingInfo.city}, {order.shippingInfo.country}
          </p>
          <p className="text-sm text-gray-600">
            Phone: {order.shippingInfo.mobNo}
          </p>
          <p className="text-sm text-gray-600">
            Email: {order.shippingInfo.email}
          </p>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  Product Image
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Product Name
                </th>
                <th className="px-4 py-3 text-center font-semibold">Qty</th>
                <th className="px-4 py-3 text-center font-semibold">Price</th>
                <th className="px-4 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.length ? (
                order.orderItems.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-slate-50">
                    <td className="px-2 py-2 text-gray-700">
                      {" "}
                      <img
                        src={`${import.meta.env.VITE_SERVER}/${item.photo}`}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-medium">
                      {item.name.length > 25
                        ? item.name.slice(0, 25) + "…"
                        : item.name}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      ₹{item.mainPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      ₹{(item.mainPrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-500 py-4 italic border-t"
                  >
                    No items found in this order.
                  </td>
                </tr>
              )}

              {/* Totals */}
              <tr className="border-t bg-slate-50">
                <td colSpan={4} className="px-4 py-3 text-right font-medium">
                  Subtotal
                </td>
                <td className="px-4 py-3 text-right">
                  ₹{order.subtotal.toFixed(2)}
                </td>
              </tr>
              <tr className="border-t bg-slate-50">
                <td colSpan={4} className="px-4 py-3 text-right font-medium">
                  Shipping
                </td>
                <td className="px-4 py-3 text-right">
                  {order.shippingCharges === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    `₹${order.shippingCharges.toFixed(2)}`
                  )}
                </td>
              </tr>
              <tr className="border-t bg-slate-50">
                <td colSpan={4} className="px-4 py-3 text-right font-medium">
                  Discount
                </td>
                <td className="px-4 py-3 text-right text-green-600">
                  -₹{order.discount.toFixed(2)}
                </td>
              </tr>
              <tr className="border-t bg-slate-200 font-semibold">
                <td colSpan={4} className="px-4 py-3 text-right text-slate-700">
                  Total Amount
                </td>
                <td className="px-4 py-3 text-right text-slate-700">
                  ₹{order.total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 p-6 rounded-xl border border-indigo-200 text-sm text-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">Note:</h3>
          <p className="leading-relaxed">
            Thank you for choosing to do business with us. Your support
            motivates us to provide the best quality and service. If you have
            any questions about your order, please feel free to contact us
            anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
