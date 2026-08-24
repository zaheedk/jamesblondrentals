import { AbsoluteFill } from "remotion";
import { palette, useAccent, useDrift, useEnter } from "../theme";
import { Headline, Kicker, Photo, body, display } from "../components/ui";

const stats = [
  { big: "1995", small: "Renting to Kiwis since" },
  { big: "$0", small: "Joining fee, ever" },
  { big: "Monthly", small: "Payouts with statements" },
];

const Stat: React.FC<{ big: string; small: string; delay: number; i: number }> = ({
  big,
  small,
  delay,
  i,
}) => {
  const style = useAccent(delay);
  const drift = useDrift(5, 0.021, i * 2);
  return (
    <div
      style={{
        ...style,
        transform: `${style.transform} translateY(${drift}px)`,
        flex: 1,
        background: "rgba(8,15,43,0.55)",
        border: "1px solid rgba(246,244,239,0.14)",
        borderRadius: 26,
        padding: "28px 26px",
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontWeight: 900,
          fontSize: 62,
          letterSpacing: -2.5,
          color: palette.greenSoft,
          lineHeight: 1,
        }}
      >
        {big}
      </div>
      <div
        style={{
          fontFamily: body,
          fontWeight: 500,
          fontSize: 25,
          color: palette.creamDim,
          marginTop: 12,
        }}
      >
        {small}
      </div>
    </div>
  );
};

export const Scene5Trust: React.FC = () => {
  const quote = useEnter(20, 34);
  return (
    <AbsoluteFill style={{ padding: 82, justifyContent: "space-between" }}>
      <div style={{ marginTop: 16 }}>
        <Kicker delay={2}>Why owners partner with us</Kicker>
        <div style={{ height: 22 }} />
        <Headline delay={8} size={86} lines={["A rental brand", "renters already", "trust."]} />
        <div
          style={{
            ...quote,
            marginTop: 26,
            fontFamily: body,
            fontSize: 31,
            fontWeight: 400,
            color: palette.creamDim,
            maxWidth: 820,
            borderLeft: `4px solid ${palette.green}`,
            paddingLeft: 22,
          }}
        >
          Insurance, servicing and rego stay with you as the owner — the bookings,
          payments and paperwork are ours.
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, marginBottom: 26 }}>
        {stats.map((s, i) => (
          <Stat key={s.big} {...s} i={i} delay={44 + i * 10} />
        ))}
      </div>

      <div style={{ position: "absolute", right: 82, top: 556, width: 300, opacity: 0.92 }}>
        <Photo src="couple-moving-boxes-truck.jpg" delay={34} height={186} radius={26} tilt={2} />
      </div>

    </AbsoluteFill>
  );
};
