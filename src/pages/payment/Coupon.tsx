import  { useState } from 'react';

const Coupon = () => {
  const couponCode = "STEALDEAL20";
  const offerText = "80% flat off on all rides within the city";
  const validTill = "20 Dec, 2021";
  const cardName = "Killer Credit Card";

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(couponCode).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      }).catch((err) => {
        console.error("Failed to copy using Clipboard API: ", err);
      });
    } else {
      const tempInput = document.createElement('input');
      tempInput.value = couponCode;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
  
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    }
  };
  

  return (
    <div className="my-5 w-full">
      <div className="bg-yellow-500 text-center py-7  shadow-md">
        <h3 className="text-sm sm:text-2xl font-semibold mb-4">
          {offerText}
          <br />
          using {cardName}
        </h3>
        <div className="flex items-center justify-center space-x-2 mb-6">
          <span
            id="cpnCode"
            className="border-dashed border text-white px-4 py-2 rounded-l"
          >
            {couponCode}
          </span>
          <button
            id="cpnBtn"
            onClick={handleCopy}
            className="border border-white bg-white text-purple-600 px-4 py-2 rounded-r cursor-pointer"
          >
            {isCopied ? "Copied" : "Copy Code"}
          </button>
        </div>
        <p className="text-sm text-gray-100">Valid Till: {validTill}</p>
      </div>
    </div>
  );
};

export default Coupon;
