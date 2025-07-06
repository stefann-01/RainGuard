"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateRequestModal from "./CreateRequestModal";
import { hardhat } from "viem/chains";
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
      <div className="sticky top-0 navbar bg-beige-200 shadow-md min-h-0 shrink-0 z-50">
        <div className="navbar-start flex items-center ml-22">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={30} height={9} className="mr-2" />
            <span className="font-futura-bold font-bold text-xl text-beige-900">RainGuard</span>
          </div>
        </div>

        <div className="navbar-center">
          <div className="bg-beige-50 rounded-full shadow-md">
            <ul className="menu menu-horizontal gap-2">
              <HeaderMenuLinks />
            </ul>
          </div>
        </div>

        <div className="navbar-end mr-22">
          <RainbowKitCustomConnectButton />
          {isLocalNetwork && <FaucetButton />}
        </div>
      </div>

      <CreateRequestModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </>
  );
};
