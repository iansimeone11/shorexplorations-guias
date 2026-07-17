import { NextResponse } from "next/server";

export const runtime = "nodejs";

type TourPdf = {
  code: string;
  title: string;
  duration: string;
  category: string;
  endpoint: string;
  summary: string;
  food: string;
  includes: string;
  guideNotes: string[];
};

const TOURS: Record<string, TourPdf> = {
  "002Q Descriptivo Panoramic y shopping.pdf": { code: "002Q", title: "Buenos Aires Panoramic & Shopping", duration: "5 h", category: "Ciudad", endpoint: "Abovedado", summary: "Panoramica esencial de Buenos Aires con Plaza de Mayo, La Boca y dos horas completas de compras en calle Florida.", food: "No incluye comida ni snack.", includes: "Transporte, guia y paradas indicadas.", guideNotes: ["Respetar las 5 horas de servicio.", "Tolerancia maxima sugerida en paradas: 15 minutos.", "Plaza de Mayo puede variar por situacion politica.", "Finalizar en Abovedado salvo instruccion operativa distinta."] },
  "02cy descriptivo.pdf": { code: "02CY", title: "Buenos Aires Panoramic - World Cruise", duration: "4 h", category: "Ciudad", endpoint: "Abovedado", summary: "Recorrido panoramico por Plaza de Mayo, San Telmo, La Boca, Recoleta y Palermo.", food: "No incluye comida. Cementerio de Recoleta no incluido.", includes: "Transporte, guia y visita interior de Catedral sujeta a acceso.", guideNotes: ["El orden puede variar por transito.", "Margen operativo aproximado: 15 minutos.", "Catedral: controlar vestimenta adecuada."] },
  "03T0 5395 BEST OF BUENOS AIRES.pdf": { code: "03T0 / 5395", title: "Lo mejor de Buenos Aires - Almuerzo & Tango", duration: "8 h", category: "Tango", endpoint: "Abovedado", summary: "Buenos Aires clasico, Caminito, almuerzo y show de tango en Madero Tango, con cierre de compras en Florida.", food: "Menu de referencia Madero Tango: empanada, bife de chorizo con papines, flan, aguas/gaseosas y vino segun voucher.", includes: "Almuerzo, show, transporte y guia.", guideNotes: ["Llegar a Madero Tango 12:00-12:15.", "Show de tango de referencia: 13:30.", "Cumplir 8 horas de paseo."] },
  "5394 - Bye bye Buenos Aires.pdf": { code: "5394", title: "Bye Bye Buenos Aires", duration: "4 h", category: "Traslado", endpoint: "Ezeiza", summary: "Ultima panoramica de la ciudad antes del traslado al aeropuerto.", food: "No incluye comidas.", includes: "Transporte y guia. Cementerio de Recoleta no incluido.", guideNotes: ["Reconfirmar vuelos antes de salir.", "Validar ETA del barco y horarios minimos de vuelo.", "Cierre operativo en Aeropuerto Ezeiza."] },
  "5397 - Bye Bye Buenos Aires con Almuerzo.pdf": { code: "5397", title: "Bye Bye Buenos Aires con Almuerzo", duration: "6 h", category: "Traslado", endpoint: "Ezeiza", summary: "Recorrido final por Recoleta, centro, Puerto Madero y Caminito con almuerzo y traslado a Ezeiza.", food: "Almuerzo sujeto a voucher/proveedor del dia. Reconfirmar restaurante antes de salir.", includes: "Transporte, guia y almuerzo si esta confirmado en voucher.", guideNotes: ["Reconfirmar vuelos, restaurante y cantidad de pasajeros.", "Catedral: vestimenta adecuada.", "Cierre operativo en Aeropuerto Ezeiza."] },
  "5401 Descriptivo City tour costa.pdf": { code: "5401", title: "Tour por la ciudad de Buenos Aires", duration: "4 h", category: "Ciudad", endpoint: "Abovedado", summary: "City tour clasico con Plaza de Mayo, San Telmo, Caminito, Palermo y Recoleta.", food: "No incluye comida ni snack.", includes: "Transporte, guia y paradas indicadas.", guideNotes: ["Respetar 4 horas de servicio.", "Ampliar paradas si hay poco transito.", "Plaza de Mayo sujeta a cierres."] },
  "5402 SUPER BUENOS AIRES.pdf": { code: "5402", title: "Super Buenos Aires", duration: "8 h", category: "Ciudad", endpoint: "Abovedado", summary: "Buenos Aires de sur a norte con almuerzo en Puerto Madero, Recoleta y compras en Florida.", food: "Almuerzo en restaurante Dique 1 de referencia. Incluye una bebida segun voucher.", includes: "Almuerzo con bebida indicada, transporte y guia. Cementerio no incluido.", guideNotes: ["Llegar al restaurante a las 13:00.", "Reconfirmar menu y cantidad de cubiertos.", "Cumplir 8 horas de servicio."] },
  "COSTA_03T0_The_Best_of_Buenos_Aires_Lunch_Tango_ES.pdf": { code: "03T0 COSTA", title: "The Best of Buenos Aires - Almuerzo & Tango", duration: "8 h", category: "Tango", endpoint: "Abovedado", summary: "Plaza de Mayo, Obelisco, Caminito, almuerzo, show en Madero Tango y compras.", food: "Menu de referencia: empanada, bife de chorizo, flan, aguas/gaseosas y vino segun voucher.", includes: "Almuerzo, bebidas indicadas, show, transporte y guia.", guideNotes: ["Controlar horario de show.", "Conservar tiempo de compras.", "El orden puede variar por transito y operacion."] },
  "Descriptivo Buenos aires y boca museo.pdf": { code: "0047", title: "Buenos Aires & Museo Boca Juniors", duration: "4:30 h", category: "Futbol", endpoint: "Abovedado", summary: "Plaza de Mayo, San Telmo, Caminito y visita al Museo Boca Juniors.", food: "No incluye comida ni snack.", includes: "Transporte, guia y visita al Museo Boca Juniors segun reserva.", guideNotes: ["Respetar 4 h 30.", "Confirmar reserva/entrada del museo.", "Catedral: exterior o interior segun acceso y vestimenta."] },
  "Descriptivo byebye con almuerzo.pdf": { code: "5397", title: "Bye Bye Buenos Aires con Almuerzo - Planilla", duration: "6 h", category: "Traslado", endpoint: "Ezeiza", summary: "Recorrido final con almuerzo buffet y traslado a Ezeiza.", food: "Almuerzo buffet de referencia en Gourmet Porteno; validar proveedor vigente y voucher.", includes: "Almuerzo y bebida indicada, transporte y guia. Cementerio no incluido.", guideNotes: ["Reconfirmar vuelos, restaurante y voucher.", "La reserva/cambio operativo del dia prevalece."] },
  "Descriptivo Daily tango and drink.pdf": { code: "03SZ", title: "Daily Drink & Tango", duration: "2:30 h", category: "Tango", endpoint: "Abovedado", summary: "Salida al show diario de tango en Madero Tango con una bebida incluida.", food: "Una bebida a eleccion por pasajero.", includes: "Entrada al show, una bebida, transporte y guia.", guideNotes: ["Comienzo de show de referencia: 13:30.", "Devolver numero identificatorio si corresponde.", "Cierre obligatorio en Abovedado."] },
  "Descriptivo Gaucho fiesta.pdf": { code: "S/C", title: "Fiesta Gaucha - Estancia La Mimosa", duration: "6:30 h aprox.", category: "Naturaleza", endpoint: "Abovedado", summary: "Experiencia de campo con recepcion, asado, folklore, destrezas gauchas, merienda y panoramica.", food: "Bienvenida con empanadas y vino. Almuerzo de asado argentino. Merienda con pastelitos y mate cocido segun voucher.", includes: "Actividades de estancia, almuerzo, bebidas consignadas, merienda, transporte y guia.", guideNotes: ["Llegada a estancia de referencia: 10:45-11:00.", "Reconfirmar cantidades exactas de bebidas.", "Panoramica de regreso segun tiempo disponible."] },
  "descriptivo LA PLATA catedral y museo.pdf": { code: "5392", title: "La Plata - Ciudad de las Diagonales", duration: "5:30 h", category: "Ciudad", endpoint: "Abovedado", summary: "Visita a Plaza San Martin, eje monumental, Plaza Moreno, Catedral y Museo de Ciencias Naturales.", food: "No incluye comida ni snack.", includes: "Transporte, guia y accesos segun reserva.", guideNotes: ["Entradas limitadas: compra anticipada.", "Reserva/cancelacion de referencia: 48 h.", "Catedral: vestimenta adecuada."] },
  "Descriptivo Temaiken.pdf": { code: "5393", title: "Bioparque Temaiken", duration: "5:30 h", category: "Naturaleza", endpoint: "Abovedado", summary: "Traslado y visita al Bioparque Temaiken, incluyendo sus areas principales segun acceso.", food: "No incluye comida. Prohibido ingresar con alimentos.", includes: "Entrada al parque, transporte y guia segun reserva.", guideNotes: ["Entradas limitadas: compra anticipada.", "No permitir ingreso con comida.", "Duracion puede variar por transito."] },
  "Descriptivo Tigre COSTA.pdf": { code: "5400", title: "Tigre & Delta del Parana", duration: "4:30 h", category: "Naturaleza", endpoint: "Abovedado", summary: "Salida al norte con San Isidro y navegacion por el Delta desde Tigre.", food: "No incluye comida ni snack.", includes: "Navegacion regular, transporte y guia.", guideNotes: ["Horario total de referencia: 09:45-14:15.", "Lancha regular 12:00 puntual.", "Asegurar embarque previo y finalizar en Abovedado."] },
  "Descriptivo Tour river y BOCA.pdf": { code: "S/C", title: "Buenos Aires - River & Boca", duration: "6 h", category: "Futbol", endpoint: "Abovedado", summary: "Circuito futbolero con River, Boca, murales, choripan, museos y Caminito.", food: "La Canita: 1 choripan + 1 gaseosa o agua por pasajero, segun voucher.", includes: "Museos River y Boca, snack indicado, transporte y guia; validar entradas.", guideNotes: ["Tolerancia maxima en paradas: 15 minutos.", "Confirmar reservas y horarios de museos.", "Contactos operativos segun planilla del dia."] },
  "FASCINOSA Full day con porteño y compras.pdf": { code: "03T0", title: "Lo mejor de Buenos Aires - Madero & Compras", duration: "8 h", category: "Tango", endpoint: "Abovedado", summary: "Plaza de Mayo, Caminito, almuerzo, show en Madero Tango y compras en Florida.", food: "Menu de referencia Madero Tango: empanada, bife de chorizo, flan, aguas/gaseosas y vino segun voucher.", includes: "Almuerzo, show, transporte y guia.", guideNotes: ["Horario general de referencia: 09:00-17:00.", "Llegar a Madero Tango 12:20-12:40.", "Show de referencia: 13:30."] },
  "Paseo River - Boca.pdf": { code: "S/C", title: "Paseo River - Boca", duration: "6:15 h aprox.", category: "Futbol", endpoint: "Abovedado", summary: "Circuito por River Plate, murales, Museo Boca, refrigerio y Caminito.", food: "Refrigerio: 1 choripan + 1 bebida sin alcohol por pasajero.", includes: "Museos River y Boca, refrigerio, transporte y guia; validar entradas.", guideNotes: ["Confirmar convocatoria y horarios.", "Validar contactos operativos River/Boca del dia.", "Finalizar en Abovedado."] },
  "Shorexplorations - Compendio descriptivos de tours.pdf": { code: "COMP", title: "Compendio descriptivos de tours", duration: "Variable", category: "Operativo", endpoint: "Abovedado", summary: "Compendio general de descriptivos disponibles en el portal de guias.", food: "Ver ficha individual de cada tour.", includes: "Listado general para consulta rapida.", guideNotes: ["Usar siempre la ficha especifica del tour asignado.", "Confirmar cambios operativos, reservas y vouchers antes de iniciar.", "Enviar a Ian la cantidad real de participantes al comenzar el tour."] }
};

function clean(input: string) {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[–—]/g, "-").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[^\x20-\x7E\n]/g, "");
}

function esc(input: string) {
  return clean(input).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(text: string, max = 78) {
  const lines: string[] = [];
  for (const raw of text.split("\n")) {
    let line = "";
    for (const word of raw.split(/\s+/)) {
      if (!word) continue;
      if ((line + " " + word).trim().length > max) {
        if (line) lines.push(line);
        line = word;
      } else line = (line + " " + word).trim();
    }
    if (line) lines.push(line);
    else lines.push("");
  }
  return lines;
}

function pdf(tour: TourPdf) {
  const sections = [
    `CODIGO: ${tour.code}    DURACION: ${tour.duration}    MODALIDAD: ${tour.category}`,
    `CIERRE DEL TOUR: ${tour.endpoint.toUpperCase()}`,
    "",
    "DESCRIPCION",
    tour.summary,
    "",
    "COMIDA, MENU Y SNACKS",
    tour.food,
    "",
    "INCLUYE / NO INCLUYE",
    tour.includes,
    "",
    "CLAVES PARA EL GUIA",
    ...tour.guideNotes.map((note) => `- ${note}`),
    "",
    "CHECKLIST ANTES DE SALIR",
    "- Presentarse en puerta del bus 30 minutos antes del inicio del tour.",
    "- Verificar material, vouchers, reservas y numero identificatorio.",
    "- Verificar funcionamiento de microfono antes del embarque.",
    "- Enviar WhatsApp a Ian con cantidad real de participantes al comenzar.",
    "- Ante cambios operativos, seguir la instruccion del dia."
  ];
  const lines = wrap(sections.join("\n"));
  const pageLines = lines.slice(0, 56);
  const ops: string[] = [];
  ops.push("1 0.408 0 rg 0 774 595 68 re f");
  ops.push(`0 0 0 rg BT /F1 10 Tf 42 812 Td (SHOREXPLORATIONS / FICHA OPERATIVA PARA GUIAS) Tj ET`);
  ops.push(`BT /F1 22 Tf 42 786 Td (${esc(tour.title)}) Tj ET`);
  let y = 742;
  for (const line of pageLines) {
    if (!line) { y -= 10; continue; }
    const heading = /^[A-Z0-9 ,/&-]{8,}$/.test(clean(line));
    ops.push(`BT /F1 ${heading ? 10.5 : 9.5} Tf 42 ${y} Td (${esc(line)}) Tj ET`);
    y -= heading ? 16 : 13;
  }
  ops.push("1 0.408 0 rg 42 42 120 18 re f");
  ops.push(`0 0 0 rg BT /F1 11 Tf 52 47 Td (CIERRE: ${esc(tour.endpoint.toUpperCase())}) Tj ET`);
  const stream = ops.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [4 0 R] /Count 1 >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents 5 0 R >>`,
    `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`
  ];
  let out = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];
  objects.forEach((obj, i) => { offsets.push(Buffer.byteLength(out, "latin1")); out += `${i + 1} 0 obj\n${obj}\nendobj\n`; });
  const xref = Buffer.byteLength(out, "latin1");
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) out += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(out, "latin1");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file") || "";
  const tour = TOURS[file];
  if (!tour) return NextResponse.json({ ok: false, error: "Descriptivo no encontrado" }, { status: 404 });
  const body = pdf(tour);
  const disposition = searchParams.get("download") === "1" ? "attachment" : "inline";
  return new NextResponse(body, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `${disposition}; filename="${encodeURIComponent(file)}"`,
      "cache-control": "public, max-age=3600"
    }
  });
}
