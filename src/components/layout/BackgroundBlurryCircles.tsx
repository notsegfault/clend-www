import { Box, Container } from "@chakra-ui/react";

import { BlurryCircle } from "../background";

export const BackgroundBlurryCircles = ({ ...props }) => {
  return (
    <Container p="0" m="0" {...props}>
      {/* Desktop */}
      <Box display={{ base: "none", sm: "block" }}>
        <BlurryCircle
          radius="120"
          background="#5840EC"
          opacity="0.3"
          left="-55"
          top="20"
          blur="80"
        />
        <BlurryCircle
          radius="300"
          background="linear-gradient(95.32deg, #2F55DE -18.91%, #EA5332 148.09%)"
          opacity="0.55"
          left="50"
          top="35"
          blur="150"
        />
        <BlurryCircle
          radius="350"
          background="rgba(172, 87, 112, 0.23)"
          opacity="0.55"
          left="-65"
          top="80"
          blur="180"
          rotation="7.30"
        />
        <BlurryCircle
          radius="150"
          background="rgba(176, 67, 32, 0.21)"
          opacity="0.55"
          left="0"
          top="30"
          blur="50"
        />
        <BlurryCircle
          radius="120"
          background="rgba(85, 124, 255, 0.13)"
          opacity="0.55"
          left="-65"
          top="20"
          blur="30"
        />
        <BlurryCircle
          radius="450"
          background="rgba(85, 124, 255, 0.14)"
          opacity="0.55"
          left="80"
          top="10"
          blur="30"
        />
        <BlurryCircle
          radius="500"
          background="rgba(85, 124, 255, 0.14)"
          opacity="0.45"
          left="-65"
          top="15"
          blur="30"
        />
        <BlurryCircle
          radius="500"
          background="rgba(85, 124, 255, 0.14)"
          opacity="0.45"
          left="-5"
          top="60"
          blur="30"
        />
      </Box>

      {/* Mobile */}
      <Box display={{ base: "block", sm: "none" }}>
        <BlurryCircle
          radius="120"
          background="#5840EC"
          opacity="0.3"
          left="-80"
          top="90"
          blur="100"
        />
        <BlurryCircle
          radius="60"
          background="linear-gradient(95.32deg, #2F55DE -18.91%, #EA5332 148.09%)"
          opacity="0.55"
          left="70"
          top="70"
          blur="40"
        />
        <BlurryCircle
          radius="350"
          background="rgba(172, 87, 112, 0.23)"
          opacity="0.55"
          left="-65"
          top="280"
          blur="80"
          rotation="7.30"
        />
        <BlurryCircle
          radius="120"
          background="rgba(85, 124, 255, 0.13)"
          opacity="0.55"
          left="-45"
          top="450"
          blur="30"
        />
        <BlurryCircle
          radius="60"
          background="rgba(176, 67, 32, 0.21)"
          opacity="0.55"
          left="-3"
          top="50"
          blur="29"
        />

        <BlurryCircle
          radius="200"
          background="rgba(85, 124, 255, 0.14)"
          opacity="0.55"
          left="80"
          top="30"
          blur="30"
        />
        <BlurryCircle
          radius="250"
          background="rgba(85, 124, 255, 0.13)"
          opacity="0.55"
          left="-65"
          top="40"
          blur="30"
        />
      </Box>
    </Container>
  );
};
