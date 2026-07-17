import { createSign } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_SHEET_ID = "14uzn25YQQShwvPDwKcOSmKTJ71epYJu87k6ouOHVnxg";
const LOGIN_RANGE = "'Login portal'!A2:Z1000";

type SheetRecord = Record<string, string>;
type EnvGuideRecord = {
  a?: string;
  p?: string;
  s?: string;
  n?: string;
  l?: string;
  r?: string;
  i?: string;
};

function normalizeLogin(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]/g, "");
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function firstValue(record: SheetRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (value) return value;
  }
  return "";
}

function splitStaff(staff: string, fallbackLastName: string) {
  const parts = staff.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "Guia", lastName: fallbackLastName || "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: fallbackLastName || "" };
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: fallbackLastName || parts.at(-1) || "",
  };
}

function base64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawPrivateKey) {
    throw new Error("Missing Google service account env vars");
  }

  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const signature = signer.sign(privateKey);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${base64Url(signature)}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google token request failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Google token response missing access_token");
  return data.access_token;
}

async function readLoginRows(): Promise<SheetRecord[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID || DEFAULT_SHEET_ID;
  const token = await getAccessToken();
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(LOGIN_RANGE)}`,
  );
  url.searchParams.set("majorDimension", "ROWS");

  const response = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Google Sheets read failed: ${response.status}`);
  }

  const data = (await response.json()) as { values?: string[][] };
  const [headersRaw = [], ...rows] = data.values || [];
  const headers = headersRaw.map((header) => normalizeLogin(header).replace(/ultimos4/g, "ultimos_4"));

  return rows.map((row) => {
    const record: SheetRecord = {};
    headers.forEach((header, index) => {
      if (header) record[header] = clean(row[index]);
    });
    return record;
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { lastName?: string; pin?: string } | null;
  const requestedLastName = normalizeLogin(body?.lastName || "");
  const requestedPin = clean(body?.pin).replace(/\D/g, "");

  if (!requestedLastName || !/^\d{4}$/.test(requestedPin)) {
    return NextResponse.json({ ok: false, error: "Ingresa apellido y ultimos 4 del DNI." }, { status: 400 });
  }

  if (requestedLastName === "demo" && requestedPin === "1234") {
    return NextResponse.json({
      ok: true,
      guide: { firstName: "Lucia", lastName: "Demo", staff: "Lucia Demo", role: "Demo", languages: "Espanol" },
      assignment: { tourCode: "5400", bus: "18", meetingTime: "09:15", startTime: "09:45", departurePoint: "Pie de barco", dateLabel: "Hoy" },
      demo: true,
    });
  }

  try {
    const envData = process.env.GUIDES_LOGIN_DATA;
    if (envData) {
      const guides = JSON.parse(envData) as EnvGuideRecord[];
      const matches = guides.filter((guide) => {
        return normalizeLogin(guide.a || "") === requestedLastName && clean(guide.p) === requestedPin;
      });

      if (matches.length !== 1) {
        return NextResponse.json(
          { ok: false, error: matches.length > 1 ? "Hay mas de un registro con ese acceso. Avisale a Ian para revisarlo." : "Apellido o clave incorrectos." },
          { status: 401 },
        );
      }

      const guide = matches[0];
      return NextResponse.json({
        ok: true,
        guide: {
          firstName: clean(guide.n) || splitStaff(clean(guide.s), clean(guide.l)).firstName,
          lastName: clean(guide.l) || clean(guide.a),
          staff: clean(guide.s),
          role: clean(guide.r),
          languages: clean(guide.i),
        },
        assignment: null,
      });
    }

    const rows = await readLoginRows();
    const matches = rows.filter((record) => {
      const active = normalizeLogin(firstValue(record, ["activo"]));
      const lastName = firstValue(record, ["apellido_login", "apellidologin", "apellido"]);
      const pin = firstValue(record, ["pin_ultimos_4", "pinultimos_4", "pin"]);
      return active !== "no" && normalizeLogin(lastName) === requestedLastName && pin === requestedPin;
    });

    if (matches.length !== 1) {
      return NextResponse.json(
        { ok: false, error: matches.length > 1 ? "Hay mas de un registro con ese acceso. Avisale a Ian para revisarlo." : "Apellido o clave incorrectos." },
        { status: 401 },
      );
    }

    const record = matches[0];
    const staff = firstValue(record, ["staff", "nombre", "guia"]);
    const inferredLastName = firstValue(record, ["apellido_inferido", "apellido", "apellido_login"]);
    const guideName = splitStaff(staff, inferredLastName);
    const tourCode = firstValue(record, ["tour_code", "codigotour", "codigo_tour", "tour"]);

    return NextResponse.json({
      ok: true,
      guide: {
        firstName: firstValue(record, ["nombres_inferidos", "nombres"]) || guideName.firstName,
        lastName: inferredLastName || guideName.lastName,
        staff,
        role: firstValue(record, ["rol"]),
        languages: firstValue(record, ["idiomas"]),
      },
      assignment: tourCode
        ? {
            tourCode,
            bus: firstValue(record, ["bus", "micro", "numero_bus", "nro_bus"]),
            meetingTime: firstValue(record, ["presentacion", "meeting_time", "horario_presentacion"]),
            startTime: firstValue(record, ["salida", "start_time", "horario_salida"]),
            departurePoint: firstValue(record, ["punto_partida", "departure_point", "salida_desde"]),
            dateLabel: firstValue(record, ["fecha", "date_label"]),
          }
        : null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "La base de guias todavia no esta conectada en Vercel. Revisa variables privadas." },
      { status: 503 },
    );
  }
}
