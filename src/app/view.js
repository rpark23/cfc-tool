"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"

import info from "../data/referrals_info.json";
import { ExternalLink } from 'lucide-react';

export default function View(props) {
  const { view, pcp, language, clinic } = props;
  const [pageLanguage, setPageLanguage] = useState("English");
  
  useEffect(() => {
    if (view == "PCP") {
      const pcp_info = document.getElementById("pcp-info");
      pcp_info.innerHTML = info[view][pageLanguage][pcp].description;
    }
    if (view == "Imaging" || view == "Labs") {
      const location_info = document.getElementById("location-info");
      location_info.innerHTML = info[view][pageLanguage].location.info;
      const results = document.getElementById("results");
      results.innerHTML = info[view][pageLanguage].results;
    }
    if (view == "Imaging") {
      for (var i=0; i<info[view][pageLanguage].instructions.options.length; i++) {
        var option = document.getElementById(`option${i}`);
        option.children[0].className = "text-red-700";
      }
    }
  }, [view, pcp, language, clinic, pageLanguage]);

  const languageMap = {
    'English': { next: language, text: 'Translate to ' + language},
    'Spanish': { next: 'English', text: 'Translate to English' },
    'Mandarin': { next: 'English', text: 'Translate to English' },
  };
  
  const handleTranslate = () => {
    setPageLanguage(languageMap[pageLanguage].next);
  };
  
  const handleTranslateText = () => {
    return languageMap[pageLanguage].text;
  };

  return (
    <div className="flex min-h-screen flex-col items-center w-[calc(100vw-27rem)] bg-slate-50 p-10">
      <h2 className="mt-4 text-2xl font-bold">{info[view][pageLanguage].title}</h2>
      {view == "PCP" ?
        <div className="flex flex-col mt-4 w-full">
          {language == "English" ? null :
            <button onClick={handleTranslate} className="flex items-center absolute top-8 left-600 bg-cardinal px-4 py-2 rounded-md text-white hover: cursor-pointer">
              {handleTranslateText()}
            </button>
          } 
          {pcp == "Alameda Health Systems" ? null : 
          <a className="flex items-center absolute top-8 right-12 bg-cardinal px-4 py-2 rounded-md text-white hover: cursor-pointer"
          href={'https://drive.google.com/drive/u/0/folders/10F8mMgZk3S3_WXKhhTfj8lRC89xXUxGk'} target="_blank">Cover Sheet <ExternalLinkIcon className="ml-2" /></a>}
          <div>
            <p>{info[view][pageLanguage].description}</p>
            <div className="flex">
              <div className="border border-solid rounded-md mt-4 mr-6">
                <iframe src={info[view][pageLanguage][pcp].map} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" 
                className="w-[30vw] h-[30vw] rounded-md"/>
              </div>
              <div className="w-full">
                <div className="">
                  <div id="pcp-info" className="mt-4"></div>
                  <h2 className="mt-4 font-bold text-lg">{info[view][pageLanguage].nextsteps}</h2>
                  <ul className="list-disc ml-4">
                    {info[view][pageLanguage][pcp].steps.map((item, index) => (
                      <li key={index} dangerouslySetInnerHTML={{ __html: item }} className="mb-1"></li>
                    ))}
                  </ul>
                </div> 
              </div>
            </div> 
          </div>
        </div> : 
        <div className="flex mt-8 w-full">
            {language == "English" ? null :
              <button onClick={handleTranslate} className="flex items-center absolute top-8 left-108 bg-cardinal px-4 py-2 rounded-md text-white hover: cursor-pointer">
                {handleTranslateText()}
              </button>
            } 
          <div className="w-1/2 mr-8">
            <div className = "flex flex-col items-center">
              <img src={view == "Imaging" ? "/imaging.png" : "/labs.png"} className = "rounded-md" />
              <h3 className="mt-3 font-bold text-lg">{info[view][pageLanguage].location.title}</h3>
              <div id="location-info" className="mt-3"></div>
            </div>
          </div>
          <div className="w-1/2">
            <div>
              <ul className="list-disc ml-4">
                {info[view][pageLanguage].instructions.all.map((item, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} className="mb-1"></li>
                ))}
                {view == "Imaging" ? info[view][pageLanguage].instructions.options.map((item, index) => (
                  <li key={index} dangerouslySetInnerHTML={{ __html: item }} id={`option${index}`} className="mb-1"></li>
                )) : null}
              </ul>
              <div id="results" className="mt-6 border border-solid border-black rounded-md px-4 py-2"></div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
