"use client";

import { FormEvent, useMemo, useState } from "react";

type Tour = { code: string; title: string; duration: string; category: string; endpoint: string; summary: string; file: string };
type Assignment = { guideFirstName: string; guideLastName: string; tour: Tour; bus: string; meetingTime: string; startTime: string; departurePoint: string; dateLabel: string; operationNote: string };

const pdfBase = "https://shorexplorations-guias.freedomlion.chatgpt.site/pdfs";
const logo = "/logo.svg";

const tours: Tour[] = [
  { code: "002Q", title: "Buenos Aires Panoramic & Shopping", duration: "5 h", category: "Ciudad", endpoint: "Abovedado", summary: "Plaza de Mayo, La Boca y dos horas de compras en calle Florida.", file: "002Q Descriptivo Panoramic y shopping.pdf" },
  { code: "02CY", title: "Buenos Aires Panoramic - World Cruise", duration: "4 h", category: "Ciudad", endpoint: "Abovedado", summary: "Plaza de Mayo, San Telmo, La Boca, Recoleta y Palermo.", file: "02cy descriptivo.pdf" },
  { code: "03T0 / 5395", title: "Lo mejor de Buenos Aires - Almuerzo & Tango", duration: "8 h", category: "Tango", endpoint: "Abovedado", summary: "Clasicos portenos, almuerzo, show en Madero Tango y compras.", file: "03T0 5395 BEST OF BUENOS AIRES.pdf" },
  { code: "5394", title: "Bye Bye Buenos Aires", duration: "4 h", category: "Traslado", endpoint: "Ezeiza", summary: "Ultima panoramica antes del traslado al aeropuerto.", file: "5394 - Bye bye Buenos Aires.pdf" },
  { code: "5397", title: "Bye Bye Buenos Aires con Almuerzo", duration: "6 h", category: "Traslado", endpoint: "Ezeiza", summary: "Recoleta, centro, Caminito, almuerzo y traslado a Ezeiza.", file: "5397 - Bye Bye Buenos Aires con Almuerzo.pdf" },
  { code: "5401", title: "Tour por la ciudad de Buenos Aires", duration: "4 h", category: "Ciudad", endpoint: "Abovedado", summary: "City tour clasico de sur a norte con opcion Florida.", file: "5401 Descriptivo City tour costa.pdf" },
  { code: "5402", title: "Super Buenos Aires", duration: "8 h", category: "Ciudad", endpoint: "Abovedado", summary: "Jornada completa, almuerzo y tiempo de compras.", file: "5402 SUPER BUENOS AIRES.pdf" },
  { code: "03T0 COSTA", title: "The Best of Buenos Aires - Almuerzo & Tango", duration: "8 h", category: "Tango", endpoint: "Abovedado", summary: "Plaza de Mayo, Caminito, Madero Tango y Florida.", file: "COSTA_03T0_The_Best_of_Buenos_Aires_Lunch_Tango_ES.pdf" },
  { code: "0047", title: "Buenos Aires & Museo Boca Juniors", duration: "4:30 h", category: "Futbol", endpoint: "Abovedado", summary: "Centro historico, Caminito y Museo Boca Juniors.", file: "Descriptivo Buenos aires y boca museo.pdf" },
  { code: "03SZ", title: "Daily Drink & Tango", duration: "2:30 h", category: "Tango", endpoint: "Abovedado", summary: "Show diario de tango con una bebida incluida.", file: "Descriptivo Daily tango and drink.pdf" },
  { code: "S/C", title: "Fiesta Gaucha - Estancia La Mimosa", duration: "6:30 h", category: "Naturaleza", endpoint: "Abovedado", summary: "Campo, asado, folclore y destrezas gauchas.", file: "Descriptivo Gaucho fiesta.pdf" },
  { code: "5392", title: "La Plata - Ciudad de las Diagonales", duration: "5:30 h", category: "Ciudad", endpoint: "Abovedado", summary: "Eje monumental, Catedral y Museo de Ciencias Naturales.", file: "descriptivo LA PLATA catedral y museo.pdf" },
  { code: "5393", title: "Bioparque Temaiken", duration: "5:30 h", category: "Naturaleza", endpoint: "Abovedado", summary: "Traslado y visita a las principales areas del bioparque.", file: "Descriptivo Temaiken.pdf" },
  { code: "5400", title: "Tigre & Delta del Parana", duration: "4:30 h", category: "Naturaleza", endpoint: "Abovedado", summary: "San Isidro, Tigre y navegacion por el Delta.", file: "Descriptivo Tigre COSTA.pdf" },
  { code: "S/C", title: "Buenos Aires - River & Boca", duration: "6 h", category: "Futbol", endpoint: "Abovedado", summary: "Estadios, museos, murales, choripan y Caminito.", file: "Descriptivo Tour river y BOCA.pdf" },
  { code: "03T0", title: "Lo mejor de Buenos Aires - Madero & Compras", duration: "8 h", category: "Tango", endpoint: "Abovedado", summary: "Almuerzo, show y compras en calle Florida.", file: "FASCINOSA Full day con porteño y compras.pdf" },
  { code: "S/C", title: "Paseo River - Boca", duration: "6:15 h", category: "Futbol", endpoint: "Abovedado", summary: "Circuito futbolero con refrigerio, museos y Caminito.", file: "Paseo River - Boca.pdf" },
];

const demoAssignment: Assignment = {
  guideFirstName: "Lucia",
  guideLastName: "Demo",
  tour: tours[13],
  bus: "18",
  meetingTime: "09:15",
  startTime: "09:45",
  departurePoint: "Pie de barco",
  dateLabel: "Hoy",
  operationNote: "Lancha regular a las 12:00. Embarque puntual. Al iniciar, enviar por WhatsApp a Ian la cantidad total de participantes. Finalizar el servicio en Abovedado.",
};

const categories = ["Todos", "Ciudad", "Tango", "Naturaleza", "Futbol", "Traslado"];
const pdfUrl = (file: string) => `${pdfBase}/${encodeURIComponent(file)}`;

export default function Home() {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [lastName, setLastName] = useState("");
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [selected, setSelected] = useState<Tour | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("es");
    return tours.filter((tour) => {
      const haystack = `${tour.code} ${tour.title} ${tour.summary}`.toLocaleLowerCase("es");
      return (category === "Todos" || tour.category === category) && (!needle || haystack.includes(needle));
    });
  }, [category, query]);

  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lastName.trim().toLocaleLowerCase("es") === "demo" && pin === "1234") {
      setAssignment(demoAssignment);
      setLoginError("");
    } else {
      setLoginError("Apellido o clave incorrectos. En esta demo usa DEMO / 1234.");
    }
  }

  if (!assignment) {
    return (
      <main className="login-page">
        <section className="login-brand-panel">
          <img src={logo} alt="Shorexplorations" />
          <div>
            <p className="eyebrow">Portal operativo</p>
            <h1>Tu servicio.<br />Toda la informacion.</h1>
            <p>Consulta tu tour asignado, bus, punto de partida y descriptivo antes de comenzar.</p>
          </div>
          <span className="login-edition">Buenos Aires - Guias</span>
        </section>
        <section className="login-form-panel">
          <form onSubmit={login}>
            <p className="eyebrow">Acceso de guias</p>
            <h2>Iniciar sesion</h2>
            <p className="form-intro">Ingresa tu apellido y los ultimos cuatro numeros de tu DNI.</p>
            <label><span>Apellido</span><input autoComplete="username" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Ej. Gonzalez" required /></label>
            <label><span>Ultimos 4 del DNI</span><input autoComplete="current-password" inputMode="numeric" type="password" maxLength={4} pattern="[0-9]{4}" value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))} placeholder="1234" required /></label>
            {loginError && <p className="login-error" role="alert">{loginError}</p>}
            <button className="login-button" type="submit">Ver mi asignacion <span aria-hidden="true">-&gt;</span></button>
            <aside className="demo-access"><strong>Acceso de prueba</strong><span>Apellido: DEMO - Clave: 1234</span></aside>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="portal-page">
      <header className="portal-topbar">
        <a className="portal-brand" href="#asignacion"><img src={logo} alt="Shorexplorations" /></a>
        <div className="guide-account"><span><strong>{assignment.guideFirstName} {assignment.guideLastName}</strong><small>Guia asignada</small></span><button type="button" onClick={() => setAssignment(null)}>Salir</button></div>
      </header>
      <section className="assignment-hero" id="asignacion">
        <div className="assignment-heading"><div><p className="eyebrow">{assignment.dateLabel}</p><h1>Buen dia,<br />{assignment.guideFirstName}.</h1></div><span className="status-pill"><i /> Servicio asignado</span></div>
        <article className="primary-assignment">
          <div className="assignment-main"><div className="assignment-code"><span>Codigo</span><strong>{assignment.tour.code}</strong></div><p className="eyebrow">Tu tour de hoy</p><h2>{assignment.tour.title}</h2><p>{assignment.tour.summary}</p><div className="assignment-actions"><button type="button" onClick={() => setSelected(assignment.tour)}>Ver descriptivo <span>-&gt;</span></button><a href={pdfUrl(assignment.tour.file)} target="_blank">Abrir PDF <span>v</span></a></div></div>
          <dl className="operation-grid"><div><dt>Bus asignado</dt><dd><b>{assignment.bus}</b></dd></div><div><dt>Presentacion</dt><dd>{assignment.meetingTime}</dd></div><div><dt>Salida</dt><dd>{assignment.startTime}</dd></div><div><dt>Punto de partida</dt><dd>{assignment.departurePoint}</dd></div></dl>
          <div className="operation-alert"><span>Importante</span><p>{assignment.operationNote}</p></div>
        </article>
      </section>
      <section className="quick-info">
        <article><span>01</span><div><strong>Llega con anticipacion</strong><p>La presentacion obligatoria en la puerta del bus es a las {assignment.meetingTime}, 30 minutos antes del inicio del tour ({assignment.startTime}).</p></div></article>
        <article><span>02</span><div><strong>Verifica material y audio</strong><p>Controla descriptivo, vouchers, reservas, numero identificatorio y correcto funcionamiento del microfono antes del embarque.</p></div></article>
        <article><span>03</span><div><strong>Avisa participantes reales</strong><p>Al comenzar, envia por WhatsApp a Ian la cantidad de participantes que efectivamente inicio el tour.</p></div></article>
        <article><span>04</span><div><strong>Confirma el cierre</strong><p>Este servicio finaliza en {assignment.tour.endpoint}.</p></div></article>
      </section>
      <section className="portal-library">
        <div className="section-heading"><div><p className="eyebrow">Biblioteca operativa</p><h2>Todos los descriptivos</h2></div><p className="result-count">{filtered.length} resultados</p></div>
        <div className="tools"><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre o codigo..." />{query && <button type="button" onClick={() => setQuery("")}>x</button>}</label><div className="filters">{categories.map((item) => <button key={item} className={item === category ? "active" : ""} onClick={() => setCategory(item)} type="button">{item}</button>)}</div></div>
        <div className="tour-grid">{filtered.map((tour, index) => <article className="tour-card" key={`${tour.file}-${index}`}><div className="card-topline"><span className="code">{tour.code}</span><span className="category">{tour.category}</span></div><h3>{tour.title}</h3><p>{tour.summary}</p><dl><div><dt>Duracion</dt><dd>{tour.duration}</dd></div><div><dt>Cierre</dt><dd>{tour.endpoint}</dd></div></dl><div className="card-actions"><button type="button" onClick={() => setSelected(tour)}>Ver online -&gt;</button><a href={pdfUrl(tour.file)} target="_blank">Abrir v</a></div></article>)}</div>
      </section>
      <footer><div><img src={logo} alt="" /><span>Shorexplorations</span></div><p>Confirma cambios operativos del dia antes de iniciar.</p></footer>
      {selected && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><section className="modal"><div className="modal-header"><div><span>{selected.code} - {selected.duration}</span><h2>{selected.title}</h2></div><div className="modal-actions"><a href={pdfUrl(selected.file)} target="_blank">Abrir PDF v</a><button type="button" onClick={() => setSelected(null)}>x</button></div></div><iframe title={`Descriptivo: ${selected.title}`} src={`${pdfUrl(selected.file)}#view=FitH&toolbar=1`} /></section></div>}
    </main>
  );
}
