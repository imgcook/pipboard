import React, {useRef, useEffect} from 'react';

export default function ApperDiv ({style, onAppear, children}) {

  const ref = useRef(null);

  useEffect(() => {
    ref.current && ref.current.addEventListener('appear', onAppear);
    return () => {
      ref.current && ref.current.removeEventListener('appear', onAppear);
    }
  }, [onAppear])

  return (
    <div className="appear-div" style={style} ref={ref}>
      {children}
    </div>
  );
}
