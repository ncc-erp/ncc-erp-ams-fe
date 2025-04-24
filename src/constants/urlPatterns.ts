export const hardwareUrlPattern = new RegExp(
  "^https?:\\/\\/" +
    "(?:localhost|[a-z\\d](?:[a-z\\d-]*[a-z\\d])*(?:\\.[a-z]{2,})*)" +
    "(?::\\d+)?" +
    "\\/detail-device\\?" +
    "id=[^&]"
);
