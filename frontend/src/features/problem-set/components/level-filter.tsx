import * as React from "react";

import { Button } from "../../../components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { CaretDownIcon } from "@phosphor-icons/react";

type LevelFilterProps = {
  level: string;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
};

export function LevelFilter({
  level,
  setLevel,
}: LevelFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
        Level : {level} <CaretDownIcon size={32} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>
          Select level
        </DropdownMenuLabel>

        <DropdownMenuRadioGroup
          value={level}
          onValueChange={setLevel}
        >
          <DropdownMenuRadioItem value="All">
            All
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="Easy">
            Easy
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="Medium">
            Medium
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="Hard">
            Hard
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}