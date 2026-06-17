export async function fetchPincode(
  village: string
): Promise<string | null> {
  try {
    const apiKey =
      import.meta.env.VITE_GEOAPIFY_API_KEY;

    const url =
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        village
      )}&filter=countrycode:in&limit=1&apiKey=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (
      !data.features ||
      data.features.length === 0
    ) {
      return null;
    }

    const properties =
      data.features[0].properties;

    return (
      properties.postcode ?? null
    );
  } catch (error) {
    console.error(
      "Pincode lookup failed:",
      error
    );

    return null;
  }
}