"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateRequestModal from "./CreateRequestModal";
import { hardhat } from "viem/chains";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },

  {
    label: "My page",
    href: "/my-page",
  },
  {
    label: "Recommended",
    href: "/recommended",
  },
  {
    label: "Debug",
    href: "/debug",
  },
  {
    label: "Blockexplorer",
    href: "/blockexplorer",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-skyblue-100 font-bold text-skyblue-800" : "bg-transparent text-skyblue-700"
              } rounded-full px-5 py-2 text-sm grid grid-flow-col gap-2 shadow-none hover:bg-skyblue-50 transition`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;
  const [showCreateModal, setShowCreateModal] = useState(false);

  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <>
      <div className="sticky top-0 navbar bg-transparent min-h-0 shrink-0 justify-between z-50 pl-18">
        {/* Space for logo */}
        <div className="navbar-start w-auto lg:w-1/2">
          <div className="hidden lg:flex items-center ml-12">
            <div className="bg-beige-50 rounded-full shadow-md flex gap-2">
              <ul className="menu menu-horizontal gap-2">
                <HeaderMenuLinks />
              </ul>
            </div>
            <div className="relative group flex items-center">
              <button
                onClick={() => setShowCreateModal(true)}
                className="group flex items-center justify-center bg-skyblue-400 hover:bg-skyblue-500 text-white border-none shadow-md ml-4 rounded-full h-12 min-w-[3rem] w-auto transition-all duration-300 overflow-hidden relative px-0 group-hover:px-2"
              >
                <PlusIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                <span
                  className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto group-hover:ml-2 transition-all duration-300 whitespace-nowrap"
                  style={{ minWidth: 0 }}
                >
                  Request Insurance
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="navbar-end grow mr-12 pr-18">
          <RainbowKitCustomConnectButton />
          {isLocalNetwork && <FaucetButton />}
        </div>
      </div>

      <CreateRequestModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </>
  );
};
