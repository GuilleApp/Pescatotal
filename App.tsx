import React from "react";
import { SpotsProvider } from "./SpotsContext";
import Layout from "./Layout";

export default function App() {
  return (
    <SpotsProvider>
      <Layout />
    </SpotsProvider>
  );
}
