"use client";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import React from "react";

import { useState } from "react";
import { FloatingIndicator, Tabs } from "@mantine/core";

function page() {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string | null>("1");
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };
  return (
    <div className="w-full">
      <Tabs
        variant="pills"
        value={value}
        onChange={setValue}
        className="w-full mx-auto"
      >
        <Tabs.List
          ref={setRootRef}
          className="w-full flex !justify-center !gap-20"
        >
          <Tabs.Tab value="1" ref={setControlRef("1")} className="z-1">
            ثبت نام
          </Tabs.Tab>
          <Tabs.Tab value="2" ref={setControlRef("2")} className="z-1 ">
            ورود
          </Tabs.Tab>

          <FloatingIndicator
            target={value ? controlsRefs[value] : null}
            parent={rootRef}
          />
        </Tabs.List>

        <Tabs.Panel value="1" className="w-3/4 mx-auto">
          <Register />
        </Tabs.Panel>
        <Tabs.Panel value="2" className="w-3/4 mx-auto">
          <Login />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default page;
