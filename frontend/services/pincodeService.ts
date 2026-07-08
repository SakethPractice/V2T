export interface LocationDetails {
  state: string;
  district: string;
  taluk: string;
  village: string;
  lat: number;
  long: number;
}

export async function fetchLocationDetailsByPincode(
  pinCode: string | number
): Promise<LocationDetails | null> {
  try {
    // ---------------------------------------------------------
    // API 1: Fetch State, District, and Taluk
    // ---------------------------------------------------------
    const api1Url = import.meta.env.VITE_LOC_API; 
    const api1Response = await fetch(api1Url, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinCode }),
    });

    if (!api1Response.ok) {
      return null;
    }

    const api1Data = await api1Response.json();
    
    if (!Array.isArray(api1Data) || api1Data.length === 0) {
      console.error("No data found for this pincode.");
      return null;
    }

    const firstResult = api1Data[0];

    // Grab only state, district, and taluk from API 1
    const state = firstResult.state || "";
    const district = firstResult.district || "";
    const taluk = firstResult.taluk || "";

    // ---------------------------------------------------------
    // API 2: Fetch Lat, Long, AND Village
    // ---------------------------------------------------------
    const api2Url = import.meta.env.VITE_LAT_API; 
    const api2Response = await fetch(api2Url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pinCode,
        taluk: taluk, 
        village: "",  
      }),
    });

    if (!api2Response.ok) {
      return null;
    }

    const api2Data = await api2Response.json();
    
    let lat = 0;
    let long = 0;
    let village = ""; // We will extract village here instead!

    // Safely extract from API 2
    if (Array.isArray(api2Data) && api2Data.length > 0) {
      lat = api2Data[0].lat || api2Data[0].latitude || 0;
      long = api2Data[0].long || api2Data[0].longitude || 0;
      village = api2Data[0].village || ""; // Grab village from API 2 array
    } else if (!Array.isArray(api2Data) && api2Data) {
      lat = api2Data.lat || api2Data.latitude || 0;
      long = api2Data.long || api2Data.longitude || 0;
      village = api2Data.village || ""; // Grab village from API 2 object
    }

    // Return the combined payload. 
    return {
      state,
      district,
      taluk,
      village,
      lat,
      long,
    };
  } catch (error) {
    console.error("Location details lookup failed:", error);
    return null;
  }
}