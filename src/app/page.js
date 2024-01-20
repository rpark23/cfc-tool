"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"

import View from "./view"

export default function Home() {
  const [language, setLanguage] = useState("English");
  const [zip, setZip] = useState("");
  const [county, setCounty] = useState("");
  const [pcp, setPCP] = useState("");
  const [view, setView] = useState("");

  const checkZip = (e) => {
    const zip = e.target.value;
    if (zip.length == 5) {
      const zipCodes = require("../data/zip_codes.json");
      const result = zipCodes.filter(
        row => row.zip == zip
      );
      if (result[0]) {
        setCounty(`${result[0].county}, ${result[0].state}`);
        setZip(zip);
      } else {
        setCounty("Zip Code Not Found");
      }
    } else {
      setCounty(null);
      setZip(null);
    }
  };

  useEffect(() => {
    if (county=="Santa Clara County, CA" && (language=="English")) {
      setPCP("Ravenswood");
    } else if (county=="Santa Clara County, CA" && language=="Mandarin") {
      setPCP("NEMS");
    } else if (county=="Santa Clara County, CA" && language=="Spanish") {
      setPCP("Gardner");
    } else if (county=="San Mateo County, CA") {
      setPCP("Samaritan House");
    } else if (county=="Alameda County, CA") {
      setPCP("Alameda Health Systems");
    } else {
      setPCP("");
      setView("");
    }
  }, [county, language]);

  return (
    <main className="flex justify-center">
      <div className="flex min-h-screen flex-col items-center justify-center w-[27rem]">
        <h3 className="text-lg -mt-8">Welcome to the</h3>
        <h1 className="text-3xl font-bold text-cardinal">Cardinal Free Clinics</h1>
        <h3 className="text-xl font-semibold">Referrals</h3>

        <p className="font-semibold mt-6 -ml-8 mb-2">Patient&apos;s preferred language:</p>
        <RadioGroup 
          defaultValue="english"
          value={language}
          onValueChange={setLanguage}
          className = "flex"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="English" id="english" />
            <Label htmlFor="english">English</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Mandarin" id="mandarin" />
            <Label htmlFor="mandarin">Mandarin</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Spanish" id="spanish" />
            <Label htmlFor="spanish">Spanish</Label>
          </div>
        </RadioGroup>

        <div className="flex mt-4 items-center">
          <p className="font-semibold -mt-1 mr-2">Zip code:</p>
          <Input type="text" placeholder="Ex. 94305" value={zip} onChange={checkZip} className="text-xs h-8 w-32 focus:outline-none" />
        </div>

        <p className="text-sm mt-2 h-4">{county}</p>
        
        <ToggleGroup value={view} onValueChange={setView} type="single" className="flex flex-col">
          {pcp ? 
            <ToggleGroupItem variant="outline" value="PCP" className="mt-8 w-60">
              PCP Referral <ChevronRightIcon className="h-4 w-4" />
            </ToggleGroupItem> :
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem variant="outline" value="PCP" className="mt-8 w-60" disabled>
                    PCP Referral <ChevronRightIcon className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <> {county ?
                    <p>No PCP found</p> : 
                    <p>No county selected</p>
                  } </>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
          }
          
          <ToggleGroupItem variant="outline" value="Imaging" className="mt-2 w-60">
            Imaging Info <ChevronRightIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem variant="outline" value="Labs" className="mt-2 w-60">
            Labs Info <ChevronRightIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {view ? 
        <View view={view} pcp={pcp} /> : null}
    </main>
  );
}
