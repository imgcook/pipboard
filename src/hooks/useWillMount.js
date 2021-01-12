import { useRef } from 'react'

const useWillMount = (cb) => {
  const ref = useRef(false);
  if (!ref.current) {
    ref.current = true;
    typeof cb === 'function' && cb();
  }
};

export default useWillMount;
