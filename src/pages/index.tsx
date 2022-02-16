import { Stack } from "@chakra-ui/react";
import { useRef } from "react";

import { LendingPosition } from "../components/home/LendingPosition";
import { Staking } from "../components/home/Staking";
import { YourPositions } from "../components/home/YourPositions";

const Home = () => {
  const lendingDiv = useRef();
  const childDiv = useRef();
  const onClickToScroll = (actionType: string) => {
    if (lendingDiv.current && childDiv.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      childDiv.current.onActionChanged(actionType);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      lendingDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Stack spacing="6" width="100%">
      <LendingPosition scrollRef={lendingDiv} ref={childDiv} />
      <YourPositions onClickToScroll={onClickToScroll} />
      <Staking />
    </Stack>
  );
};

export default Home;
