import { Destination } from "@/data/destinations";

/**
 * Utility to wrap text into multiple lines based on maximum width.
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export async function generatePoster(destination: Destination): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  // Base background (fallback)
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Load image
  const img = new Image();
  img.crossOrigin = "anonymous";
  
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = destination.image;
  });

  // Draw image to cover canvas
  const imgRatio = img.width / img.height;
  const canvasRatio = canvas.width / canvas.height;
  let renderWidth = canvas.width;
  let renderHeight = canvas.height;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > canvasRatio) {
    renderWidth = canvas.height * imgRatio;
    offsetX = (canvas.width - renderWidth) / 2;
  } else {
    renderHeight = canvas.width / imgRatio;
    offsetY = (canvas.height - renderHeight) / 2;
  }

  // 1. Draw background image with subtle cinematic grading
  ctx.filter = "brightness(0.92) contrast(1.06) saturate(0.92)";
  ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  ctx.filter = "none"; // Reset filter immediately

  // 2. Add subtle vignette overlay
  const vignette = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.25)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 3. Add soft bottom gradient for text readability (preserved image visibility)
  const gradient = ctx.createLinearGradient(0, canvas.height * 0.55, 0, canvas.height);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.55, "rgba(0,0,0,0.3)");
  gradient.addColorStop(0.8, "rgba(0,0,0,0.65)");
  gradient.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 4. Subtle ember glow on bottom left (very restrained)
  const glow = ctx.createRadialGradient(0, canvas.height, 0, 0, canvas.height, 600);
  glow.addColorStop(0, "rgba(229, 142, 38, 0.1)");
  glow.addColorStop(1, "rgba(229, 142, 38, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, canvas.height - 600, 600, 600);

  // 5. Apply very subtle monochrome grain
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const opacity = Math.random() * 0.035;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fillRect(x, y, 1.2, 1.2);
  }

  // 6. Typography rendering
  const padding = 100;
  const maxTextWidth = canvas.width - (padding * 2);
  let currentY = canvas.height - padding;

  // Draw Brand Wordmark
  ctx.font = "500 22px 'Inter', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  const brandText = "BEYOND NOMAD Atlas";
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = "3px";
  }
  ctx.fillText(brandText, padding, currentY);
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = "0px";
  }

  currentY -= 50;

  // Metadata Line (Restrained)
  ctx.font = "600 24px 'Inter', sans-serif";
  ctx.fillStyle = "rgba(229, 142, 38, 0.85)"; // Subtle ember
  const vibe = destination.vibes.length > 0 ? destination.vibes[0].toUpperCase() : "EXPLORE";
  const tripType = destination.durationType.length > 0 ? destination.durationType[0].toUpperCase() : "TRIP";
  const metadataText = `${destination.distance.toUpperCase()} • ${vibe} • ${tripType}`;
  ctx.fillText(metadataText, padding, currentY);

  currentY -= 65;

  // Mood line (Summary - Grounded & Observational)
  ctx.font = "italic 38px 'Inter', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  
  const summaryLines = wrapText(ctx, destination.summary, maxTextWidth);

  for (let i = summaryLines.length - 1; i >= 0; i--) {
    ctx.fillText(summaryLines[i], padding, currentY);
    currentY -= 52;
  }

  currentY -= 35;

  // Dynamic font scaling and wrapping for Destination Name (Preserved)
  const titleName = destination.name.toUpperCase();
  let titleFontSize = 100;
  
  if (titleName.length > 25) {
    titleFontSize = 62;
  } else if (titleName.length > 18) {
    titleFontSize = 78;
  } else if (titleName.length > 12) {
    titleFontSize = 90;
  }

  ctx.font = `800 ${titleFontSize}px 'Inter', sans-serif`;
  ctx.fillStyle = "#ffffff";
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = "-2px";
  }

  const titleLines = wrapText(ctx, titleName, maxTextWidth);
  
  for (let i = titleLines.length - 1; i >= 0; i--) {
    ctx.fillText(titleLines[i], padding, currentY);
    currentY -= (titleFontSize * 0.92);
  }

  return canvas.toDataURL("image/png", 0.95);
}
