import { Stack } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { useRef } from "react";

import { LendingPosition } from "../components/home/LendingPosition";
// import { LendingStats } from "../components/home/LendingStats";
import { Staking } from "../components/home/Staking";
import { YourPositions } from "../components/home/YourPositions";
// import { YourStats } from "../components/home/YourStats";

const Home = () => {
  const lendingDiv = useRef();
  const childDiv = useRef();

  const { account } = useEthers();

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
      {/* <LendingStats /> */}
      <LendingPosition scrollRef={lendingDiv} ref={childDiv} />
      {/* <YourStats /> */}
      {account && (
        <>
          <YourPositions onClickToScroll={onClickToScroll} />
          <Staking />
        </>
      )}
    </Stack>
  );
};

export default Home;
