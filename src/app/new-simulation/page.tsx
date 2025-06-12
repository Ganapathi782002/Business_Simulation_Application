export const dynamic = 'force-dynamic';

import React from "react";
import { NewSimulationForm } from "@/components/new-simulation/new-simulation-form";

export default function NewSimulationPage(){
    return (
    <div className="flex flex-col items-center p-6 md:p-12">
      <NewSimulationForm />
    </div>
  );
};