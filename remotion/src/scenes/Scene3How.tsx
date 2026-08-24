import { AbsoluteFill } from "remotion";
import { palette, useDrift, useEnter } from "../theme";
import { Headline, Kicker, body, display } from "../components/ui";

const rows = [
  { n: "01", t: "We market it", d: "Website, Google Ads and branch enquiries drive the demand." },
  { n: "02", t: "We run the rental", d: "Bookings, payments, agreements, driver checks and bonds." },
  { n: "03", t: "You get paid", d: "A share of net rental revenue, with a statement every month." },
];

const Row: React.FC<{ n: string; t: string; d: string; delay: number; i: number }> = ({
  n,
  t,
  d,
  delay,
  i,
}) => {
  const style = useEnter(delay, 44);
  const drift = useDrift(5, 0.02, i * 1.7);
  return (
    <div
      style={{
        ...style,
        transform: `${style.transform} translateX(${drift}px)`,
        display: "flex",
        gap: 30,
        alignItems: "flex-start",
        background: "rgba(246,244,239,0.06)",
        border: "1px solid rgba(246,244,239,0.12)",
        borderRadius: 28,
        padding: "30px 34px",
        marginLeft: i * 34,
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontWeight: 900,
          fontSize: 54,
          color: palette.greenSoft,
          lineHeight: 1,
          letterSpacing: -2,
        }}
      >
        {n}
      </div>
      <div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 44,
            color: palette.cream,
            textTransform: "uppercase",
            letterSpacing: -1.2,
          }}
        >
          {t}
        </div>
        <div
          style={{
            fontFamily: body,
            fontWeight: 400,
            fontSize: 29,
            color: palette.creamDim,
            marginTop: 8,
            maxWidth: 640,
          }}
        >
          {d}
        </div>
      </div>
    </div>
  );
};

export const Scene3How: React.FC = () => (
  <AbsoluteFill style={{ padding: 82, justifyContent: "center" }}>
    <div style={{ marginBottom: 44 }}>
      <Kicker delay={2}>How the partnership works</Kicker>
      <div style={{ height: 20 }} />
      <Headline delay={8} size={84} lines={["Three steps.", "Nothing hidden."]} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {rows.map((r, i) => (
        <Row key={r.n} {...r} i={i} delay={30 + i * 12} />
      ))}
    </div>
  </AbsoluteFill>
);
