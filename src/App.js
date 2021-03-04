import React, { useEffect, useRef, useState } from "react";
import { fromEvent, interval, Subject } from "rxjs";
import { buffer, debounceTime, filter, map, takeUntil } from "rxjs/operators";
import './App.css';

export default function App() {
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState("stop");

  useEffect(() => {
    const stream$ = new Subject();
    interval(1000)
      .pipe(takeUntil(stream$))
      .subscribe(() => {
        if (status === "start") {
          setSeconds(val => val + 1000);
        }
      });
        return() =>{
          stream$.next()
          stream$.complete()
        }
  }, [status]);

  useEffect(()=>{
    const click = fromEvent(pauseRef.current, 'click')
    const doubleClick$ = click.pipe(buffer(click.pipe(debounceTime(300))),
    map(list => {return list.length}),
    filter(count => count === 2))
    doubleClick$.subscribe(() => setStatus("pause"))
  },[])
  const pauseRef = useRef(null)

  const startStopBtn =() => {
    if(status==='start'){
      setStatus("stop");
      setSeconds(0);
    }else if(status==='stop'){
      setStatus("start");
    }else{
      setStatus('start')
    }
  }
  const reset = () => {
    setSeconds(0);
  }

  return (
    <div>
      <div className='timer'> {new Date(seconds).toISOString().slice(11, 19)}</div>
      <div className="btnBlock">
        <button className='btn' onClick={startStopBtn}>start/stop</button>
        <button className='btn' onClick={reset}>Reset</button>
        <button className='btn' ref={pauseRef}>Wait</button>
      </div>
    </div>
  );
}
