import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { PropsWithChildren } from 'react';

interface AnimationWrapperProps extends MotionProps {
  keyValue?: string;
  className?: string;
}

const AnimationWrapper = ({
  children,
  keyValue,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  exit,
  transition = { duration: 0.5 },
  variants,
  className,
  ...rest
}: PropsWithChildren<AnimationWrapperProps>) => {
  return (
    <AnimatePresence>
      <motion.div
        key={keyValue}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        variants={variants}
        className={className}
        {...rest} // để truyền thêm các prop khác nếu cần
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimationWrapper;
