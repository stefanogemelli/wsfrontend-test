"use client";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string, {
  withCredentials: true,
});

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { UUID } from "crypto";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [svMessages, setSvMessages] = useState<Array<{ id: UUID; data: string }>>([]);

  const listener = (arg: { id: UUID; data: string }) => {
    setSvMessages((prev) => [...prev, arg]);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("message:sv", listener);
    return () => {
      socket.off();
      socket.off("message:sv", listener);
    };
  }, []);
  console.log(svMessages);

  const sendMessage = (e: any) => {
    e.preventDefault();
    socket.emit("message:new", {
      id: crypto.randomUUID(),
      data: inputRef?.current?.value as string,
    });
    if (inputRef?.current?.value) {
      inputRef.current.value = "";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <form onSubmit={sendMessage}>
          <input className="text-black" name="message" ref={inputRef} type="text" />
          <button>Send Message</button>
        </form>
      </div>
      <div>
        {svMessages?.map((message) => (
          <p key={message.id}>{message.data}</p>
        ))}
      </div>
    </main>
  );
}
