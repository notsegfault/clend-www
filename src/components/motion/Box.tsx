import { HTMLChakraProps, chakra } from "@chakra-ui/react";
import { HTMLMotionProps, motion } from "framer-motion";

import { Merge } from "types/merge";

type MotionBoxProps = Merge<HTMLChakraProps<"div">, HTMLMotionProps<"div">>;

export const MotionBox: React.FC<MotionBoxProps> = motion(chakra.div);
