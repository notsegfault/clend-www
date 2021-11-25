import { Circle, Center } from "@chakra-ui/react";
import { FC } from "react";

interface BlurryCircleProps {
  background: string;
  blur: string;
  radius: string;
  left: string;
  top: string;
  rotation?: string;
  opacity?: string;
}
export const BlurryCircle: FC<BlurryCircleProps> = ({
  background,
  blur,
  radius,
  left,
  top,
  rotation,
  opacity,
}) => {
  return (
    <Center>
      <Circle
        position="absolute"
        size={`${radius}px`}
        marginLeft={parseInt(left, 10) > 0 ? `${left}%` : ""}
        marginRight={parseInt(left, 10) < 0 ? `${-left}%` : ""}
        marginTop={`${top}%`}
        background={background}
        filter={`blur(${blur}px)`}
        transform={`rotate(${rotation || 0}deg)`}
        opacity={opacity || "1"}
        zIndex={-1}
      />
    </Center>
  );
};
