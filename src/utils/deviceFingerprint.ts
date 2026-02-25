export const getDeviceFingerprint = async (): Promise<{ hash: string; name: string }> => {
  const data =
    navigator.userAgent +
    screen.width +
    screen.height +
    navigator.language;

  // Simple browser/OS detection for display name
  const userAgent = navigator.userAgent;
  let browser = "Unknown Browser";
  if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
  else if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
  else if (userAgent.indexOf("Safari") > -1) browser = "Safari";
  else if (userAgent.indexOf("Edge") > -1) browser = "Edge";

  let os = "Unknown OS";
  if (userAgent.indexOf("Win") > -1) os = "Windows";
  else if (userAgent.indexOf("Mac") > -1) os = "MacOS";
  else if (userAgent.indexOf("Linux") > -1) os = "Linux";
  else if (userAgent.indexOf("Android") > -1) os = "Android";
  else if (userAgent.indexOf("iPhone") > -1) os = "iOS";

  const name = `${browser} on ${os}`;

  // Fallback for non-secure contexts (HTTP) where crypto.subtle is undefined
  if (!window.crypto || !window.crypto.subtle) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return { 
        hash: Math.abs(hash).toString(16).padStart(32, "0"),
        name
    }; 
  }

  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(data)
  );

  const hash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
    
  return { hash, name };
};
