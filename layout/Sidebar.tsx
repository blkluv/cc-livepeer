import React, { useState } from "react";
import {
  AiOutlineBulb,
  AiOutlineCompass,
  AiOutlineDribbble,
  AiOutlineFire,
  AiOutlineMenu,
  AiOutlinePlayCircle,
  AiOutlineSmile
} from "react-icons/ai";
import { IoGameControllerOutline, IoSchoolOutline, IoNewspaperOutline} from "react-icons/io5";
import {VscSymbolMisc} from "react-icons/vsc";
import {Tooltip} from "@nextui-org/react"
import { Colors } from "../constants/colors";

export default function Sidebar({ updateCategory }) {
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState(false);

  let color = "#878787";

  let categories = [
    {
      name: "All",
      icon: (
        <AiOutlineFire
          size={"25px"}
          color={active === "All" ? Colors.primary : color}
        />
      ),
      onClick: () => {
        setActive("All");
        updateCategory("");
      },
    },
    {
      name: "Travel",
      icon: (
        <AiOutlineCompass
          size={"25px"}
          color={active === "Travel" ? Colors.primary : color}
        />
      ),
      onClick: () => {
        setActive("Travel");
        updateCategory("Travel");
      },
    },
    {
      name: "Sports",
      icon: (
        <AiOutlineDribbble
          size={"25px"}
          color={active === "Sports" ? Colors.primary : color}
        />
      ),
      onClick: () => {
        setActive("Sports");
        updateCategory("Sports");
      },
    },
    {
      name: "Real Estate",
      icon: (
        <AiOutlinePlayCircle
          size={"25px"}
          color={active === "Real Estate" ? Colors.primary : color}
        />
      ),
      onClick: () => {
        setActive("Real Estate");
        updateCategory("Real Estate");
      },
    },

    {
      name: "Blockchain",
      icon: (
        <AiOutlineBulb
          size={"25px"}
          color={active === "Blockchain" ? Colors.primary : color}
        />
      ),
      onClick: () => {
        setActive("Blockchain");
        updateCategory("Blockchain");
      },
    },
    {
      name: "Gaming",
      icon: (
        <IoGameControllerOutline
          size={"25px"}
          color={active === "Gaming" ? Colors.primary : color}
        />
      ),
      onClick: () => {
        setActive("Gaming");
        updateCategory("Gaming");
      },
    },
    {
      name: "Inspiration",
      icon: (
        <AiOutlineSmile
          size={"25px"}
          color={active === "Inspiration" ? Colors.primary : color}
        />
      ),
      onClick: () => {
        setActive("Inspiration");
        updateCategory("Inspiration");
      },
    },
    {
      name: "NFTVersity",
      icon: (
        <IoSchoolOutline
          size={"25px"}
          color={active === "NFTVersity" ? Colors.primary : color}
        />
      ),
      onClick: () => {
        setActive("NFTVersity");
        updateCategory("NFTVersity");
      },
    },
    {
      name: "Donations",
      icon: (
        <IoNewspaperOutline
          size={"25px"}
          color={active === "Donations" ? Colors.primary : color}
        />
      ),
      onClick: () => {
        setActive("Donations");
        updateCategory("Donations");
      },
    },
    {
      name: "Spiritual",
      icon: (
        <VscSymbolMisc
          size={"25px"}
          color={active === "Spiritual" ? Colors.primary : color}
        />
      ),
      onClick: () => {
        setActive("Spiritual");
        updateCategory("Spiritual");
      },
    },
  ];

  return (
    <div className="border-r border-border-light dark:border-border-dark p-7 ">
      <AiOutlineMenu
        color={open ? Colors.primary : "#fff"}
        size="25px"
        className={open ? Colors.primary : "fill-icons-light dark:fill-white cursor-pointer"}
        onClick={() => setOpen(!open)}
      />
      <div className="my-20 flex flex-col  justify-between h-96">
        {categories.map((category, index) => (
          <div className="flex flex-row">
            { !open ? 
            (
              <Tooltip content={category.name}>
              <div
                className="cursor-pointer"
                onClick={category.onClick}
                key={index}
              >
                {category.icon}
            </div>
            </Tooltip>)
            :
            (
              <div
                className="cursor-pointer"
                onClick={category.onClick}
                key={index}
              >
                {category.icon}
                {<div className="flex flex-row">
                  <span 
                  className={active === category.name ? Colors.primary : "text-sm font-medium text-text-light dark:text-text-dark"}
                  // color={active === category.name ? Colors.primary : color}
                  >
                    {category.name}
                  </span>
                </div>}
            </div> ) 
                  }
          </div>
        ))}
      </div>
    </div>
  );
}
