import { Img, staticFile } from "remotion";
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadBarlow } from "@remotion/google-fonts/Barlow";
import { palette, useEnter, useKenBurns } from "../theme";

const archivo = loadArchivo("normal", { weights: ["700", "900"], subsets: ["latin"] });
const barlow = loadBarlow("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const display = archivo.fontFamily;
export const body = barlow.fontFamily;

export const Kicker: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const style = useEnter(delay, 18);
  return (
    <div
      style={{
        ...style,
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        fontFamily: body,
        fontWeight: 600,
        fontSize: 24,
        letterSpacing: 4,
        textTransform: "uppercase",
        color: palette.greenSoft,
      }}
    >
      <span
        style={{
          width: 46,
          height: 4,
          borderRadius: 2,
          background: palette.green,
          display: "inline-block",
        }}
      />
      {children}
    </div>
  );
};

export const Headline: React.FC<{
  lines: React.ReactNode[];
  delay?: number;
  size?: number;
}> = ({ lines, delay = 0, size = 96 }) => (
  <div>
    {lines.map((line, i) => (
      <Line key={i} delay={delay + i * 7} size={size}>
        {line}
      </Line>
    ))}
  </div>
);

const Line: React.FC<{ children: React.ReactNode; delay: number; size: number }> = ({
  children,
  delay,
  size,
}) => {
  const style = useEnter(delay, 54);
  return (
    <div
      style={{
        ...style,
        fontFamily: display,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: -2.5,
        color: palette.cream,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
};

export const Photo: React.FC<{
  src: string;
  delay?: number;
  radius?: number;
  height?: number | string;
  width?: number | string;
  kenBurns?: [number, number];
  tilt?: number;
}> = ({ src, delay = 0, radius = 34, height = 520, width = "100%", kenBurns = [1.06, 1.18], tilt = 0 }) => {
  const style = useEnter(delay, 40);
  const scale = useKenBurns(kenBurns[0], kenBurns[1]);
  return (
    <div
      style={{
        ...style,
        transform: `${style.transform} rotate(${tilt}deg)`,
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        border: "1px solid rgba(246,244,239,0.16)",
        boxShadow: "0 46px 90px rgba(4,8,24,0.55)",
      }}
    >
      <Img
        src={staticFile(`images/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg, rgba(16,27,69,0.05) 0%, rgba(8,15,43,0.5) 100%)",
        }}
      />
    </div>
  );
};

export const Logo: React.FC<{ width?: number; style?: React.CSSProperties }> = ({
  width = 420,
  style,
}) => (
  <div
    style={{
      background: palette.cream,
      borderRadius: 22,
      padding: "22px 30px",
      boxShadow: "0 30px 70px rgba(4,8,24,0.5)",
      ...style,
    }}
  >
    <Img src={staticFile("images/logo.png")} style={{ width, display: "block" }} />
  </div>
);
