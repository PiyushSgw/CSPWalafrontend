export const fetchAddressFromPincode = async (pin: string) => {
  if (pin.length !== 6) return null;

  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pin}`
    );

    const data = await response.json();

    if (
      data[0]?.Status === "Success" &&
      data[0]?.PostOffice?.length > 0
    ) {
      const postOffice = data[0].PostOffice[0];

      return {
        city: postOffice.Name,
        district: postOffice.District,
        state: postOffice.State,
        country: postOffice.Country,
      };
    }

    return null;
  } catch (error) {
    console.error("Pincode API Error:", error);
    return null;
  }
};