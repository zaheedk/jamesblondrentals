import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { Backdrop } from "./components/Backdrop";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Turn } from "./scenes/Scene2Turn";
import { Scene3How } from "./scenes/Scene3How";
import { Scene4Vehicles } from "./scenes/Scene4Vehicles";
import { Scene5Trust } from "./scenes/Scene5Trust";
import { Scene6End } from "./scenes/Scene6End";

const timing = springTiming({ config: { damping: 200 }, durationInFrames: 20 });

export const MainVideo: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150}>
        <Scene1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={160}>
        <Scene2Turn />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={190}>
        <Scene3How />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={170}>
        <Scene4Vehicles />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={160}>
        <Scene5Trust />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={170}>
        <Scene6End />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
