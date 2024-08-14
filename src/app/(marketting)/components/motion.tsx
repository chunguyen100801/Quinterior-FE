'use client';

import { HTMLMotionProps, motion } from 'framer-motion';

const AnimatedDiv = (props: HTMLMotionProps<'div'>) => {
  return <motion.div {...props}>{props.children}</motion.div>;
};

export default AnimatedDiv;
