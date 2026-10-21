import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Code2, Loader2, Play, RotateCcw, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ApiRecord, apiSucceeded, asRecord, createRehearsalApi, idOf, money, resultOf, rows, safeInspection } from "@/lib/broker-demo";
import carPhoto from "@/assets/christchurch-car-rental-coastal.jpg";

const dateAhead = (days: number) => { const d = new Date(); d.setDate(d.getDate() + days); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const apiDate = (date: string) => date.split("-").reverse().join("/");
const steps = ["Connection", "Availability", "Cover & extras", "Customer", "Manage booking"];

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { id: string; name: string }[] }) {
  return <div className="space-y-2"><Label htmlFor={label}>{label}</Label><select id={label} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm" value={value} onChange={e => onChange(e.target.value)}><option value="">Select…</option>{options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>;
}

export default function BrokerDemo() {
  const api = useRef(createRehearsalApi());
  const [mode, setMode] = useState("rehearsal");
  const [step, setStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [secret, setSecret] = useState("");
  const [agentCode, setAgentCode] = useState("");
  const [setup, setSetup] = useState<ApiRecord>({});
  const [cars, setCars] = useState<ApiRecord[]>([]);
  const [car, setCar] = useState<ApiRecord>({});
  const [details, setDetails] = useState<ApiRecord>({});
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [from, setFrom] = useState(dateAhead(7));
  const [to, setTo] = useState(dateAhead(14));
  const [fromTime, setFromTime] = useState("09:00");
  const [toTime, setToTime] = useState("09:00");
  const [insurance, setInsurance] = useState("");
  const [km, setKm] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const [customer, setCustomer] = useState({ firstname: "", lastname: "", email: "", mobile: "" });
  const [order, setOrder] = useState("");
  const [reference, setReference] = useState("");
  const [booking, setBooking] = useState<ApiRecord>({});
  const [reason, setReason] = useState("");
  const [reasons, setReasons] = useState<ApiRecord[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uncertain, setUncertain] = useState(false);
  const [history, setHistory] = useState<{ method: string; request: unknown; response: unknown }[]>([]);
  const live = mode === "live";
  const itinerary = () => ({ vehiclecategorytypeid: type, pickuplocationid: pickup, dropofflocationid: dropoff, pickupdate: apiDate(from), dropoffdate: apiDate(to), pickuptime: fromTime, dropofftime: toTime, ageid: age });
  const call = async (payload: ApiRecord, write = false): Promise<ApiRecord | null> => {
    setBusy(true); setError("");
    try {
      let result: unknown;
      if (live) {
        if (!apiKey || !secret) throw new Error("Enter your assigned API key and shared secret.");
        const response = await supabase.functions.invoke("broker-demo", { body: { apiKey, secret, payload, confirmLiveWrite: write && confirmed } });
        if (response.error) throw new Error(write ? "Write outcome unknown. Look up your order with James Blond before trying again." : "API connection failed. Check credentials, access and the request.");
        result = response.data;
      } else result = await api.current(payload);
      setHistory(h => [{ method: String(payload.method), request: safeInspection(payload), response: safeInspection(result) }, ...h].slice(0,20));
      if (!apiSucceeded(result)) throw new Error(String(asRecord(result).error ?? "API returned an error"));
      return resultOf(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      if (live && write) setUncertain(true);
      return null;
    } finally { setBusy(false); if (write) setConfirmed(false); }
  };
  const connect = async () => {
    const result = await call({ method: "step1" });
    if (!result) return;
    setSetup(result);
    const locations = rows(result.locations); setPickup(idOf(locations[0] ?? {})); setDropoff(idOf(locations[0] ?? {}));
    setType(idOf(rows(result.categorytypes)[0] ?? {}));
    setAge(idOf(rows(result.driverages).find(a => a.isdefault) ?? rows(result.driverages)[0] ?? {}));
    setStep(1);
  };
  const search = async () => {
    if (!pickup || !dropoff || !type || !age || !from || !to || `${to}T${toTime}` <= `${from}T${fromTime}`) { setError("Choose valid branches, driver age and a return after pickup."); return; }
    const result = await call({ method: "step2", ...itinerary() });
    if (result) setCars(rows(result.availablecars));
  };
  const selectCar = async (selected: ApiRecord) => {
    const result = await call({ method: "step3", ...itinerary(), vehiclecategoryid: selected.vehiclecategoryid });
    if (!result) return;
    setCar(selected); setDetails(result); setExtras([]);
    setInsurance(idOf(rows(result.insuranceoptions).find(i => i.isdefault) ?? rows(result.insuranceoptions)[0] ?? {}));
    setKm(idOf(rows(result.kmcharges)[0] ?? {})); setStep(2);
  };
  const readBack = async (ref = reference) => {
    if (!ref.trim()) { setError("Enter a reservation reference."); return; }
    const result = await call({ method: "bookinginfo", reservationref: ref.trim() });
    if (result) { setBooking(rows(result.bookinginfo)[0] ?? result); }
  };
  const createBooking = async () => {
    if (live && (!confirmed || uncertain)) { setError("Confirm this approved production booking first."); return; }
    const priced = await call({ method: "step3", ...itinerary(), vehiclecategoryid: car.vehiclecategoryid });
    if (!priced) return;
    const result = await call({ method: "booking", ...itinerary(), vehiclecategoryid: car.vehiclecategoryid, bookingtype: 2, insuranceid: insurance, ...(km ? { extrakmsid: km } : {}), optionalfees: extras.map(id => ({ id, qty: 1 })), customer, refno: order }, true);
    if (!result) return;
    const info = rows(result.bookinginfo)[0] ?? {};
    const ref = String(result.reservationref ?? info.reservationref ?? "");
    setReference(ref); setBooking(info); setStep(4);
    if (ref) await readBack(ref); else { setError("No reservationref was returned. Reconcile with James Blond before another booking."); setUncertain(live); }
  };
  const loadReasons = async () => {
    const result = await call({ method: "cancelreasons" });
    if (result) { const list = rows(result.cancelreasons ?? result.cancellationreasons ?? result.reasons); setReasons(list); setReason(""); }
  };
  const cancel = async () => {
    const result = await call({ method: "cancelbooking", reservationref: reference, reasonid: reason }, true);
    if (result) await readBack();
  };
  const options = (list: unknown, name: string) => rows(list).map(r => ({ id: idOf(r), name: String(r[name] ?? r.name ?? r.id) }));
  const field = (label: string, value: string, change: (v: string) => void, inputType = "text") => <div className="space-y-2"><Label htmlFor={label}>{label}</Label><Input id={label} type={inputType} value={value} onChange={e => change(e.target.value)} maxLength={200} /></div>;
  const liveConfirmation = <div className="flex gap-3 items-start border border-destructive/30 bg-muted p-4 rounded-md"><Checkbox id="confirm-write" checked={confirmed} onCheckedChange={v => setConfirmed(v === true)} /><Label htmlFor="confirm-write" className="leading-relaxed">James Blond has approved this test. This operation changes a real production reservation; it is not a sandbox.</Label></div>;
  const last = history[0];
  return <div className="min-h-screen bg-background text-foreground">
    <Helmet><title>Broker API Booking Demo | James Blond Rentals</title><meta name="robots" content="noindex,nofollow" /><meta name="description" content="Broker booking API rehearsal and approved integration testing for James Blond Rentals." /></Helmet>
    <header className="border-b border-border"><div className="max-w-7xl mx-auto px-5 py-5 flex justify-between items-center gap-4"><Link to="/" className="font-bold text-lg">JAMES BLOND <span className="text-muted-foreground text-xs block">RENTALS / DEVELOPER TOOLS</span></Link><ShieldCheck className="text-primary size-6" /></div></header>
    <main className="max-w-7xl mx-auto px-5 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-5"><div><h1 className="text-3xl tracking-normal">Broker booking demo</h1><p className="text-muted-foreground mt-2">{live ? "Production API · Assigned broker credentials required" : "Rehearsal · Sample vehicles and prices · No real reservations"}</p></div><Tabs value={mode} onValueChange={v => { if (busy) return; setMode(v); setStep(0); setSetup({}); setCars([]); setBooking({}); setHistory([]); setReference(""); setSecret(""); setApiKey(""); setConfirmed(false); setUncertain(false); setError(""); api.current = createRehearsalApi(); }}><TabsList><TabsTrigger value="rehearsal">Rehearsal</TabsTrigger><TabsTrigger value="live">Approved live test</TabsTrigger></TabsList></Tabs></div>
      <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-y border-border py-4">{steps.map((s,i) => <li key={s} className={`flex items-center gap-2 text-sm ${step === i ? "text-primary font-semibold" : "text-muted-foreground"}`}><span className="font-mono">0{i+1}</span>{s}</li>)}</ol>
      {error && <div role="alert" className="border-l-4 border-destructive bg-muted p-4 text-destructive break-words">{error}</div>}
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
        <section className="space-y-5 min-w-0">
          {step === 0 && <><h2 className="text-xl tracking-normal">Connect your broker account</h2>{live && <div className="grid sm:grid-cols-2 gap-4">{field("Agent code (reference only)",agentCode,setAgentCode)}{field("API key",apiKey,setApiKey,"password")}{field("Shared secret",secret,setSecret,"password")}</div>}<div className="border-l-2 border-primary pl-4 text-sm space-y-2"><p className="font-mono break-all">POST https://api.jamesblond.co.nz/agent/booking/v3.2/</p><p className="text-muted-foreground">{live ? "Credentials stay in this tab’s memory and are sent over HTTPS to the signing relay. They are not saved. No bearer token is needed." : "Sample data stays in this tab. Update and cancellation rehearsals do not call the production API."}</p></div><Button disabled={busy || (live && (!apiKey || !secret))} onClick={connect}><Play />{busy ? "Connecting…" : "Load setup · step1"}</Button></>}
          {step === 1 && <><h2 className="text-xl tracking-normal">Search availability</h2><form className="grid sm:grid-cols-2 gap-4" onSubmit={e => { e.preventDefault(); search(); }}><SelectField label="Pickup branch" value={pickup} onChange={v => {setPickup(v); setCars([]);}} options={options(setup.locations,"location")} /><SelectField label="Return branch" value={dropoff} onChange={v => {setDropoff(v); setCars([]);}} options={options(setup.locations,"location")} />{field("Pickup date",from,v => {setFrom(v); setCars([]);},"date")}{field("Return date",to,v => {setTo(v); setCars([]);},"date")}{field("Pickup time",fromTime,v => {setFromTime(v); setCars([]);},"time")}{field("Return time",toTime,v => {setToTime(v); setCars([]);},"time")}<SelectField label="Vehicle group" value={type} onChange={v => {setType(v); setCars([]);}} options={options(setup.categorytypes,"vehiclecategorytype")} /><SelectField label="Driver age" value={age} onChange={v => {setAge(v); setCars([]);}} options={options(setup.driverages,"driverage")} /><Button type="submit" disabled={busy}><Search />Search · step2</Button></form><div className="space-y-3">{cars.map(c => <div key={String(c.vehiclecategoryid)} className="border border-border rounded-md p-4 flex justify-between gap-3 items-center"><div><h3 className="text-base tracking-normal">{String(c.vehiclecategory)}</h3><p className="text-sm text-muted-foreground">{Number(c.available) > 0 ? `${money(c.avgrate)} average / day · ${money(c.totalrateafterdiscount)} rental subtotal` : "Unavailable"}</p></div><Button size="sm" variant="outline" disabled={busy || !(Number(c.available)>0)} onClick={() => selectCar(c)} aria-label={`Select ${String(c.vehiclecategory)}`}><ArrowRight /></Button></div>)}</div>{last?.method === "step2" && !cars.length && <p>No vehicles returned for these dates.</p>}</>}
          {step === 2 && <><h2 className="text-xl tracking-normal">{String(car.vehiclecategory)}</h2><SelectField label="Insurance" value={insurance} onChange={setInsurance} options={rows(details.insuranceoptions).map(i => ({id:idOf(i),name:`${String(i.name)} · ${money(i.totalinsuranceamount)}`}))} /><SelectField label="Kilometre option" value={km} onChange={setKm} options={options(details.kmcharges,"name")} /><h3 className="text-base tracking-normal">Optional extras · quantity 1</h3>{rows(details.optionalfees ?? details.extras).map(e => <div key={idOf(e)} className="flex gap-3 items-center"><Checkbox id={`extra-${idOf(e)}`} checked={extras.includes(idOf(e))} onCheckedChange={v => setExtras(x => v ? [...x,idOf(e)] : x.filter(id => id!==idOf(e)))} /><Label htmlFor={`extra-${idOf(e)}`}>{String(e.name)} · {money(e.totalfeeamount ?? e.totalextraamount)}</Label></div>)}<div className="flex gap-3"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button disabled={!insurance} onClick={() => setStep(3)}>Customer details <ArrowRight /></Button></div></>}
          {step === 3 && <><h2 className="text-xl tracking-normal">Booking customer</h2><form className="space-y-5" onSubmit={e => { e.preventDefault(); createBooking(); }}><div className="grid sm:grid-cols-2 gap-4">{Object.entries(customer).map(([key,value]) => <div key={key} className="space-y-2"><Label htmlFor={key}>{({firstname:"First name",lastname:"Last name",email:"Email",mobile:"Mobile"})[key]}</Label><Input id={key} value={value} required type={key === "email" ? "email" : "text"} maxLength={100} onChange={e => setCustomer(c => ({...c,[key]:e.target.value}))} /></div>)}</div><div className="space-y-2"><Label htmlFor="order">Your order reference · refno</Label><Input id="order" value={order} required maxLength={100} onChange={e => setOrder(e.target.value)} /></div>{live && liveConfirmation}<p className="text-sm text-muted-foreground">{live ? "Booking totals and status are read back from the API. A reservation may be unallocated. Never retry an uncertain write." : "All rates and customer records in rehearsal are fictional. No email, SMS or payment is sent."}</p><div className="flex gap-3"><Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button><Button type="submit" disabled={busy || (live && (!confirmed || uncertain))}><CheckCircle2 />{busy ? "Submitting…" : "Create booking · booking"}</Button></div></form></>}
          {step === 4 && <><h2 className="text-xl tracking-normal">Manage booking</h2>{field("Reservation reference",reference,v => {setReference(v); setBooking({}); setConfirmed(false);})}<Button variant="outline" disabled={busy} onClick={() => readBack()}><Search />Read booking · bookinginfo</Button>{Object.keys(booking).length > 0 && <div className="border-y border-border py-5 space-y-2"><p className="font-semibold">{String(booking.vehiclecategory ?? "Reservation")} · {String(booking.bookingstatus ?? booking.status ?? "Check API response for status")}</p><p>Reservation {String(booking.reservationno ?? reference)}</p><p className="text-sm">{String(booking.pickupdate ?? "")} → {String(booking.dropoffdate ?? "")}</p>{booking.totalcost !== undefined && <p className="text-xl font-semibold">{money(booking.totalcost)}</p>}</div>}{!live ? <><h3 className="text-lg tracking-normal">Update rehearsal</h3>{field("Updated first name",customer.firstname,v => setCustomer(c => ({...c,firstname:v})))}<Button variant="outline" disabled={busy || booking.bookingstatus === "Cancelled"} onClick={async () => { const result = await call({method:"editbooking",reservationref:reference,customer:{firstname:customer.firstname}}); if (result) await readBack(); }}>Apply sample update</Button></> : <p className="text-sm border-l-2 border-primary pl-3">Live updates are not enabled on /agent/. Separate maintenance access and its token flow must be provided by James Blond.</p>}<h3 className="text-lg tracking-normal">Cancellation</h3><Button variant="outline" disabled={busy} onClick={loadReasons}>Load reasons · cancelreasons</Button>{reasons.length>0 ? <SelectField label="Cancellation reason" value={reason} onChange={setReason} options={reasons.map(r => ({id:String(r.id ?? r.reasonid ?? ""),name:String(r.reason ?? r.name ?? r.description ?? r.id)}))} /> : last?.method === "cancelreasons" && <div>{field("Returned reason ID",reason,setReason)}<p className="text-sm text-muted-foreground">Use an ID from the API response; reason-list structure requires certification.</p></div>}{live && liveConfirmation}<Button variant="destructive" disabled={busy || !reason || !reference || booking.bookingstatus === "Cancelled" || (live && (!confirmed || uncertain))} onClick={cancel}>Cancel booking · cancelbooking</Button><div><Button variant="ghost" onClick={() => {setStep(1);setCars([]);setConfirmed(false);setReason("");setReasons([]);}}>New search</Button></div></>}
          {step>0 && step<4 && <Button variant="ghost" disabled={busy} onClick={() => setStep(4)}>Look up an existing reservation</Button>}
        </section>
        <aside className="min-w-0 space-y-5">
          {!last && <img src={carPhoto} alt="James Blond rental car in Christchurch" className="w-full aspect-[16/9] object-cover rounded-md" />}
          <div className="flex items-center justify-between"><h2 className="text-lg tracking-normal flex gap-2 items-center"><Code2 className="size-5" />API inspector</h2>{busy && <Loader2 className="animate-spin size-5" />}</div>
          {last ? <><p className="text-sm font-mono text-primary">{last.method} · {live ? "Production" : "Simulated"}</p><details open><summary className="cursor-pointer text-sm font-semibold mb-2">Request</summary><pre className="bg-muted p-4 rounded-md text-xs whitespace-pre-wrap break-all max-h-64 overflow-auto">{JSON.stringify(last.request,null,2)}</pre></details><details open><summary className="cursor-pointer text-sm font-semibold mb-2">Response</summary><pre className="bg-muted p-4 rounded-md text-xs whitespace-pre-wrap break-all max-h-96 overflow-auto">{JSON.stringify(last.response,null,2)}</pre></details><div className="border-t border-border pt-4 space-y-2">{history.map((h,i) => <details key={i}><summary className="text-xs font-mono cursor-pointer">{history.length-i}. {h.method}</summary><pre className="text-xs whitespace-pre-wrap break-all bg-muted p-3 max-h-60 overflow-auto">{JSON.stringify(h.response,null,2)}</pre></details>)}</div></> : <p className="text-sm text-muted-foreground">No API calls yet.</p>}
          <Button variant="ghost" size="sm" disabled={busy} onClick={() => window.location.reload()}><RotateCcw />Clear session</Button>
        </aside>
      </div>
    </main>
  </div>;
}